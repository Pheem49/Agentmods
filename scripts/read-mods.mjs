import { readdir, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { loadModFiles } from '../src/mod-files.ts';

export async function readMods(root = new URL('../mods/', import.meta.url)) {
  const documents = {}, sources = {}, previews = {};
  for (const folder of await readdir(root, { withFileTypes: true })) {
    if (!folder.isDirectory()) continue;
    const directory = new URL(`${encodeURIComponent(folder.name)}/`, root);
    const base = `/mods/${folder.name}`;
    const files = await readdir(directory, { withFileTypes: true });
    if (!files.some(file => file.isFile() && file.name === 'MOD.md')) {
      throw new Error(`${fileURLToPath(directory)}: Missing MOD.md`);
    }
    for (const file of files) {
      if (!file.isFile()) continue;
      const url = new URL(encodeURIComponent(file.name), directory);
      if (file.name === 'MOD.md') documents[`${base}/MOD.md`] = await readFile(url, 'utf8');
      else if (/\.(ts|js|mjs)$/.test(file.name)) sources[`${base}/${file.name}`] = await readFile(url, 'utf8');
      else if (/\.(png|jpe?g|webp|gif|svg)$/.test(file.name)) previews[`${base}/${file.name}`] = `${base}/${file.name}`;
    }
  }
  return loadModFiles(documents, sources, previews);
}
