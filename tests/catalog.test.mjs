import test from 'node:test';
import assert from 'node:assert/strict';
import { filterMods } from '../src/catalog.ts';
const mods = [
 {id:'meter', name:'Token Meter', description:'Read token usage', category:'Context', kind:'source', tags:['usage'], featured:true},
 {id:'tasks', name:'Task Checklist', description:'Track tasks', category:'Workflow', kind:'recipe', tags:['planning'], featured:false},
];
test('search matches descriptions and tags, regardless of letter case', () => {
 assert.deepEqual(filterMods(mods,{query:'  USAGE  '}).map(m=>m.id),['meter']);
 assert.deepEqual(filterMods(mods,{query:'planning'}).map(m=>m.id),['tasks']);
});
test('saved, category and search filters are combined', () => {
 assert.deepEqual(filterMods(mods,{view:'saved',saved:['tasks'],category:'Context'}),[]);
 assert.deepEqual(filterMods(mods,{view:'saved',saved:['tasks'],query:'task'}).map(m=>m.id),['tasks']);
});
test('source filter and alphabetical sort do not mutate the catalog', () => {
 assert.deepEqual(filterMods(mods,{view:'source'}).map(m=>m.id),['meter']);
 assert.deepEqual(filterMods(mods,{sort:'name'}).map(m=>m.id),['tasks','meter']);
 assert.equal(mods[0].id,'meter');
});

test('catalog entries have distinct routes and accurate source labels', async () => {
 const { readMods } = await import('../scripts/read-mods.mjs');
 const catalog = await readMods();
 assert.equal(new Set(catalog.map(mod=>mod.id)).size, catalog.length);
 for (const mod of catalog) {
   assert.match(mod.id, /^[a-z][a-z0-9-]+$/);
   assert.equal(mod.kind === 'source', Boolean(mod.source?.trim() || Object.values(mod.agents).some(config=>config.source?.trim())), mod.id);
   assert.ok(mod.prompt.trim(), `${mod.id} needs a usable prompt`);
 }
});

test('agent filters include shared entries while both excludes single-agent entries', async () => {
 const { readMods } = await import('../scripts/read-mods.mjs');
 const catalog = await readMods();
 assert.equal(filterMods(catalog,{agent:'mint'}).length,10);
 assert.deepEqual(filterMods(catalog,{agent:'both'}).map(mod=>mod.id),['token-weather','blast-radius','replay-theater']);
 assert.deepEqual(filterMods(catalog,{agent:'claude-code'}).map(mod=>mod.id),['token-weather','blast-radius','replay-theater']);
 assert.deepEqual(filterMods(catalog,{agent:'claude-code',category:'Workflow'}).map(mod=>mod.id),['replay-theater']);
 assert.equal(filterMods(catalog,{agent:'both',view:'saved',saved:[]}).length,0);
});
