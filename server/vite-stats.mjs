import { readMods } from '../scripts/read-mods.mjs';
import { createStatsApi } from './stats-api.mjs';

export function promptCopiesPlugin() {
  async function configure(server) {
    const api = createStatsApi({catalog:await readMods()});
    server.middlewares.use((req,res,next)=>{api.handle(req,res).then(handled=>{if (!handled) next();}).catch(next);});
    server.httpServer?.once('close',()=>{api.close().catch(error=>console.error('Unable to close copy statistics:',error.message));});
  }
  return {name:'agentmods-prompt-copies',configureServer:configure,configurePreviewServer:configure};
}
