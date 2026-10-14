import { createHmac } from 'node:crypto';

const SNAPSHOT = `
redis.call('SET', KEYS[1], ARGV[1], 'NX')
local result = {redis.call('GET', KEYS[1])}
for i = 2, #ARGV do
  table.insert(result, redis.call('HGET', KEYS[2], ARGV[i]) or '0')
end
return result
`;
const RECORD = `
local old = redis.call('GET', KEYS[3])
local count = tonumber(redis.call('HGET', KEYS[2], ARGV[1]) or '0')
if not count or count < 0 or count >= 9007199254740991 or count % 1 ~= 0 then return {503} end
if old then
  if old ~= ARGV[2] then return {409} end
  return {200, count, 1, redis.call('GET', KEYS[1]) or ARGV[4]}
end
redis.call('ZREMRANGEBYSCORE', KEYS[4], '-inf', tonumber(ARGV[3]) - 604800000)
if redis.call('ZCARD', KEYS[4]) >= tonumber(ARGV[7]) then return {503} end
local rate = redis.call('INCR', KEYS[5])
if rate == 1 then redis.call('EXPIRE', KEYS[5], 60) end
if rate > tonumber(ARGV[6]) then return {429} end
redis.call('SET', KEYS[1], ARGV[4], 'NX')
redis.call('SET', KEYS[3], ARGV[2], 'EX', 604800)
redis.call('ZADD', KEYS[4], ARGV[3], ARGV[5])
count = redis.call('HINCRBY', KEYS[2], ARGV[1], 1)
return {200, count, 0, redis.call('GET', KEYS[1])}
`;

function validCount(value) {
  if (!(typeof value==='number' || typeof value==='string' && /^\d+$/.test(value))) throw new Error('Invalid Redis count');
  const count=Number(value);
  if (!Number.isSafeInteger(count) || count<0) throw new Error('Invalid Redis count');
  return count;
}
export function createUpstashStore({url,token,namespace='development',request=fetch,now=Date.now,maxReceipts=100_000}) {
  const endpoint=new URL(url);
  if (endpoint.protocol!=='https:' || endpoint.username || endpoint.password || endpoint.search || endpoint.hash) throw new Error('Invalid Redis REST URL');
  if (!token || !/^[a-zA-Z0-9:_-]{1,100}$/.test(namespace)) throw new Error('Invalid Redis configuration');
  const prefix=`agentmods:{${namespace}}:`;
  async function command(args) {
    // Credentials stay in server-side headers, never public URLs or error messages.
    const response=await request(endpoint.href,{method:'POST',headers:{Authorization:`Bearer ${token}`,'Content-Type':'application/json'},body:JSON.stringify(args),signal:AbortSignal.timeout(4000)});
    if (!response.ok) throw new Error('Redis statistics unavailable');
    const data=await response.json();
    if (data.error || !Object.hasOwn(data,'result')) throw new Error('Redis statistics unavailable');
    return data.result;
  }
  return {
    async snapshot(ids) {
      const result=await command(['EVAL',SNAPSHOT,2,prefix+'since',prefix+'copies',new Date(now()).toISOString(),...ids]);
      if (!Array.isArray(result) || result.length!==ids.length+1 || !Number.isFinite(Date.parse(result[0]))) throw new Error('Invalid Redis statistics');
      const counts=Object.fromEntries(ids.map((id,index)=>{
        const count=validCount(result[index+1]);
        return [id,count];
      }));
      return {version:1,since:result[0],counts};
    },
    async record(modId,variant,eventId,{peer='unknown',rateLimit=60}={}) {
      const peerKey=createHmac('sha256',token).update(String(peer)).digest('hex');
      const result=await command(['EVAL',RECORD,5,prefix+'since',prefix+'copies',prefix+'receipt:'+eventId,prefix+'receipts',prefix+'rate:'+peerKey,modId,modId+':'+variant,now(),new Date(now()).toISOString(),eventId,rateLimit,maxReceipts]);
      if (!Array.isArray(result)) throw new Error('Invalid Redis response');
      const status=Number(result[0]);
      if (status!==200) throw Object.assign(new Error(status===409?'Event ID already used for another prompt':status===429?'Too many copy events':'Copy statistics unavailable'),{status:[409,429,503].includes(status)?status:503});
      const count=validCount(result[1]);
      if (!Number.isSafeInteger(count) || count<0 || !Number.isFinite(Date.parse(result[3]))) throw new Error('Invalid Redis response');
      return {modId,count,duplicate:result[2]===1,since:result[3]};
    },
    close() {},
  };
}
