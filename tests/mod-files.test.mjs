import test from 'node:test';
import assert from 'node:assert/strict';
import { loadModFiles } from '../src/mod-files.ts';
const path = '/mods/example/MOD.md';
const document = `---
id: example
name: Example mod
category: Context
author: Agentmods
compatibility: Mint Mods v1
tags: [context, usage]
---

## Description
A helpful mod.

## Features
- A useful display

## Prompt
Create a mod.

### Requirements
Keep these headings.

\`\`\`markdown
## Description
This is prompt content, not the mod description.
\`\`\`
`;
test('Markdown files supply metadata and copy only the complete prompt body', () => {
 const [mod] = loadModFiles({[path]:document});
 assert.equal(mod.description,'A helpful mod.');
 assert.deepEqual(mod.features,['A useful display']);
 assert.equal(mod.sdk,'Mint Mods v1');
 assert.equal(mod.kind,'recipe');
 assert.equal(mod.prompt, 'Create a mod.\n\n### Requirements\nKeep these headings.\n\n```markdown\n## Description\nThis is prompt content, not the mod description.\n```');
});
test('source and preview resolve relative to their own mod directory', () => {
 const text=document.replace('tags:', 'source: main.ts\npreview: preview.png\ntags:');
 const [mod]=loadModFiles({[path]:text},{'/mods/example/main.ts':'export function register() {}'},{'/mods/example/preview.png':'/assets/preview-hash.png'});
 assert.equal(mod.kind,'source');
 assert.equal(mod.source,'export function register() {}');
 assert.equal(mod.preview,'/assets/preview-hash.png');
});
test('bad frontmatter, missing prompts and mismatched folder IDs fail with file context', () => {
 for (const text of [document.replace('category: Context','category: Other'),document.replace('id: example','id: other'),document.replace('## Prompt','## Missing'),document.replace('tags: [context, usage]','tags: nope'),document.replace('name: Example mod','name: 42')]) {
  assert.throws(()=>loadModFiles({[path]:text}), /\/mods\/example\/MOD\.md/);
 }
});
test('missing assets and directory escapes cannot become source or preview links', () => {
 for(const line of ['source: main.ts','source: ../private.ts','preview: missing.png','preview: https://example.com/image.png']) {
  assert.throws(()=>loadModFiles({[path]:document.replace('tags:',`${line}\ntags:`)}), /\/mods\/example\/MOD\.md/);
 }
});
test('duplicate IDs cannot silently overwrite a detail-page route', () => {
 assert.throws(()=>loadModFiles({[path]:document,'/another/mods/example/MOD.md':document}), /Duplicate mod ID: example/);
});

