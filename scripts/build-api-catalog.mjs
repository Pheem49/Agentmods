import { writeFile } from 'node:fs/promises';
import { readMods } from './read-mods.mjs';
const catalog=(await readMods()).map(mod=>({id:mod.id,adaptationPrompt:Boolean(mod.adaptationPrompt),agents:Object.fromEntries(Object.keys(mod.agents).map(id=>[id,{}]))}));
await writeFile(new URL('../server/api-catalog.json',import.meta.url),JSON.stringify(catalog,null,2)+'\n');
console.log(`Built API catalog with ${catalog.length} mod IDs and prompt variants.`);
