import { createServer } from 'node:http';
import { readFile, realpath, stat } from 'node:fs/promises';
import { resolve, sep, extname } from 'node:path';
import { createStatsApi } from './stats-api.mjs';
import { readMods } from '../scripts/read-mods.mjs';

export async function createAppServer({dist=resolve('dist'),dbPath,catalog}={}) {
  const root = await realpath(dist);
  const api = createStatsApi({catalog:catalog || await readMods(),dbPath});
  const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.webp':'image/webp','.txt':'text/plain; charset=utf-8','.ico':'image/x-icon','.woff2':'font/woff2'};
  const server=createServer(async(req,res)=>{
    try {
      if (await api.handle(req,res)) return;
      if (!['GET','HEAD'].includes(req.method)) {res.writeHead(405,{'Allow':'GET, HEAD'});res.end();return;}
      let pathname;
      try {pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);} catch {res.writeHead(400);res.end();return;}
      if (pathname.includes('\0') || pathname.includes('\\') || pathname.split('/').some(part=>part.startsWith('.') && part !== '')) {res.writeHead(404);res.end();return;}
      const target=resolve(root,'.'+(pathname==='/'?'/index.html':pathname));
      if (!target.startsWith(root+sep)) {res.writeHead(404);res.end();return;}
      let file;
      try {file=await realpath(target);} catch {res.writeHead(404);res.end();return;}
      if (!file.startsWith(root+sep) || !(await stat(file)).isFile()) {res.writeHead(404);res.end();return;}
      const data=await readFile(file);
      res.writeHead(200,{'Content-Type':types[extname(file)] || 'application/octet-stream','X-Content-Type-Options':'nosniff','Cache-Control':pathname.startsWith('/assets/')?'public, max-age=31536000, immutable':'no-cache'});
      res.end(req.method==='HEAD'?undefined:data);
    } catch {if (!res.headersSent) res.writeHead(500);res.end('Unable to serve this request');}
  });
  server.requestTimeout=10_000;
  server.headersTimeout=10_000;
  server.once('close',()=>api.close().catch(error=>console.error('Unable to close statistics:',error.message)));
  return server;
}
if (process.argv[1] && resolve(process.argv[1]) === new URL(import.meta.url).pathname) {
  const port=Number(process.env.PORT || 3000);
  if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('PORT must be between 1 and 65535');
  const server=await createAppServer();
  server.listen(port,process.env.HOST || '127.0.0.1',()=>console.log(`Agentmods listening on port ${port}`));
  for(const signal of ['SIGINT','SIGTERM']) process.once(signal,()=>server.close());
}