test('legacy entries remain Mint-only and have no invented install command', () => {
 const [mod] = loadModFiles({[path]:document});
 assert.deepEqual(Object.keys(mod.agents), ['mint']);
 assert.equal(mod.agents.mint.prompt, mod.prompt);
 assert.equal(mod.agents.mint.installCommand, null);
});
test('adaptation content stays separate from implementation prompts and source', () => {
 const neutral = 'Create a mod for my current agent.\n\nInspect its extension APIs.';
 const [mod] = loadModFiles({[path]:document.replace('## Prompt', `## Adaptation prompt\n\n${neutral}\n\n## Prompt`)});
 assert.equal(mod.adaptationPrompt, neutral);
 assert.equal(mod.agents.mint.prompt, mod.prompt);
 assert.ok(!mod.prompt.includes(neutral));
 assert.throws(() => loadModFiles({[path]:document.replace('## Prompt', '## Adaptation prompt\nFirst.\n\n## Adaptation prompt\nSecond.\n\n## Prompt')}), /Duplicate Adaptation prompt section/);
});
test('every catalog mod provides an adaptation recipe without platform install instructions', async () => {
 const { readMods } = await import('../scripts/read-mods.mjs');
 for (const mod of await readMods()) {
  assert.match(mod.adaptationPrompt, /First identify the current agent harness/, mod.id);
  assert.match(mod.adaptationPrompt, /Do not invent APIs, events, or usage measurements/, mod.id);
  assert.match(mod.adaptationPrompt, /explain how to enable it/, mod.id);
  assert.doesNotMatch(mod.adaptationPrompt, /Make me a Mint mod|\.mint-mods\/|claude plugin install/, mod.id);
 }
});
test('neutral-only recipes use the body without claiming an agent implementation', () => {
 const text = document.replace('tags:', 'agents: {}\nadaptationPrompt: body\nrequiredCapabilities: [Conversation access, Panel output]\ntags:');
 const [mod] = loadModFiles({[path]:text});
 assert.equal(mod.adaptationPrompt, mod.prompt);
 assert.deepEqual(mod.agents, {});
 assert.deepEqual(mod.requiredCapabilities, ['Conversation access', 'Panel output']);
 assert.equal(mod.kind, 'recipe');
 for (const broken of [text.replace('adaptationPrompt: body', 'adaptationPrompt: true'), text.replace('requiredCapabilities: [Conversation access, Panel output]', 'requiredCapabilities: panel')]) {
  assert.throws(() => loadModFiles({[path]:broken}), /\/mods\/example\/MOD\.md/);
 }
});
test('new recipes retain their full specifications and have no platform package or source', async () => {
 const { readMods } = await import('../scripts/read-mods.mjs');
 const catalog = await readMods();
 for (const id of ['session-handoff', 'tool-timeline', 'checks-summary', 'workspace-map']) {
  const mod = catalog.find(mod => mod.id === id);
  assert.ok(mod, id);
  assert.equal(mod.adaptationPrompt, mod.prompt);
  assert.deepEqual(mod.agents, {});
  assert.equal(mod.source, null);
  assert.equal(mod.kind, 'recipe');
  assert.ok(mod.preview, id);
  assert.ok(mod.requiredCapabilities.length >= 3, id);
  for (const heading of ['What it is and what it can do', 'What it should look like', 'State and access', 'Validation examples', 'Compatibility and completion']) {
   assert.ok(mod.prompt.includes(`### ${heading}`), `${id}: ${heading}`);
  }
 }
});
test('each agent gets its own prompt, install command, source and compatibility', () => {
 const text=document.replace('tags:', `agents:
  mint:
    prompt: body
    source: main.ts
  claude-code:
    prompt: Build a Claude Code mod.
    compatibility: Claude Code terminal
    installCommand: claude plugin install example@verified-marketplace
    installNotes: Add the marketplace first.
tags:`);
 const [mod]=loadModFiles({[path]:text},{'/mods/example/main.ts':'Mint source'});
 assert.equal(mod.agents.mint.prompt, mod.prompt);
 assert.equal(mod.agents.mint.source, 'Mint source');
 assert.equal(mod.agents.mint.installCommand,null);
 assert.equal(mod.agents['claude-code'].prompt,'Build a Claude Code mod.');
 assert.equal(mod.agents['claude-code'].source,null);
 assert.equal(mod.agents['claude-code'].compatibility,'Claude Code terminal');
 assert.equal(mod.agents['claude-code'].installCommand,'claude plugin install example@verified-marketplace');
});
test('invalid agent configs fail rather than reusing a different agent prompt', () => {
 for(const config of ['[]','{}','{other: {prompt: body}}','{mint: null}','{claude-code: {}}','{mint: {prompt: body, installCommand: 42}}','{mint: {prompt: body, repository: "javascript:alert(1)"}}']) {
  assert.throws(()=>loadModFiles({[path]:document.replace('tags:',`agents: ${config}\ntags:`)}), /\/mods\/example\/MOD\.md/);
 }
});
test('Claude-only entries explicitly use the body prompt without exposing Mint', () => {
 const [mod]=loadModFiles({[path]:document.replace('tags:','agents: {claude-code: {prompt: body}}\ntags:')});
 assert.deepEqual(Object.keys(mod.agents),['claude-code']);
 assert.equal(mod.agents['claude-code'].prompt,mod.prompt);
});

