---
id: "token-weather"
name: "Token Weather"
category: "Context"
author: "Pheem49"
compatibility: "Mint Mods v1"
requiredCapabilities: ["Measured context usage, capacity, and compaction events", "Turn-completion events with stable turn IDs or a documented deduplication mechanism", "Per-chat state and a compact UI or text output"]
icon: "weather"
tags: ["context", "tokens", "usage"]
featured: true
order: 1
permissions: []
version: "1.0.0"
license: "MIT"
repository: "https://github.com/Pheem49/Mint"
source: "main.ts"
agents:
  mint:
    prompt: body
    source: main.ts
  claude-code:
    source: token-weather.mjs
    version: "0.1.0"
    license: Apache-2.0
    screenshots:
      - file: token-weather-clear.png
        alt: Clear forecast at 18 percent context usage in Claude Code
      - file: token-weather-showers.png
        alt: Showers forecast at 67 percent context usage in Claude Code
      - file: token-weather-storm.png
        alt: Storm forecast at 81 percent context usage in Claude Code
    compatibility: Claude Code 2.1.287+ (terminal)
    author: Claude Code DevRel
    repository: https://github.com/anthropics/claude-code-playground/tree/main/claude-code/mods/token-weather
    prompt: |
      Install the original Token Weather mod for Claude Code from anthropics/claude-code-playground. Use the same upstream package as the install commands below, with its source and behavior unchanged. Do not recreate the mod from a description.

      Installation steps:

      ```bash
      git clone https://github.com/anthropics/claude-code-playground.git
      cd claude-code-playground/claude-code/mods
      claude plugin validate ./token-weather
      claude plugin marketplace add ./
      claude plugin install token-weather@claude-code-playground-mods --scope user
      ```

      Before running the steps, check whether the repository and plugin are already installed. Reuse an existing clone of this repository instead of cloning over it. Keep the clone in place because the local marketplace loads its files. Use the user installation scope shown above. Preserve unrelated settings and plugin files.

      Validate the original plugin and confirm the installed plugin name. If this Claude Code session is already open, reload plugins with /reload-plugins if supported, or tell me to restart it. If installation is blocked or validation fails, report the error instead of generating a replacement mod.
    installCommand: |
      git clone https://github.com/anthropics/claude-code-playground.git
      cd claude-code-playground/claude-code/mods
      claude plugin validate ./token-weather
      claude plugin marketplace add ./
      claude plugin install token-weather@claude-code-playground-mods --scope user
    installNotes: >-
      Run once from a folder where claude-code-playground does not already exist.
      If already cloned, skip the clone step and enter its claude-code/mods folder.
      Keep the clone in place: this marketplace loads files from it. The commands install for your user across projects.
      This is an upstream sample shared as-is. Mint and Claude Code use separate implementations.
      In an open Claude Code session, run /reload-plugins after installation.
updated: "2026-10-14"
overview: {"purpose": "See measured context occupancy, recent turns, and when the window is getting full.", "placement": "Compact band above the prompt; supported panel or text fallback.", "actions": ["Read-only weather, usage, history, and delta; no action buttons."]}
changelog: [{"date": "2026-10-14", "scope": "catalog", "summary": "Added a concise overview, readiness and verification details, shared prompt-copy counts, and dated change history."}, {"date": "2026-10-14", "scope": "prompt", "summary": "Expanded creation and adaptation prompts with layout, data states, update rules, state isolation, limitations, and validation examples."}]
---

## Description

A little forecast for your context window. See usage, recent turns, and when it’s time to clear the skies.

## Features

- A context weather band above the composer
- History of the last 12 completed turns
- Unavailable states when provider measurements are missing

## Adaptation prompt

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

## Prompt

Make me a Mint mod called token-weather: a live forecast of context-window occupancy, shown in a compact band above the prompt.

Inspect Mint's current mod SDK, documentation, and existing mods before implementing anything. Use only documented, supported events, state, commands, and UI controls. Explain unavailable capabilities instead of inventing an API.

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

Create new source in .mint-mods/token-weather/ or update the mod’s existing folder. Inspect Mint’s current mod tools to validate the generated source and report the supported enablement steps. Do not change the original catalog reference package as part of installation.
