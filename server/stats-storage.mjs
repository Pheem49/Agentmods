import { resolve } from 'node:path';

export function redisConfiguration(env=process.env) {
  const url=env.UPSTASH_REDIS_REST_URL || env.KV_REST_API_URL;
  const token=env.UPSTASH_REDIS_REST_TOKEN || env.KV_REST_API_TOKEN;
  if ((url && !token) || (token && !url)) throw new Error('Redis REST URL and token are both required');
  if (!url) return null;
  return {url,token,namespace:env.AGENTMODS_STATS_NAMESPACE || env.VERCEL_ENV || 'development'};
}
export async function createDefaultStatsStore({dbPath,now=Date.now,env=process.env}={}) {
  // Explicit paths are used by isolated tests and local SQLite deployments.
  const redis=dbPath===undefined?redisConfiguration(env):null;
  if (redis) {
    const {createUpstashStore}=await import('./upstash-store.mjs');
    return createUpstashStore({...redis,now});
  }
  if (env.VERCEL==='1' && dbPath===undefined) throw new Error('Connect Redis before using statistics on Vercel');
  const {createStatsStore}=await import('./stats-store.mjs');
  return createStatsStore(dbPath || env.AGENTMODS_STATS_DB || resolve('.agentmods/prompt-copies.sqlite'),{now});
}
