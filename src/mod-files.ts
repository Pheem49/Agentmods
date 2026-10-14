import { parse } from 'yaml';
import type { Agent, AgentConfig, Category, Mod, Screenshot, Overview, Verification, Change } from './types.ts';

type Files = Record<string, string>;
const categories: Category[] = ['Context', 'Workflow', 'Safety', 'Utilities'];

function metadataText(data: Record<string, unknown>, key: string, required = true): string | null {
  const value = data[key];
  if (value == null && !required) return null;
  if (typeof value !== 'string' || !value.trim()) throw new Error(`"${key}" must be a non-empty string`);
  return value.trim();
}
function metadataList(data: Record<string, unknown>, key: string): string[] {
  const value = data[key] ?? [];
  if (!Array.isArray(value) || value.some(item => typeof item !== 'string' || !item.trim())) {
    throw new Error(`"${key}" must be a list of strings`);
  }
  return value.map(item => item.trim());
}
function dateText(data: Record<string, unknown>, key: string, required = false): string | null {
  const value = metadataText(data, key, required);
  if (value !== null && (!/^\d{4}-\d{2}-\d{2}$/.test(value) || !Number.isFinite(Date.parse(value)) || new Date(value).toISOString().slice(0, 10) !== value)) {
    throw new Error(`"${key}" must be a real YYYY-MM-DD date`);
  }
  return value;
}
function overview(value: unknown): Overview | undefined {
  if (value === undefined) return undefined;
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('"overview" must be a mapping');
  const data = value as Record<string, unknown>;
  return {purpose: metadataText(data, 'purpose')!, placement: metadataText(data, 'placement')!, actions: metadataList(data, 'actions')};
}
function verification(value: unknown): Verification {
  if (value === undefined) return {status:'not-verified',date:null,environment:null,evidence:null,notes:null};
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('"verification" must be a mapping');
  const data = value as Record<string, unknown>;
  const status = metadataText(data, 'status') as Verification['status'];
  if (!['not-verified', 'verified', 'needs-review'].includes(status)) throw new Error('Invalid verification status');
  const date = dateText(data, 'date');
  const environment = metadataText(data, 'environment', false);
  const evidence = metadataText(data, 'evidence', false);
  if (evidence && !/^https:\/\//i.test(evidence)) throw new Error('Verification evidence must be an HTTPS URL');
  if (status === 'verified' && (!date || !environment || !evidence)) throw new Error('Verified implementations need a date, environment, and evidence URL');
  return {status,date,environment,evidence,notes:metadataText(data,'notes',false)};
}
function changes(value: unknown, updated: string | null): Change[] {
  if (value === undefined) return [];
  if (!Array.isArray(value)) throw new Error('"changelog" must be a list');
  const entries = value.map(item => {
    if (!item || typeof item !== 'object' || Array.isArray(item)) throw new Error('Invalid changelog entry');
    const data = item as Record<string, unknown>;
    const date = dateText(data, 'date', true)!;
    const scope = metadataText(data, 'scope') as Change['scope'];
    if (!['prompt', 'source', 'catalog'].includes(scope)) throw new Error('Invalid changelog scope');
    if (!updated || date > updated) throw new Error('Changelog dates must not exceed the updated date');
    return {date,scope,summary:metadataText(data,'summary')!};
  });
  return entries.sort((a,b)=>b.date.localeCompare(a.date));
}
function sections(body: string): Record<string, string> {
  const result: Record<string, string> = {};
  const lines = body.split('\n');
  let current = '';
  let fence: { char: string; length: number } | null = null;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const marker = line.match(/^ {0,3}(`{3,}|~{3,})/);
    if (marker) {
      if (!fence) fence = { char: marker[1][0], length: marker[1].length };
      else if (marker[1][0] === fence.char && marker[1].length >= fence.length && /^ {0,3}(`{3,}|~{3,})\s*$/.test(line)) fence = null;
    }
    const heading = !fence && line.match(/^## (Description|Features|Adaptation prompt|Prompt)\s*$/);
    if (heading) {
      current = heading[1];
      if (current in result) throw new Error(`Duplicate ${current} section`);
      result[current] = '';
      if (current === 'Prompt') {
        result.Prompt = lines.slice(i + 1).join('\n').trim();
        break;
      }
      continue;
    }
    if (current) result[current] += `${line}\n`;
  }
  return Object.fromEntries(Object.entries(result).map(([key, value]) => [key, value.trim()]));
}
function asset(files: Files, directory: string, name: string | null, kind: 'source' | 'preview'): string | null {
  if (!name) return null;
  const extensions = kind === 'source' ? /\.(ts|js|mjs)$/ : /\.(png|jpe?g|webp|gif|svg)$/;
  if (!/^[a-zA-Z0-9][a-zA-Z0-9._-]*$/.test(name) || !extensions.test(name)) {
    throw new Error(`"${kind}" must name a file in this mod folder`);
  }
  const value = files[`${directory}/${name}`];
  if (typeof value !== 'string' || !value.trim()) throw new Error(`Missing or empty ${kind} file: ${name}`);
  return value;
}
function screenshots(value: unknown, files: Files, directory: string): Screenshot[] {
  if (value === undefined) return [];
  if (!Array.isArray(value)) throw new Error('"screenshots" must be a list of file/alt mappings');
  return value.map(item => {
    if (!item || typeof item !== 'object' || Array.isArray(item)) throw new Error('Invalid screenshot');
    const data = item as Record<string, unknown>;
    return { url: asset(files, directory, metadataText(data, 'file'), 'preview')!, alt: metadataText(data, 'alt')! };
  });
}

