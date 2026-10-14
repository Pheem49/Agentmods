import { useEffect, useState } from 'react';

export interface CopySnapshot { version: 1; since: string; counts: Record<string, number> }
export function parseSnapshot(value: unknown, ids: string[]): CopySnapshot {
  if (!value || typeof value !== 'object') throw new Error('Invalid copy statistics');
  const data=value as Partial<CopySnapshot>;
  if (data.version !== 1 || typeof data.since !== 'string' || !Number.isFinite(Date.parse(data.since)) || !data.counts || typeof data.counts !== 'object') throw new Error('Invalid copy statistics');
  const counts: Record<string,number>={};
  for (const id of ids) {
    const count=data.counts[id];
    if (!Number.isSafeInteger(count) || count < 0) throw new Error('Invalid copy count');
    counts[id]=count;
  }
  return {version:1,since:data.since,counts};
}
export function mergeSnapshots(current: CopySnapshot | null, next: CopySnapshot): CopySnapshot {
  if (!current || current.since !== next.since) return next;
  return {...next,counts:Object.fromEntries(Object.entries(next.counts).map(([id,count])=>[id,Math.max(count,current.counts[id] ?? 0)]))};
}
export async function sendCopyEvent(modId: string, variant: string, eventId: string, request: typeof fetch = fetch): Promise<{count:number;since:string}> {
  const body=JSON.stringify({variant,eventId});
  for(let attempt=0;attempt<2;attempt++) {
    try {
      const response=await request(`/api/mods/${encodeURIComponent(modId)}/prompt-copy`,{method:'POST',headers:{'Content-Type':'application/json'},body,signal:AbortSignal.timeout(5000)});
      if (!response.ok) throw Object.assign(new Error('Copy statistics unavailable'), {retryable:response.status>=500});
      const data=await response.json();
      if (data.modId !== modId || !Number.isSafeInteger(data.count) || data.count<0 || typeof data.since !== 'string' || !Number.isFinite(Date.parse(data.since))) throw Object.assign(new Error('Invalid copy statistics'),{retryable:false});
      return {count:data.count,since:data.since};
    } catch(error) {
      if (attempt===1 || (error as {retryable?:boolean}).retryable===false) throw error;
    }
  }
  throw new Error('Copy statistics unavailable');
}
export function usePromptCopies(ids: string[]) {
  const [snapshot,setSnapshot]=useState<CopySnapshot | null>(null);
  const [status,setStatus]=useState<'loading'|'ready'|'unavailable'>('loading');
  const key=ids.join(',');
  useEffect(()=>{
    let disposed=false;
    const controller=new AbortController();
    const timeout=setTimeout(()=>controller.abort(),5000);
    fetch('/api/prompt-copies',{signal:controller.signal,cache:'no-store'}).then(async response=>{
      if (!response.ok) throw new Error('Copy statistics unavailable');
      const next=parseSnapshot(await response.json(),key.split(','));
      if (!disposed) {setSnapshot(current=>mergeSnapshots(current,next));setStatus('ready');}
    }).catch(()=>{if (!disposed) setStatus('unavailable');}).finally(()=>clearTimeout(timeout));
    return ()=>{disposed=true;clearTimeout(timeout);controller.abort();};
  },[key]);
  async function record(modId:string,variant:string) {
    try {
      const result=await sendCopyEvent(modId,variant,crypto.randomUUID());
      setSnapshot(current=>{
        // A write proves only this mod's count. Never invent the other totals.
        if (!current || current.since !== result.since) return current;
        return {...current,counts:{...current.counts,[modId]:Math.max(current.counts[modId] ?? 0,result.count)}};
      });
      const response=await fetch('/api/prompt-copies',{cache:'no-store',signal:AbortSignal.timeout(5000)});
      if (!response.ok) throw new Error('Copy statistics unavailable');
      const next=parseSnapshot(await response.json(),ids);
      setSnapshot(current=>mergeSnapshots(current,next));setStatus('ready');
    } catch(error) {setStatus('unavailable');throw error;}
  }
  return {snapshot,status,record};
}
