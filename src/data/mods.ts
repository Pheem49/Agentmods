import { loadModFiles } from '../mod-files';

const documents = import.meta.glob<string>('/mods/*/MOD.md', {
  eager: true, query: '?raw', import: 'default',
});
const sources = import.meta.glob<string>('/mods/*/*.{ts,js,mjs}', {
  eager: true, query: '?raw', import: 'default',
});
const previews = import.meta.glob<string>('/mods/*/*.{png,jpg,jpeg,webp,gif,svg}', {
  eager: true, import: 'default',
});

const mods = loadModFiles(documents, sources, previews);
export default mods;