test('screenshots and mjs source are scoped to the selected agent', () => {
 const config=`agents:
  mint:
    prompt: body
  claude-code:
    prompt: Claude prompt
    source: example.mjs
    license: Apache-2.0
    screenshots:
      - file: pane.png
        alt: Claude pane
`;
 const [mod]=loadModFiles({[path]:document.replace('tags:',config+'tags:')},{'/mods/example/example.mjs':'export function register() {}'},{'/mods/example/pane.png':'/assets/pane.png'});
 assert.deepEqual(mod.agents.mint.screenshots,[]);
 assert.deepEqual(mod.agents['claude-code'].screenshots,[{url:'/assets/pane.png',alt:'Claude pane'}]);
 assert.equal(mod.agents['claude-code'].license,'Apache-2.0');
 assert.equal(mod.kind,'source');
 for(const broken of [config.replace('pane.png','../pane.png'),config.replace('        alt: Claude pane',''),config.replace('screenshots:\n      - file: pane.png\n        alt: Claude pane','screenshots: nope')]) {
  assert.throws(()=>loadModFiles({[path]:document.replace('tags:',broken+'tags:')},{'/mods/example/example.mjs':'source'},{'/mods/example/pane.png':'url'}),/\/mods\/example\/MOD\.md/);
 }
});
test('all upstream sample entries have source, install commands and every original screenshot', async () => {
 const { readMods }=await import('../scripts/read-mods.mjs');
 const mods=await readMods();
 for(const [id,count] of [['token-weather',3],['blast-radius',4],['replay-theater',4]]) {
  const mod=mods.find(mod=>mod.id===id);const config=mod.agents['claude-code'];
  assert.equal(config.screenshots.length,count);
  assert.ok(config.source.includes('register'));
  assert.ok(config.installCommand.includes(`${id}@claude-code-playground-mods`));
  assert.equal(config.license || mod.license,'Apache-2.0');
 }
});

test('catalog dates, changelog and summaries have file-scoped validation',()=>{
 const metadata=`updated: 2026-10-14
overview: {purpose: See usage, placement: Above the prompt, actions: [Reset]}
changelog: [{date: 2026-10-14, scope: prompt, summary: Improved reading states}]
`;
 const text=document.replace('tags:',metadata+'tags:');const [mod]=loadModFiles({[path]:text});
 assert.equal(mod.overview.placement,'Above the prompt');assert.equal(mod.updated,'2026-10-14');assert.equal(mod.changelog[0].scope,'prompt');
 for(const broken of [text.replace('2026-10-14','2026-02-30'),text.replace('scope: prompt','scope: security'),text.replace('placement: Above the prompt, ',''),text.replace('date: 2026-10-14','date: 2026-10-15')]) assert.throws(()=>loadModFiles({[path]:broken}), /\/mods\/example\/MOD\.md/);
});
test('verified runtime status requires evidence and applies only to its harness',()=>{
 const metadata=`agents:
  mint:
    prompt: body
    verification: {status: verified, date: 2026-10-14, environment: Mint terminal fixture, evidence: https://example.com/run/1}
  claude-code:
    prompt: Claude prompt
`;
 const text=document.replace('tags:',metadata+'tags:');const [mod]=loadModFiles({[path]:text});
 assert.equal(mod.agents.mint.verification.status,'verified');assert.equal(mod.agents['claude-code'].verification.status,'not-verified');
 for(const broken of [text.replace(', evidence: https://example.com/run/1',''),text.replace('status: verified','status: pass'),text.replace('https://example.com/run/1','javascript:alert(1)')]) assert.throws(()=>loadModFiles({[path]:broken}), /\/mods\/example\/MOD\.md/);
});
