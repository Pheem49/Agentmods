import catalog from '../server/api-catalog.json' with {type:'json'};
import { createStatsApi } from '../server/stats-api.mjs';
import { createVercelHandler } from '../server/vercel-handler.mjs';

export default createVercelHandler(()=>createStatsApi({catalog}));
