---
id: "session-counter"
name: "Session Counter"
category: "Utilities"
author: "Agentmods"
compatibility: "Mint Mods v1"
requiredCapabilities: ["Turn-end lifecycle events with stable IDs or a documented deduplication mechanism", "Per-chat state for counts and deduplication metadata", "A compact UI and optional supported reset command"]
icon: "counter"
tags: ["turns", "counter", "starter"]
featured: false
order: 8
permissions: []
updated: "2026-10-14"
overview: {"purpose": "Count observed turn endings exactly once and keep the count scoped to the current chat.", "placement": "One line above the prompt; small panel or text fallback.", "actions": ["Reset counter through a supported command or optional button"]}
changelog: [{"date": "2026-10-14", "scope": "catalog", "summary": "Added a concise overview, readiness and verification details, shared prompt-copy counts, and dated change history."}, {"date": "2026-10-14", "scope": "prompt", "summary": "Expanded creation and adaptation prompts with layout, data states, update rules, state isolation, limitations, and validation examples."}]
---

## Description

A minimal counter for completed turns. A tiny mod that makes a good starting point for your own ideas.

## Features

- A persistent per-chat turn counter
- A reset command
- A simple starter mod

## Adaptation prompt

Make me a mod called session-counter for the AI coding agent environment I’m currently using: a small persistent per-chat counter of turns whose lifecycle has ended.

First identify the current agent harness (the app or CLI running this session). Inspect its documentation, extension APIs, and existing mods or plugins before implementing anything. If the target environment cannot be identified from the workspace or session, ask me which app or CLI this is for.

### What it is and what it can do

This is a lifecycle counter for the current chat. "Completed" means the harness reported that a turn ended, not that the task succeeded. Include failed or cancelled turns only when the harness emits a documented terminal turn event for them. Do not count individual tool calls or usage updates.

### What it should look like

Show one compact line above the prompt, such as "8 turns completed". Use "0 turns completed" for a new chat and "1 turn completed" for one. Keep the count in monospace with a plain-text label. Show "Session only" when durable per-chat state is unavailable.

Expose a supported reset command, and optionally a small Reset counter action if the UI supports it. When turn events are unavailable, show "Turn count unavailable", not a fabricated zero. If the band is unsupported, use a small panel or text command with the same count and reset action.

### Actions and update rules

Load and show the saved count immediately when the mod opens. Increment exactly once for each terminal turn event, using its documented chat/turn identity or a supported once-per-turn lifecycle mechanism. Ignore duplicate, replayed, or out-of-order terminal events already counted. Do not increment on turn start, tool calls, compaction, UI redraw, or reopening the mod. A turn that began before enablement may count when its terminal event is observed; do not invent counts for historical turns never observed.

Reset sets the visible count to zero for this chat only. Confirm a reset when the count is nonzero; cancelling preserves it. Keep deduplication metadata across reset so an old terminal event cannot restore a cleared count. A genuinely new turn increments normally afterward. If a reset occurs during a running turn, that turn counts once when it later ends.

Restore existing numeric counts on upgrade without assuming the absent history is known. Validate stored counts as finite nonnegative integers; if corrupt state cannot be recovered, show "Saved count unavailable" and offer an explicit reset instead of overwriting it silently. Use serialized or transactional state updates when supported so simultaneous actions do not lose an increment. If saving fails, show a diagnostic and do not claim persistence succeeded.

### State and access

Keep the count and documented bounded deduplication metadata in supported per-chat mod state. Do not evict event identities in a way that silently recounts replayed history; use an API cursor or lifecycle semantics when available and report limits when not. If persistence or chat identity is unavailable, use session-only state and label it. Do not access workspace files, store message text, or run tools.

### Validation examples

Verify zero and singular wording, a normal turn, terminal failures/cancellations, duplicate terminal events, reopening, resetting and cancelling, a late duplicate after reset, reset during a running turn, corrupt saved state, save failure, and chat isolation.

### Interaction and accessibility

Match the harness’s native theme, typography, and spacing. Keep the display compact in a narrow terminal or panel; preserve full accessible labels when text is shortened. Pair colors and icons with words. Give interactive controls keyboard access, visible focus, and clear labels. Report errors without moving focus or silently replacing valid state. Release subscriptions and timers when disabled, and do not overwrite another mod’s UI if the harness provides a supported composition mechanism.

### Compatibility and completion

