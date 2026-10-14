import { createDefaultStatsStore } from './stats-storage.mjs';

function respond(res, status, data) {
  res.writeHead(status, {'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});
  res.end(JSON.stringify(data));
}
function readJson(req) {
  // Vercel provides a parsed body; its request stream may already be consumed.
  if ('body' in req) {
    try {
      const body=req.body;
      if (body !== undefined) {
        const raw=Buffer.isBuffer(body)?body.toString('utf8'):typeof body==='string'?body:JSON.stringify(body);
        if (Buffer.byteLength(raw)>4096) return Promise.reject(Object.assign(new Error('Request too large'),{status:413}));
        return Promise.resolve(JSON.parse(raw));
      }
    } catch {return Promise.reject(Object.assign(new Error('Invalid JSON'),{status:400}));}
  }
  return new Promise((resolveBody,reject) => {
    let bytes = 0, chunks = [];
    req.on('data', chunk => {
      bytes += chunk.length;
      if (bytes > 4096) {chunks=[];reject(Object.assign(new Error('Request too large'),{status:413}));}
      else chunks.push(chunk);
    });
    req.on('end', () => {
      if (bytes > 4096) return;
      try {resolveBody(JSON.parse(Buffer.concat(chunks).toString('utf8')));}
      catch {reject(Object.assign(new Error('Invalid JSON'),{status:400}));}
    });
    req.on('error',reject);
    req.on('aborted',()=>reject(new Error('Request aborted')));
  });
}

/** Same-origin aggregate counters. No cookies, visitor IDs, or prompt text. */
export function createStatsApi({catalog,dbPath,rateLimit=60,now=Date.now,env=process.env,storeFactory=createDefaultStatsStore}) {
  const entries = new Map(catalog.map(mod=>[mod.id, new Set([...(mod.adaptationPrompt?['adapt']:[]),...Object.keys(mod.agents)])]));
  let storePromise;
  const peers = new Map();
  const getStore = () => storePromise ??= storeFactory({dbPath,now,env});
  function limited(req) {
    const time = now();
    for (const [peer,value] of peers) if (value.expires <= time) peers.delete(peer);
    const key = req.socket.remoteAddress || 'unknown';
    const value = peers.get(key) || {count:0,expires:time+60_000};
    if (!peers.has(key) && peers.size >= 10_000) return true;
    peers.set(key,value);
    return ++value.count > rateLimit;
  }
  return {
    async handle(req,res) {
      const pathname = (req.url || '').split('?')[0];
      if (!pathname.startsWith('/api/')) return false;
      try {
        if (pathname === '/api/prompt-copies') {
          if (req.method !== 'GET') {res.setHeader('Allow','GET');respond(res,405,{error:'Method not allowed'});return true;}
          respond(res,200,await (await getStore()).snapshot([...entries.keys()]));
          return true;
        }
        const match = pathname.match(/^\/api\/mods\/([a-z0-9-]+)\/prompt-copy$/);
        if (!match || !entries.has(match[1])) {respond(res,404,{error:'Unknown statistics endpoint or mod'});return true;}
        if (req.method !== 'POST') {res.setHeader('Allow','POST');respond(res,405,{error:'Method not allowed'});return true;}
        if (req.headers['sec-fetch-site'] === 'cross-site') throw Object.assign(new Error('Cross-site request rejected'),{status:403});
        if (req.headers.origin) {
          let origin;
          try {origin=new URL(req.headers.origin);} catch {throw Object.assign(new Error('Invalid origin'),{status:403});}
          if (!['http:','https:'].includes(origin.protocol) || origin.host !== req.headers.host) throw Object.assign(new Error('Cross-origin request rejected'),{status:403});
        }
        if (!/^application\/json(?:;|$)/i.test(req.headers['content-type'] || '')) throw Object.assign(new Error('JSON content type required'),{status:415});
        if (env.VERCEL !== '1' && limited(req)) {res.setHeader('Retry-After','60');throw Object.assign(new Error('Too many copy events'),{status:429});}
        const body = await readJson(req);
        if (!body || typeof body !== 'object' || Array.isArray(body) || Object.keys(body).some(key=>!['eventId','variant'].includes(key)) || !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(body.eventId || '') || !entries.get(match[1]).has(body.variant)) {
          throw Object.assign(new Error('Invalid copy event or prompt variant'),{status:400});
        }
        const peer=env.VERCEL==='1'?req.headers['x-vercel-forwarded-for'] || 'unknown':req.socket?.remoteAddress || 'unknown';
        respond(res,200,await (await getStore()).record(match[1],body.variant,body.eventId.toLowerCase(),{peer,rateLimit}));
      } catch (error) {
        if (error.status===429 && !res.headersSent) res.setHeader('Retry-After','60');
        if (!res.headersSent && !res.destroyed) respond(res,error.status || 503,{error:error.status?error.message:'Copy statistics unavailable'});
      }
      return true;
    },
    async close() {if (storePromise) (await storePromise).close();},
  };
}
