# Deploy Agentmods on Vercel

The Vite frontend is served from `dist/`. The statistics endpoints are routed to one Node.js Vercel Function, `api/stats.mjs`. Persistent prompt-copy totals use Upstash Redis; local development can continue using SQLite.

## Setup

1. Commit and push the project, including `api/`, `server/`, `vercel.json`, and `server/api-catalog.json`, to your Git repository.
2. Import the repository into Vercel. Use the Vite framework preset, Node.js 22.x, `npm run build` as the build command, and `dist` as the output directory. The repository's `vercel.json` declares the build/output settings and API rewrites. Vercel does not use `npm run serve` or require a persistent Node process for this deployment.
3. In Vercel Storage / Marketplace, add Upstash Redis and connect it to this project. Choose the region and plan in your account. Enable its environment variables for Production and, if needed, Preview. [Upstash integration instructions](https://upstash.com/docs/redis/howto/vercelintegration).
4. Ensure these **server-side** variables exist:

   ```env
   UPSTASH_REDIS_REST_URL=https://your-database.upstash.io
   UPSTASH_REDIS_REST_TOKEN=your-rest-token
   ```

   `KV_REST_API_URL` and `KV_REST_API_TOKEN` are accepted aliases. Use a token that permits writes. Do not prefix either variable with `VITE_`, put credentials in frontend code, or commit a real `.env` file.
5. Redeploy after connecting the database or changing environment variables. [Vercel Marketplace storage](https://vercel.com/docs/storage).

No `HOST`, `PORT`, SQLite disk path, or mounted filesystem is needed for Vercel. Without Redis credentials, the API returns a service-unavailable response and the UI shows statistics as Unavailable while clipboard actions keep working. It never silently falls back to ephemeral local counters on Vercel.

## Production and Preview

Redis keys are separated by `VERCEL_ENV`: production, preview, and development. Preview deployments therefore cannot increase Production totals. All deployments within the same environment share its totals. If you intentionally need a different namespace, set `AGENTMODS_STATS_NAMESPACE` to a stable name. Changing it starts a separate counter history; it does not migrate existing totals.

The counters and their measurement-start timestamp have no expiration. Per-action retry receipts expire after seven days. A bounded receipt index and an atomic Lua script deduplicate retries and increment each mod count. The Redis adapter also rate-limits new copy events across function instances using a short-lived HMAC of Vercel's client-IP header; raw IP addresses and prompt contents are not stored.

## Build behavior

`npm run build` refreshes the small API catalog from the Markdown entries. The function imports this generated JSON rather than reading Markdown, screenshots, or reference source at runtime. Keep the generated catalog in the repository; build updates it when mods or prompt variants change.

The local `npm run dev`, `npm run preview`, and `npm run serve` paths still support SQLite. If Redis credentials are explicitly supplied to local Node processes, they can use Redis as well; their default namespace is development.

## Verify after deployment

- Open `/api/prompt-copies` on the deployed domain and confirm it returns JSON with `version`, `since`, and a count for each mod.
- Copy a prompt successfully and confirm its count increases. Copying source or an install command must not increment it.
- Reload the page and redeploy once; totals must remain in the same environment namespace.
- Compare a Preview deployment with Production and confirm its test copies do not change Production totals.
- Check the Vercel function logs if the UI reports Unavailable. Check environment scope, the REST URL/token, token write permissions, and Upstash service availability. Do not paste credential values into public logs or reports.

Local tests cover the serverless request-body shape, routing configuration, async persistence contract, REST command construction, response validation, and SQLite regression behavior. A live Upstash/Vercel round trip must be verified after the database is connected; local mocked transport tests do not constitute a live deployment test.
