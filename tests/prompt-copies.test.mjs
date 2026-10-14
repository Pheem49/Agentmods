import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { randomUUID } from 'node:crypto';
import { createServer } from 'node:http';
import { once } from 'node:events';
import { createStatsStore } from '../server/stats-store.mjs';
import { createStatsApi } from '../server/stats-api.mjs';
import { createAppServer } from '../server/serve.mjs';
import { parseSnapshot, mergeSnapshots, sendCopyEvent } from '../src/prompt-copies.ts';

const catalog=[{id:'weather',adaptationPrompt:'Create weather',agents:{mint:{},'claude-code':{}}},{id:'recipe',adaptationPrompt:'Create recipe',agents:{}}];
async function serve(t, options={}) {
 const api=createStatsApi({catalog,dbPath:':memory:',...options});
 const server=createServer((req,res)=>{api.handle(req,res).then(handled=>{if (!handled) {res.writeHead(404);res.end();}});});
 server.listen(0,'127.0.0.1');await once(server,'listening');
 t.after(async()=>{await new Promise(resolve=>server.close(resolve));await api.close();});
 return `http://127.0.0.1:${server.address().port}`;
}
function post(base,id,body,headers={}) {return fetch(`${base}/api/mods/${id}/prompt-copy`,{method:'POST',headers:{'Content-Type':'application/json',...headers},body:JSON.stringify(body)});}

test('copies persist across restarts and multiple connections, with idempotent retries',async()=>{
 const dir=await mkdtemp(join(tmpdir(),'agentmods-copies-'));const path=join(dir,'copies.sqlite');
 const first=await createStatsStore(path);const eventId=randomUUID();
 assert.equal(first.record('weather','adapt',eventId).count,1);
 assert.equal(first.record('weather','adapt',eventId).duplicate,true);
 assert.throws(()=>first.record('weather','mint',eventId),/already used/);
 const second=await createStatsStore(path);
 assert.equal(second.record('weather','mint',randomUUID()).count,2);
 assert.equal(first.snapshot(['weather','recipe']).counts.weather,2);
 second.close();first.close();
 const reopened=await createStatsStore(path);assert.equal(reopened.snapshot(['weather']).counts.weather,2);reopened.close();
});
test('storage failure does not replace corrupt statistics with empty totals',async()=>{
 const dir=await mkdtemp(join(tmpdir(),'agentmods-corrupt-'));const path=join(dir,'copies.sqlite');
 await writeFile(path,'not a database');await assert.rejects(()=>createStatsStore(path));
 assert.equal(await readFile(path,'utf8'),'not a database');
});
test('receipt capacity failure rolls back rather than reporting an unpersisted count',async()=>{
 const store=await createStatsStore(':memory:',{maxReceipts:1});
 const id=randomUUID();store.record('weather','adapt',id);
 assert.throws(()=>store.record('weather','adapt',randomUUID()),/temporarily busy/);
 assert.equal(store.snapshot(['weather']).counts.weather,1);
 assert.equal(store.record('weather','adapt',id).duplicate,true);store.close();
});
test('API aggregates independent browser events and does not count invalid actions',async t=>{
 const base=await serve(t);const eventId=randomUUID();
 const initial=await (await fetch(`${base}/api/prompt-copies`)).json();assert.deepEqual(initial.counts,{weather:0,recipe:0});
 await Promise.all(Array.from({length:8},()=>post(base,'weather',{eventId,variant:'adapt'})));
 await post(base,'weather',{eventId:randomUUID(),variant:'mint'});
 assert.equal((await (await fetch(`${base}/api/prompt-copies`)).json()).counts.weather,2);
 for(const [id,body,status] of [
  ['weather',{eventId:randomUUID(),variant:'source'},400],['recipe',{eventId:randomUUID(),variant:'mint'},400],
  ['weather',{eventId:'invalid',variant:'adapt'},400],['missing',{eventId:randomUUID(),variant:'adapt'},404],
  ['weather',{eventId:randomUUID(),variant:'adapt',prompt:'secret'},400],['recipe',{eventId,variant:'adapt'},409]
 ]) assert.equal((await post(base,id,body)).status,status);
 assert.deepEqual((await (await fetch(`${base}/api/prompt-copies`)).json()).counts,{weather:2,recipe:0});
});
test('API rejects cross-origin writes, wrong methods, oversized bodies and rate bursts',async t=>{
 const base=await serve(t,{rateLimit:2});
 assert.equal((await post(base,'weather',{eventId:randomUUID(),variant:'adapt'},{Origin:'https://other.example'})).status,403);
 assert.equal((await fetch(`${base}/api/mods/weather/prompt-copy`)).status,405);
 assert.equal((await fetch(`${base}/api/mods/weather/prompt-copy`,{method:'POST',body:'{}'})).status,415);
 assert.equal((await post(base,'weather',{eventId:randomUUID(),variant:'adapt',large:'x'.repeat(5000)})).status,413);
 assert.equal((await post(base,'weather',{eventId:randomUUID(),variant:'adapt'})).status,200);
 assert.equal((await post(base,'weather',{eventId:randomUUID(),variant:'adapt'})).status,429);
});
test('client retries uncertain responses with the same event ID and merges out-of-order totals',async()=>{
 let attempts=0;const bodies=[];const eventId=randomUUID();
 const result=await sendCopyEvent('weather','adapt',eventId,async(_url,options)=>{
  bodies.push(options.body);if (++attempts===1) throw new Error('Lost response');
  return new Response(JSON.stringify({modId:'weather',count:3,since:'2026-10-14T00:00:00Z'}));
 });
 assert.equal(result.count,3);assert.equal(bodies[0],bodies[1]);
 const ids=['weather'];const newer=parseSnapshot({version:1,since:'2026-10-14T00:00:00Z',counts:{weather:5}},ids);
 const older={...newer,counts:{weather:3}};
 assert.equal(mergeSnapshots(newer,older).counts.weather,5);
 assert.throws(()=>parseSnapshot({version:1,since:'2026-10-14T00:00:00Z',counts:{weather:-1}},ids));
 let calls=0;await assert.rejects(()=>sendCopyEvent('weather','adapt',eventId,async()=>{calls++;return new Response('{}',{status:429});}));assert.equal(calls,1);
});
test('production server serves built-style assets and excludes private paths and unknown APIs',async t=>{
 const dir=await mkdtemp(join(tmpdir(),'agentmods-web-'));
 await writeFile(join(dir,'index.html'),'<html>Agentmods</html>');await writeFile(join(dir,'.private'),'private');
 const server=await createAppServer({dist:dir,dbPath:':memory:',catalog});
 server.listen(0,'127.0.0.1');await once(server,'listening');t.after(()=>new Promise(resolve=>server.close(resolve)));
 const base=`http://127.0.0.1:${server.address().port}`;
 assert.match(await (await fetch(base)).text(),/Agentmods/);
 assert.equal((await fetch(`${base}/.private`)).status,404);
 assert.equal((await fetch(`${base}/api/missing`)).status,404);
 assert.equal((await fetch(`${base}/missing.js`)).status,404);
 assert.deepEqual((await (await fetch(`${base}/api/prompt-copies`)).json()).counts,{weather:0,recipe:0});
});
