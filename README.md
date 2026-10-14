<p align="center">
  <img src="public/favicon.svg" width="80" height="80" alt="Agentmods logo" />
</p>

<h1 align="center">Agentmods</h1>

<p align="center">
  Small upgrades for your AI agent.<br />
  Discover recipes to adapt to <strong>your AI coding agent</strong>.<br />
  Find a mod. Copy a prompt. Make it yours.
</p>

<p align="center">
  <a href="#why-agentmods">About</a> ·
  <a href="#how-it-works">How it works</a> ·
  <a href="#example-token-weather">Example mod</a> ·
  <a href="https://github.com/Pheem49/Agentmods.git">GitHub</a>
</p>

<p align="center">
  <img src="docs/screenshots/agentmods-home.png" width="900" alt="Agentmods home page with the mod directory" />
</p>

## Why Agentmods?

Mods bring useful additions to your agent: context indicators, task lists, command checks, and file-edit replays. Agentmods puts their features, previews, and prompts in one place so you can find what fits your workflow.

Each mod has a neutral adaptation prompt, alongside any listed agent-specific implementations. You can inspect source, view screenshots, and save favorites in your browser.

## How it works

1. **Find a mod** — search the collection or browse by category.
2. **Choose your approach** — use “Adapt to my agent”, or select a listed implementation.
3. **Copy the prompt** — paste it into your agent to create the mod or install its package.

**Adapt to my agent** asks your AI coding agent to identify its current harness, inspect extension APIs, and create a compatible mod. It must explain unsupported features and use real measurements. These recipes do not guarantee compatibility with every environment.

**Mint** prompts ask the agent to create or adapt a mod. **Claude Code** prompts for packaged mods install the original package; **Copy install command** gives you the same steps to run yourself. Mint adaptations may differ where its SDK has different capabilities.

## Example: Token Weather

[Token Weather](mods/token-weather/MOD.md) shows a live forecast of your context window above the prompt: usage percentage, a chart of the last 12 turns, and the latest turn’s token change.

<p align="center">
  <img src="docs/screenshots/agentmods-mod-detail.png" width="900" alt="Token Weather detail page with the agent selector and copyable Mint prompt" />
</p>

<details>
<summary><strong>Copy the adaptation prompt</strong></summary>

Paste this into your AI coding agent to adapt Token Weather:

```text
Make me a mod called token-weather for the AI coding agent environment I’m currently using: a live forecast of context-window occupancy, shown in a compact band above the prompt.

First identify the current agent harness (the app or CLI running this session). Inspect its documentation, extension APIs, and existing mods or plugins before implementing anything. If the target environment cannot be identified from the workspace or session, ask me which app or CLI this is for.

### What it is and what it can do

This is a context-occupancy indicator with a small history chart. It shows the current reading, the last 12 completed turns, and the change from the previous turn. It does not compact context automatically or change model settings.

### What it should look like

Show one line, in this order:
- A weather icon and word: under 25% ☀ Clear (yellow), 25% to under 50% ☁ Cloudy (cyan), 50% to under 75% ☂ Showers (blue), 75% to under 90% ☇ Storm (magenta), and 90% or higher ↯ Compact soon (red).
- Context percentage, then used tokens and window capacity, such as "67.2% · 134.4k / 200k". These are format examples, not initial readings.
- A sparkline of the latest 12 completed-turn percentages, oldest on the left, using ▁▂▃▄▅▆▇█. A missing reading is ·, not zero.
- The signed last-turn change, such as "▲ +8.3k last turn", "▼ -2.1k last turn", or "— no change last turn".

Use the unrounded measured percentage to choose the weather category and display one decimal place without rounding across a category boundary. Preserve exact available values for accessible text. Scale the sparkline against 0–100%, not the history’s minimum and maximum. For a valid reading above 100%, keep its real percentage visible and clamp only the sparkline height.

On a narrow display, preserve the weather, percentage, and token totals first; omit the sparkline and delta if needed. There are no action buttons. If the band is unavailable, provide the same reading through a supported panel or text command.

### Updates and data states

Initialize immediately from the current supported context snapshot, then update on usage changes and turn completion. Use context occupancy, not cumulative billing or lifetime tokens. Derive a percentage only from measured used tokens and a known positive capacity referring to the same context snapshot. Never sum arbitrary usage events to estimate occupancy.

Show "☁ No reading · —% · — / —" before the first valid measurement. Preserve independently known values, for example "— / 200k" when only capacity is known. Non-finite, negative, missing, or mismatched data is unavailable. A measured zero is valid. If the provider supplies a reliable last-turn context delta, use it; otherwise subtract comparable completed-turn occupancy snapshots only when both are known and no compaction, model, or capacity change occurred. Show "— last turn" when the comparison is unavailable.

Append exactly one history point per completed turn using a documented turn identity or deduplication mechanism. Usage updates redraw the current reading without appending points. Ignore late events from another turn, chat, or context generation. Clear history and the delta baseline after compaction, chat changes, or model/capacity changes; wait for a fresh reading and show "Waiting for context reading". A current post-compaction snapshot may be used if the API explicitly identifies it as fresh. If freshness cannot be established, show "Reading may be stale" rather than presenting an old value as current.

### State and access

Keep at most 12 points in supported per-chat mod state; restore them only with a matching context identity. If persistence or chat identity is unavailable, use session-only state and label it accordingly. Store numeric measurements and event identities only. Do not read workspace files, run tools, or retain message contents.

### Validation examples

Verify zero usage; exact 25%, 50%, 75%, and 90% boundaries; near-boundary decimals; partial or invalid readings; over-capacity readings; missing deltas; negative deltas; duplicate turn-end events; history trimming; compaction; chat/model switches; and a narrow display.

### Interaction and accessibility

Match the harness’s native theme, typography, and spacing. Keep the display compact in a narrow terminal or panel; preserve full accessible labels when text is shortened. Pair colors and icons with words. Give interactive controls keyboard access, visible focus, and clear labels. Report errors without moving focus or silently replacing valid state. Release subscriptions and timers when disabled, and do not overwrite another mod’s UI if the harness provides a supported composition mechanism.

### Compatibility and completion

Use only supported APIs and installation conventions. Prefer the display locations described above when supported; otherwise explain the limitation and use a supported alternative. Do not invent APIs, events, or usage measurements. Show unavailable readings explicitly. If the harness has no suitable extension mechanism, explain what cannot be implemented instead of claiming the mod is installed.

Preserve existing permissions and unrelated settings. Update an existing mod in its current folder when present. Preserve license notices when adapting reference source. Treat provided source as a reference: verify the requested behavior rather than assuming the reference already implements every requirement. Validate the result using the harness’s supported tools and explain how to enable it, including any unavailable features and any validation that could not be performed.
```

