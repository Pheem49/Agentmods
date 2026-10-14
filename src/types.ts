export type Category = 'Context' | 'Workflow' | 'Safety' | 'Utilities';
export type Agent = 'mint' | 'claude-code';
export interface Screenshot { url: string; alt: string }
export interface Verification {
 status: 'not-verified' | 'verified' | 'needs-review';
 date: string | null; environment: string | null; evidence: string | null; notes: string | null;
}
export interface Overview { purpose: string; placement: string; actions: string[] }
export interface Change { date: string; scope: 'prompt' | 'source' | 'catalog'; summary: string }
export interface AgentConfig {
 prompt: string; compatibility: string; installCommand: string | null;
 installNotes: string | null; source: string | null;
 author?: string | null; repository?: string | null;
 screenshots: Screenshot[]; license?: string | null; version?: string | null;
 overview?: Overview; verification?: Verification;
}
export interface Mod {
 id: string; name: string; category: Category; icon: string; description: string;
 tags: string[]; features: string[]; featured: boolean; kind: 'source' | 'recipe';
 author: string; version: string | null; sdk: string; permissions: string[];
 preview?: string;
 requiredCapabilities?: string[];
 overview?: Overview; updated?: string | null; changelog?: Change[];
 source: string | null; adaptationPrompt?: string; prompt: string; repo: string | null; license: string | null;
 agents: Partial<Record<Agent, AgentConfig>>;
}
export interface CatalogOptions {
 query?: string; category?: Category | 'All'; view?: 'all' | 'source' | 'saved';
 saved?: string[]; sort?: 'featured' | 'name' | 'copies';
 promptCopies?: Record<string, number>;
 agent?: Agent | 'all' | 'both';
}
