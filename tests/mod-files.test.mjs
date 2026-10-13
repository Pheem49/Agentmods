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
