import type { Mod, CatalogOptions } from './types.ts';
export function filterMods(mods: Mod[], { query = '', category = 'All', view = 'all', saved = [], sort = 'featured', agent = 'all' }: CatalogOptions = {}): Mod[] {
  const search = query.trim().toLocaleLowerCase();
  return mods.filter(mod =>
    (category === 'All' || mod.category === category) &&
    (agent === 'all' || (agent === 'both' ? Boolean(mod.agents?.mint && mod.agents?.['claude-code']) : Boolean(mod.agents?.[agent]))) &&
    (view !== 'source' || mod.kind === 'source') &&
    (view !== 'saved' || saved.includes(mod.id)) &&
    (!search || [mod.name, mod.id, mod.description, ...mod.tags].join(' ').toLocaleLowerCase().includes(search))
  ).sort((a, b) => sort === 'name' ? a.name.localeCompare(b.name) : Number(b.featured) - Number(a.featured));
}
