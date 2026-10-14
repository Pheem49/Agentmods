// Isolated production UI QA. Requires an installed Chrome/Chromium executable.
import assert from 'node:assert/strict';
import { mkdtemp, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { createAppServer } from '../server/serve.mjs';

const artifacts=await mkdtemp(join(tmpdir(),'agentmods-browser-'));
const server=await createAppServer({dbPath:join(artifacts,'copies.sqlite')});
server.listen(0,'127.0.0.1');await once(server,'listening');
const base=`http://127.0.0.1:${server.address().port}`;
const chrome=spawn(process.env.CHROME_BIN || 'google-chrome',['--headless=new','--disable-gpu','--no-first-run','--no-default-browser-check','--remote-debugging-port=0',`--user-data-dir=${join(artifacts,'profile')}`,'about:blank'],{stdio:['ignore','ignore','pipe']});
let stderr='';
const endpoint=await new Promise((resolve,reject)=>{
 const timer=setTimeout(()=>reject(new Error(`Chrome did not start: ${stderr.slice(-1000)}`)),15000);
 chrome.stderr.on('data',chunk=>{stderr+=chunk;const match=stderr.match(/DevTools listening on (ws:\/\/[^\s]+)/);if(match){clearTimeout(timer);resolve(match[1]);}});
 chrome.once('error',error=>{clearTimeout(timer);reject(error);});
 chrome.once('exit',code=>{clearTimeout(timer);reject(new Error(`Chrome exited ${code}: ${stderr.slice(-1000)}`));});
});
const socket=new WebSocket(endpoint);await once(socket,'open');
let seq=0;const pending=new Map();const events=[];const errors=[];
socket.onmessage=event=>{
 const message=JSON.parse(event.data);
 if(message.id){const result=pending.get(message.id);pending.delete(message.id);if(message.error)result.reject(new Error(JSON.stringify(message.error)));else result.resolve(message.result);}
 else {events.push(message);if(message.method==='Runtime.exceptionThrown')errors.push(message.params.exceptionDetails.text);}
};
function call(method,params={},sessionId){return new Promise((resolve,reject)=>{const id=++seq;pending.set(id,{resolve,reject});socket.send(JSON.stringify({id,method,params,...(sessionId?{sessionId}:{})}));});}
let session;
async function evaluate(expression){const result=await call('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true},session);if(result.exceptionDetails)throw new Error(JSON.stringify(result.exceptionDetails));return result.result.value;}
async function until(expression,label){for(let i=0;i<100;i++){if(await evaluate(`Boolean(${expression})`))return;await new Promise(resolve=>setTimeout(resolve,50));}throw new Error(`Timed out: ${label}`);}
async function screenshot(name){const shot=await call('Page.captureScreenshot',{format:'png',captureBeyondViewport:false},session);await writeFile(join(artifacts,name),Buffer.from(shot.data,'base64'));}
try {
 const {targetId}=await call('Target.createTarget',{url:'about:blank'});
 ({sessionId:session}=await call('Target.attachToTarget',{targetId,flatten:true}));
 await call('Page.enable',{},session);await call('Runtime.enable',{},session);
 await call('Emulation.setDeviceMetricsOverride',{width:1440,height:1100,deviceScaleFactor:1,mobile:false},session);
 await call('Page.navigate',{url:`${base}/#/mods/token-weather`},session);
 await until(`document.querySelector('.prompt-copy-stat strong')?.textContent==='0'`,'initial shared counts');
 assert.equal(await evaluate(`document.querySelector('.mod-overview .readiness-label').textContent`),'Creation recipe');
 assert.equal(await evaluate(`document.querySelectorAll('.verification-label').length`),2);
 assert.ok(await evaluate(`Array.from(document.querySelectorAll('.verification-label')).every(el=>el.textContent==='Not verified')`));
 assert.ok(await evaluate(`document.querySelector('.mod-overview').compareDocumentPosition(document.querySelector('.prompt-box')) & Node.DOCUMENT_POSITION_FOLLOWING`));
 assert.ok(await evaluate(`document.querySelector('.changelog time').dateTime==='2026-10-14'`));
 await screenshot('detail-desktop.png');
 // Deterministic clipboard behavior: tests count only successful Copy prompt actions.
 await evaluate(`Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async text=>{window.lastCopied=text}}});document.querySelector('.prompt-box-heading .copy-button').click()`);
 await until(`document.querySelector('.prompt-copy-stat strong')?.textContent==='1'`,'successful copy increments');
 await evaluate(`Array.from(document.querySelectorAll('.agent-selector button')).find(el=>el.textContent==='Mint').click()`);
 assert.equal(await evaluate(`document.querySelector('.mod-overview .readiness-label').textContent`),'Reference source');
 await evaluate(`Array.from(document.querySelectorAll('.detail-tabs button')).find(el=>el.textContent==='Source').click()`);
 await until(`document.querySelector('.prompt-box-heading .copy-button').getAttribute('aria-label')==='Copy source'`,'source tab rendered');
 await evaluate(`document.querySelector('.prompt-box-heading .copy-button').click()`);
 await new Promise(resolve=>setTimeout(resolve,200));
 assert.equal(await evaluate(`document.querySelector('.prompt-copy-stat strong').textContent`),'1');
 await evaluate(`Array.from(document.querySelectorAll('.agent-selector button')).find(el=>el.textContent==='Claude Code').click()`);
 assert.equal(await evaluate(`document.querySelector('.mod-overview .readiness-label').textContent`),'Installable package');
 await evaluate(`Array.from(document.querySelectorAll('.copy-button')).find(el=>el.textContent.includes('Copy install command')).click()`);
 await new Promise(resolve=>setTimeout(resolve,200));assert.equal(await evaluate(`document.querySelector('.prompt-copy-stat strong').textContent`),'1');
 await evaluate(`Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async()=>{throw Error('denied')}}});document.execCommand=()=>false;document.querySelector('.prompt-box-heading .copy-button').click()`);
 await until(`document.querySelector('.toast').textContent.includes('Copy is unavailable')`,'clipboard failure feedback');
 assert.equal(await evaluate(`document.querySelector('.prompt-copy-stat strong').textContent`),'1');
 await evaluate(`document.querySelector('.toast button').click()`);
 await evaluate(`window.location.hash='/'`);await until(`document.querySelector('.mod-list')`,'catalog');
 await evaluate(`const select=document.querySelector('#sort');select.value='copies';select.dispatchEvent(new Event('change',{bubbles:true}))`);
 assert.equal(await evaluate(`document.querySelector('.mod-main').getAttribute('href')`),'#/mods/token-weather');
 await evaluate(`document.querySelector('#directory').scrollIntoView({behavior:'instant'})`);await screenshot('catalog-desktop.png');
 await evaluate(`window.location.hash='/mods/workspace-map'`);await until(`document.querySelector('h1')?.textContent==='Workspace Map'`,'neutral-only entry');
 assert.equal(await evaluate(`document.querySelectorAll('.agent-selector button').length`),1);
 assert.ok(await evaluate(`document.querySelector('.harness-verification').textContent.includes('No harness implementation is listed')`));
 await call('Emulation.setDeviceMetricsOverride',{width:375,height:812,deviceScaleFactor:1,mobile:true},session);
 await call('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]},session);
 assert.ok(await evaluate(`document.documentElement.scrollWidth<=window.innerWidth`),'mobile overflow');
 await screenshot('detail-mobile.png');
 await evaluate(`window.location.hash='/'`);await until(`document.querySelector('.mod-list')`,'mobile catalog');
 assert.ok(await evaluate(`document.documentElement.scrollWidth<=window.innerWidth`),'mobile catalog overflow');
 await evaluate(`document.querySelector('#directory').scrollIntoView({behavior:'instant'})`);await screenshot('catalog-mobile.png');
 await call('Emulation.setDeviceMetricsOverride',{width:812,height:375,deviceScaleFactor:1,mobile:true},session);
 assert.ok(await evaluate(`document.documentElement.scrollWidth<=window.innerWidth`),'landscape overflow');
 // An absent statistics service must not display invented zero totals or block copying.
 await call('Page.addScriptToEvaluateOnNewDocument',{source:`const originalFetch=window.fetch;window.fetch=(url,options)=>String(url).startsWith('/api/')?Promise.resolve(new Response('{}',{status:503})):originalFetch(url,options);`},session);
 await call('Page.navigate',{url:`${base}/?offline=1#/mods/session-handoff`},session);
 await until(`document.querySelector('.prompt-copy-stat strong')?.textContent==='Unavailable'`,'statistics unavailable');
 await evaluate(`Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async text=>{window.lastCopied=text}}});document.querySelector('.prompt-box-heading .copy-button').click()`);
 await until(`document.querySelector('.toast').textContent.includes('Prompt copied. Copy statistics')`,'copy still succeeds without stats');
 assert.ok(await evaluate(`window.lastCopied.includes('session-handoff')`));
 assert.deepEqual(errors,[],'browser exceptions');
 console.log(`Browser QA passed: clipboard success/failure, source/install exclusions, readiness, per-harness verification, Most copied, neutral-only entries, mobile/landscape layout, and offline statistics. Screenshots: ${artifacts}`);
} finally {
 socket.close();chrome.kill('SIGTERM');await new Promise(resolve=>server.close(resolve));
}