Use only supported APIs and installation conventions. Prefer the display locations described above when supported; otherwise explain the limitation and use a supported alternative. Do not invent APIs, events, or usage measurements. Show unavailable readings explicitly. If the harness has no suitable extension mechanism, explain what cannot be implemented instead of claiming the mod is installed.

Preserve existing permissions and unrelated settings. Update an existing mod in its current folder when present. Preserve license notices when adapting reference source. Treat provided source as a reference: verify the requested behavior rather than assuming the reference already implements every requirement. Validate the result using the harness’s supported tools and explain how to enable it, including any unavailable features and any validation that could not be performed.

## Prompt

Make me a Mint mod called session-counter: a small persistent per-chat counter of turns whose lifecycle has ended.

Inspect Mint's current mod SDK, documentation, and existing mods before implementing anything. Use only documented, supported events, state, commands, and UI controls. Explain unavailable capabilities instead of inventing an API.

### What it is and what it can do

This is a lifecycle counter for the current chat. "Completed" means the harness reported that a turn ended, not that the task succeeded. Include failed or cancelled turns only when the harness emits a documented terminal turn event for them. Do not count individual tool calls or usage updates.

### What it should look like

Show one compact line above the prompt, such as "8 turns completed". Use "0 turns completed" for a new chat and "1 turn completed" for one. Keep the count in monospace with a plain-text label. Show "Session only" when durable per-chat state is unavailable.

Expose a supported reset command, and optionally a small Reset counter action if the UI supports it. When turn events are unavailable, show "Turn count unavailable", not a fabricated zero. If the band is unsupported, use a small panel or text command with the same count and reset action.

### Actions and update rules

Load and show the saved count immediately when the mod opens. Increment exactly once for each terminal turn event, using its documented chat/turn identity or a supported once-per-turn lifecycle mechanism. Ignore duplicate, replayed, or out-of-order terminal events already counted. Do not increment on turn start, tool calls, compaction, UI redraw, or reopening the mod. A turn that began before enablement may count when its terminal event is observed; do not invent counts for historical turns never observed.

Reset sets the visible count to zero for this chat only. Confirm a reset when the count is nonzero; cancelling preserves it. Keep deduplication metadata across reset so an old terminal event cannot restore a cleared count. A genuinely new turn increments normally afterward. If a reset occurs during a running turn, that turn counts once when it later ends.

Restore existing numeric counts on upgrade without assuming the absent history is known. Validate stored counts as finite nonnegative integers; if corrupt state cannot be recovered, show "Saved count unavailable" and offer an explicit reset instead of overwriting it silently. Use serialized or transactional state updates when supported so simultaneous actions do not lose an increment. If saving fails, show a diagnostic and do not claim persistence succeeded.

### State and access

Keep the count and documented bounded deduplication metadata in supported per-chat mod state. Do not evict event identities in a way that silently recounts replayed history; use an API cursor or lifecycle semantics when available and report limits when not. If persistence or chat identity is unavailable, use session-only state and label it. Do not access workspace files, store message text, or run tools.

### Validation examples

Verify zero and singular wording, a normal turn, terminal failures/cancellations, duplicate terminal events, reopening, resetting and cancelling, a late duplicate after reset, reset during a running turn, corrupt saved state, save failure, and chat isolation.

### Interaction and accessibility

Match the harness’s native theme, typography, and spacing. Keep the display compact in a narrow terminal or panel; preserve full accessible labels when text is shortened. Pair colors and icons with words. Give interactive controls keyboard access, visible focus, and clear labels. Report errors without moving focus or silently replacing valid state. Release subscriptions and timers when disabled, and do not overwrite another mod’s UI if the harness provides a supported composition mechanism.

### Compatibility and completion

Use only supported APIs and installation conventions. Prefer the display locations described above when supported; otherwise explain the limitation and use a supported alternative. Do not invent APIs, events, or usage measurements. Show unavailable readings explicitly. If the harness has no suitable extension mechanism, explain what cannot be implemented instead of claiming the mod is installed.

Preserve existing permissions and unrelated settings. Update an existing mod in its current folder when present. Preserve license notices when adapting reference source. Treat provided source as a reference: verify the requested behavior rather than assuming the reference already implements every requirement. Validate the result using the harness’s supported tools and explain how to enable it, including any unavailable features and any validation that could not be performed.

Create new source in .mint-mods/session-counter/ or update the mod’s existing folder. Inspect Mint’s current mod tools to validate the generated source and report the supported enablement steps. Do not change the original catalog reference package as part of installation.