</details>

## More creation recipes

- [Session Handoff](mods/session-handoff/MOD.md): an editable briefing for continuing work in a new chat.
- [Tool Timeline](mods/tool-timeline/MOD.md): observed tool calls, statuses, and durations.
- [Checks Summary](mods/checks-summary/MOD.md): observed test, build, and lint outcomes with freshness indicators.
- [Workspace Map](mods/workspace-map/MOD.md): a bounded file tree, declared entry points, and copyable commands.

These entries include complete neutral prompts, required capabilities, and illustrative layouts. They are creation recipes rather than prebuilt packages.

## Credits and license

Includes examples from [Mint](https://github.com/Pheem49/Mint) and [Anthropic DevRel’s Claude Code playground](https://github.com/anthropics/claude-code-playground/tree/main/claude-code/mods), alongside prompts written for Agentmods.

Original Agentmods code and content use [MIT](LICENSE). Imported files retain their licenses and attribution: MIT for the Mint examples and Apache-2.0 for the Claude Code playground assets. See [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).

## Prompt-copy statistics and hosting

For Vercel, follow [the Vercel + Upstash deployment guide](docs/VERCEL.md). `vercel.json` routes the statistics API to a Vercel Function; Redis provides persistent totals and separate Preview/Production namespaces. The Node/SQLite instructions below apply to conventional Node hosting.

“Prompt copies” counts successful **Copy prompt** actions recorded by this site's API, including adaptation and agent-specific prompts. Copy source, Copy install command, failed clipboard operations, and manual text selection do not increase the total. These are action counts, not unique users, downloads, or completed installations. Most copied sorts the shared totals, using curated order for ties.

The development and preview servers include the statistics API. To serve the production build with persistent counters:

```bash
npm run build
npm run serve
```

The server uses Node.js 22.18+ and the built-in SQLite module; Node 22 currently prints its experimental SQLite notice. It listens on `127.0.0.1:3000` by default. Configure `HOST` and `PORT` for your hosting setup, and set `AGENTMODS_STATS_DB` to a database path on persistent storage. The default is `.agentmods/prompt-copies.sqlite`, excluded from Git. The runtime needs `server/`, `scripts/read-mods.mjs`, `src/mod-files.ts`, `mods/`, `dist/`, and the installed production dependencies.

Deploy one database on persistent local disk and route `/api/` to this Node server on the same origin as the website. Uploading only `dist/` to static hosting provides the catalog; counters display **Unavailable** until the API is connected. Clipboard actions continue to work if statistics are offline. Do not initialize production counters with sample/test data.

Copy events store a random per-action ID, mod ID, and selected prompt variant, never the prompt text or a persistent visitor identifier. Retry IDs are retained for seven days; concurrent writes are transactional. Writes require JSON, reject cross-origin browser requests, and are bounded by a per-network-peer rate limit. The API is an anonymous activity counter, not an authenticated installation ledger; use hosting-level rate limits for a public deployment. Behind a reverse proxy, the built-in limit applies to the proxy peer.

## Summaries, readiness, and verification

Each mod's At a glance section explains its purpose, display, actions, and required capabilities before the full prompt. Readiness is derived from the selected implementation: Creation recipe, Reference source, or Installable package. The catalog displays the most complete listed format.

Harness verification is separate from readiness. **Verified** requires a recorded runtime environment, test date, and evidence link for that specific implementation. Catalog/build tests do not certify a mod's behavior inside a harness. Entries without a runtime report display **Not verified**. Dates and changelog entries describe recorded catalog/prompt changes; they do not promise ongoing maintenance or change the upstream package version.

For integration checks, run `npm test`. For isolated production browser checks (installed Chrome/Chromium required), run `npm run test:browser`; use `CHROME_BIN` to select another executable. The browser suite uses a temporary database and writes screenshots to its temporary artifact directory.