/** Convert repository content into the typed catalog consumed by the UI. */
export function loadModFiles(documents: Files, sources: Files = {}, previews: Files = {}): Mod[] {
  const ids = new Set<string>();
  const entries = Object.entries(documents).map(([path, raw]) => {
    try {
      const match = raw.replace(/^\uFEFF/, '').replace(/\r\n?/g, '\n').match(/^---\n([\s\S]*?)\n---\s*\n([\s\S]*)$/);
      if (!match) throw new Error('Expected YAML frontmatter between --- lines');
      const parsed: unknown = parse(match[1], { maxAliasCount: 50, uniqueKeys: true });
      if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw new Error('Frontmatter must be an object');
      const data = parsed as Record<string, unknown>;
      const id = metadataText(data, 'id')!;
      const folder = path.match(/^(.*\/([^/]+))\/MOD\.md$/);
      if (!folder || !/^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/.test(id) || folder[2] !== id) {
        throw new Error('ID must match the mod folder and use lowercase letters, numbers, and hyphens');
      }
      if (ids.has(id)) throw new Error(`Duplicate mod ID: ${id}`);
      ids.add(id);
      const category = metadataText(data, 'category') as Category;
      if (!categories.includes(category)) throw new Error(`Unknown category: ${category}`);
      if (data.featured != null && typeof data.featured !== 'boolean') throw new Error('"featured" must be true or false');
      if (data.order != null && (typeof data.order !== 'number' || !Number.isFinite(data.order))) throw new Error('"order" must be a finite number');
      const content = sections(match[2]);
      if (!content.Description) throw new Error('Missing or empty ## Description section');
      if (!content.Prompt) throw new Error('Missing or empty ## Prompt section');
      if (data.adaptationPrompt !== undefined && data.adaptationPrompt !== 'body') {
        throw new Error('"adaptationPrompt" must be "body" when provided');
      }
      const adaptationPrompt = data.adaptationPrompt === 'body' ? content.Prompt : content['Adaptation prompt'] || undefined;
      const source = asset(sources, folder[1], metadataText(data, 'source', false), 'source');
      const preview = asset(previews, folder[1], metadataText(data, 'preview', false), 'preview');
      const repo = metadataText(data, 'repository', false);
      if (repo && !/^https:\/\//i.test(repo)) throw new Error('"repository" must be an HTTPS URL');
      const compatibility = metadataText(data, 'compatibility')!;
      const updated = dateText(data, 'updated');
      const agents: Partial<Record<Agent, AgentConfig>> = {};
      if (data.agents === undefined) {
        // Existing catalog files describe Mint mods only.
        agents.mint = { prompt: content.Prompt, compatibility, source, installCommand: null, installNotes: null, screenshots: [], verification: verification(undefined) };
      } else {
        if (!data.agents || typeof data.agents !== 'object' || Array.isArray(data.agents) || (!Object.keys(data.agents).length && !adaptationPrompt)) {
          throw new Error('"agents" must map mint and/or claude-code, or be empty for an adaptation recipe');
        }
        for (const [key, value] of Object.entries(data.agents)) {
          if (key !== 'mint' && key !== 'claude-code') throw new Error(`Unknown agent: ${key}`);
          if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error(`Invalid config for agent: ${key}`);
          const config = value as Record<string, unknown>;
          const repository = metadataText(config, 'repository', false);
          if (repository && !/^https:\/\//i.test(repository)) throw new Error('Agent repository must be an HTTPS URL');
          // Explicitly opt into the body prompt, preventing accidental cross-agent fallback.
          const prompt = config.prompt === 'body' ? content.Prompt : metadataText(config, 'prompt')!;
          agents[key] = {
            prompt, compatibility: metadataText(config, 'compatibility', false) ?? compatibility,
            installCommand: metadataText(config, 'installCommand', false),
            installNotes: metadataText(config, 'installNotes', false),
            author: metadataText(config, 'author', false), repository,
            screenshots: screenshots(config.screenshots, previews, folder[1]),
            overview: overview(config.overview), verification: verification(config.verification),
            license: metadataText(config, 'license', false), version: metadataText(config, 'version', false),
            source: asset(sources, folder[1], metadataText(config, 'source', false), 'source'),
          };
        }
      }
      const mod: Mod = {
        id, name: metadataText(data, 'name')!, category,
        author: metadataText(data, 'author')!, sdk: metadataText(data, 'compatibility')!,
        icon: metadataText(data, 'icon', false) ?? 'terminal',
        description: content.Description,
        features: (content.Features ?? '').split('\n').filter(line => /^\s*-\s+/.test(line)).map(line => line.replace(/^\s*-\s+/, '').trim()),
        tags: metadataList(data, 'tags'), permissions: metadataList(data, 'permissions'),
        requiredCapabilities: metadataList(data, 'requiredCapabilities'),
        overview: overview(data.overview), updated, changelog: changes(data.changelog, updated),
        featured: data.featured === true, kind: source || Object.values(agents).some(config => config.source) ? 'source' : 'recipe',
        version: metadataText(data, 'version', false), license: metadataText(data, 'license', false),
        source, adaptationPrompt, prompt: content.Prompt, repo, agents, ...(preview ? { preview } : {}),
      };
      return { mod, order: typeof data.order === 'number' ? data.order : Number.MAX_SAFE_INTEGER };
    } catch (error) {
      throw new Error(`${path}: ${error instanceof Error ? error.message : String(error)}`);
    }
  });
  return entries.sort((a, b) => a.order - b.order || a.mod.id.localeCompare(b.mod.id)).map(entry => entry.mod);
}
