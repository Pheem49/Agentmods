export function createVercelHandler(createApi) {
  let api;
  return async function handler(req,res) {
    const route=req.query?.route || new URL(req.url,'http://localhost').searchParams.get('route');
    if (typeof route==='string') req.url='/api/'+route;
    api ??= createApi();
    if (!await api.handle(req,res)) {
      res.writeHead(404,{'Content-Type':'application/json'});res.end(JSON.stringify({error:'Unknown statistics endpoint'}));
    }
  };
}
