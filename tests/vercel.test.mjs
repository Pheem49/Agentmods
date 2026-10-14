import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';
import { createStatsApi } from '../server/stats-api.mjs';
import { createUpstashStore } from '../server/upstash-store.mjs';
import { createDefaultStatsStore, redisConfiguration } from '../server/stats-storage.mjs';
import { readMods } from '../scripts/read-mods.mjs';

const since='2026-10-14T00:00:00.000Z';
function response() {return {headers:{},setHeader(k,v){this.headers[k]=v;},writeHead(status,headers){this.status=status;Object.assign(this.headers,headers);this.headersSent=true;},end(text){this.data=JSON.parse(text);}};}
const catalog=[{id:'weather',adaptationPrompt:true,agents:{}}];
test('serverless API handles pre-parsed bodies and awaits asynchronous persistence',async()=>{
 let count=0,context;
 const api=createStatsApi({catalog,env:{VERCEL:'1'},storeFactory:async()=>({async snapshot(){return {version:1,since,counts:{weather:count}};},async record(id,variant,eventId,ctx){await Promise.resolve();context=ctx;return {modId:id,count:++count,since};},close(){}})});
 const req={url:'/api/mods/weather/prompt-copy',method:'POST',headers:{host:'agentmods.example','content-type':'application/json',origin:'https://agentmods.example','x-vercel-forwarded-for':'203.0.113.4'},body:{eventId:randomUUID(),variant:'adapt'}};
 const res=response();await api.handle(req,res);assert.equal(res.status,200);assert.equal(res.data.count,1);assert.equal(context.peer,'203.0.113.4');
 const get=response();await api.handle({url:'/api/prompt-copies',method:'GET',headers:{}},get);assert.equal(get.data.counts.weather,1);
 const bad=response();await api.handle({...req,body:'{invalid'},bad);assert.equal(bad.status,400);
 const oversized=response();await api.handle({...req,body:{large:'x'.repeat(5000)}},oversized);assert.equal(oversized.status,413);
 await api.close();
});
test('Vercel missing Redis credentials fails explicitly instead of opening a local database',async()=>{
 await assert.rejects(()=>createDefaultStatsStore({env:{VERCEL:'1'}}),/Connect Redis/);
 assert.throws(()=>redisConfiguration({UPSTASH_REDIS_REST_URL:'https://db.example'}),/both required/);
 assert.equal(redisConfiguration({KV_REST_API_URL:'https://db.example',KV_REST_API_TOKEN:'test',VERCEL_ENV:'preview'}).namespace,'preview');
 assert.equal(redisConfiguration({UPSTASH_REDIS_REST_URL:'https://db.example',UPSTASH_REDIS_REST_TOKEN:'test',VERCEL_ENV:'production'}).namespace,'production');
});
test('Upstash adapter uses authenticated REST scripts and validates responses',async()=>{
 const commands=[];
 const store=createUpstashStore({url:'https://redis.example',token:'secret-token',namespace:'preview',request:async(url,options)=>{
  assert.equal(url,'https://redis.example/');assert.equal(options.headers.Authorization,'Bearer secret-token');
  const command=JSON.parse(options.body);commands.push(command);
  return Response.json({result:command[2]===2?[since,'3','0']:[200,4,0,since]});
 }});
 assert.deepEqual((await store.snapshot(['weather','other'])).counts,{weather:3,other:0});
 assert.equal((await store.record('weather','adapt',randomUUID(),{peer:'203.0.113.9'})).count,4);
 assert.equal(commands[0][0],'EVAL');assert.ok(commands[1][3].includes('{preview}'));
 assert.ok(!JSON.stringify(commands).includes('203.0.113.9'));
 const failure=createUpstashStore({url:'https://redis.example',token:'secret-token',request:async()=>Response.json({error:'invalid secret-token'})});
 await assert.rejects(()=>failure.snapshot(['weather']),error=>!error.message.includes('secret-token'));
 const conflict=createUpstashStore({url:'https://redis.example',token:'test',request:async()=>Response.json({result:[409]})});
 await assert.rejects(()=>conflict.record('weather','adapt',randomUUID()),error=>error.status===409);
 assert.throws(()=>createUpstashStore({url:'http://redis.example',token:'test'}),/Invalid/);
});
test('Vercel manifest includes all current variants and routes share one function',async()=>{
 const manifest=JSON.parse(await readFile(new URL('../server/api-catalog.json',import.meta.url),'utf8'));
 const mods=await readMods();assert.equal(manifest.length,mods.length);
 for (const mod of mods) {
  const entry=manifest.find(entry=>entry.id===mod.id);assert.equal(entry.adaptationPrompt,Boolean(mod.adaptationPrompt));assert.deepEqual(Object.keys(entry.agents),Object.keys(mod.agents));
 }
 const config=JSON.parse(await readFile(new URL('../vercel.json',import.meta.url),'utf8'));
 assert.equal(config.outputDirectory,'dist');assert.equal(config.framework,'vite');
 assert.ok(config.rewrites.every(route=>route.destination.startsWith('/api/stats?route=')));
});

test('shared function resolves both rewritten route forms and reuses the API',async()=>{
 const {createVercelHandler}=await import('../server/vercel-handler.mjs');let creations=0;const paths=[];
 const handler=createVercelHandler(()=>{creations++;return {async handle(req,res){paths.push(req.url);res.writeHead(200);res.end('{}');return true;}};});
 await handler({url:'/api/stats',query:{route:'prompt-copies'}},response());
 await handler({url:'/api/stats?route=mods/weather/prompt-copy'},response());
 assert.deepEqual(paths,['/api/prompt-copies','/api/mods/weather/prompt-copy']);assert.equal(creations,1);
});
