import { readMods } from './read-mods.mjs';
try {
  const mods = await readMods();
  if (!mods.length) throw new Error('The mods catalog is empty. Add mods/<id>/MOD.md.');
  console.log(`Validated ${mods.length} mods: ${mods.filter(mod => mod.source).length} with source, ${mods.filter(mod => !mod.source).length} prompt recipes.`);
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
