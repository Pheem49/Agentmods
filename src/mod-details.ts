import type { AgentConfig, Mod } from './types';
export function readiness(config?: AgentConfig): string {
  return config?.installCommand ? 'Installable package' : config?.source ? 'Reference source' : 'Creation recipe';
}
export function catalogReadiness(mod: Mod): string {
  return Object.values(mod.agents).some(config=>config.installCommand) ? 'Installable package' : mod.kind==='source' ? 'Reference source' : 'Creation recipe';
}
export function displayDate(value: string | null | undefined): string {
  return value ? new Intl.DateTimeFormat('en',{day:'numeric',month:'short',year:'numeric',timeZone:'UTC'}).format(new Date(value)) : 'Not recorded';
}
