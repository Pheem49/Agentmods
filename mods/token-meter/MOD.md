---
id: "token-meter"
name: "Token Meter"
category: "Context"
author: "Pheem49"
compatibility: "Mint Mods v1"
requiredCapabilities: ["Provider-measured per-turn token usage with documented units", "Turn lifecycle and usage-update events with correlation identities", "A compact UI or supported text output"]
icon: "meter"
tags: ["tokens", "usage", "minimal"]
featured: false
order: 3
permissions: []
version: "1.0.0"
license: "MIT"
repository: "https://github.com/Pheem49/Mint"
source: "main.ts"
updated: "2026-10-14"
overview: {"purpose": "See provider-measured token usage for the current turn without estimating a total.", "placement": "One neutral line above the prompt; supported text or panel fallback.", "actions": ["Read-only counter; no action buttons."]}
changelog: [{"date": "2026-10-14", "scope": "catalog", "summary": "Added a concise overview, readiness and verification details, shared prompt-copy counts, and dated change history."}, {"date": "2026-10-14", "scope": "prompt", "summary": "Expanded creation and adaptation prompts with layout, data states, update rules, state isolation, limitations, and validation examples."}]
---

## Description

A quiet token counter, right above the prompt. Know what the latest turn used without leaving your chat.

## Features

- Provider-measured tokens for the current turn
- A compact above-composer display
- An explicit unavailable state

## Adaptation prompt

Make me a mod called token-meter for the AI coding agent environment I’m currently using: a quiet counter of provider-measured token usage for the current turn, shown above the prompt.

First identify the current agent harness (the app or CLI running this session). Inspect its documentation, extension APIs, and existing mods or plugins before implementing anything. If the target environment cannot be identified from the workspace or session, ask me which app or CLI this is for.

### What it is and what it can do

This is a per-turn usage counter, not a context-window occupancy meter. It reports the measurement supplied by the provider for the current turn and never estimates a count from message length.

### What it should look like

Show a single neutral line such as "12,480 tokens this turn", with a monospace count and a plain-text unit. Before a measurement, show "Usage unavailable". A measured zero appears as "0 tokens this turn". There are no buttons, percentages, weather colors, or history chart. If the band is unavailable, use supported text output or a small panel with the same wording.

### Updates and data states

Initialize to Usage unavailable unless the API provides a valid snapshot explicitly belonging to the current turn. Reset to Usage unavailable at every new turn. Update when a valid measurement for that turn arrives, and retain its latest result after the turn ends until the next turn begins.

Inspect the documented meaning of each usage field. Use a provider-reported per-turn total when available. If only separately measured input and output counts are available, sum them only when the documentation confirms they are compatible and non-overlapping. Do not combine context occupancy, session totals, cached tokens, or reasoning tokens in a way that double-counts them. If only partial input/output usage exists, label it explicitly, such as "Input: 12,480 · Output: unavailable", instead of presenting it as a total.

For snapshot events, replace the displayed value rather than summing updates. For documented incremental events, aggregate once using supported event identities. Reject non-finite or negative values, mismatched turn IDs, and late events belonging to an earlier turn. If turn correlation is unavailable, explain that limitation and show Usage unavailable when the measurement cannot be safely attributed. Do not interpret missing usage as zero or carry the previous turn’s count into the new turn.

### State and access

Keep the current turn’s measurement and event identity in session memory only. Clear them on chat/model changes and disablement. Do not persist a lifetime total, read files, execute commands, or retain conversation text. Show an unavailable state and a clear diagnostic when the usage API fails.

### Validation examples

Verify initial unavailability, zero, a valid total, partial usage, snapshot replacement, documented incremental events, duplicate updates, missing or invalid values, a new turn, late measurements from an earlier turn, and model/chat changes.

### Interaction and accessibility

Match the harness’s native theme, typography, and spacing. Keep the display compact in a narrow terminal or panel; preserve full accessible labels when text is shortened. Pair colors and icons with words. Give interactive controls keyboard access, visible focus, and clear labels. Report errors without moving focus or silently replacing valid state. Release subscriptions and timers when disabled, and do not overwrite another mod’s UI if the harness provides a supported composition mechanism.

### Compatibility and completion

Use only supported APIs and installation conventions. Prefer the display locations described above when supported; otherwise explain the limitation and use a supported alternative. Do not invent APIs, events, or usage measurements. Show unavailable readings explicitly. If the harness has no suitable extension mechanism, explain what cannot be implemented instead of claiming the mod is installed.

Preserve existing permissions and unrelated settings. Update an existing mod in its current folder when present. Preserve license notices when adapting reference source. Treat provided source as a reference: verify the requested behavior rather than assuming the reference already implements every requirement. Validate the result using the harness’s supported tools and explain how to enable it, including any unavailable features and any validation that could not be performed.

## Prompt

Make me a Mint mod called token-meter: a quiet counter of provider-measured token usage for the current turn, shown above the prompt.

Inspect Mint's current mod SDK, documentation, and existing mods before implementing anything. Use only documented, supported events, state, commands, and UI controls. Explain unavailable capabilities instead of inventing an API.

### What it is and what it can do

This is a per-turn usage counter, not a context-window occupancy meter. It reports the measurement supplied by the provider for the current turn and never estimates a count from message length.

### What it should look like

Show a single neutral line such as "12,480 tokens this turn", with a monospace count and a plain-text unit. Before a measurement, show "Usage unavailable". A measured zero appears as "0 tokens this turn". There are no buttons, percentages, weather colors, or history chart. If the band is unavailable, use supported text output or a small panel with the same wording.

### Updates and data states

Initialize to Usage unavailable unless the API provides a valid snapshot explicitly belonging to the current turn. Reset to Usage unavailable at every new turn. Update when a valid measurement for that turn arrives, and retain its latest result after the turn ends until the next turn begins.

Inspect the documented meaning of each usage field. Use a provider-reported per-turn total when available. If only separately measured input and output counts are available, sum them only when the documentation confirms they are compatible and non-overlapping. Do not combine context occupancy, session totals, cached tokens, or reasoning tokens in a way that double-counts them. If only partial input/output usage exists, label it explicitly, such as "Input: 12,480 · Output: unavailable", instead of presenting it as a total.

For snapshot events, replace the displayed value rather than summing updates. For documented incremental events, aggregate once using supported event identities. Reject non-finite or negative values, mismatched turn IDs, and late events belonging to an earlier turn. If turn correlation is unavailable, explain that limitation and show Usage unavailable when the measurement cannot be safely attributed. Do not interpret missing usage as zero or carry the previous turn’s count into the new turn.

### State and access

Keep the current turn’s measurement and event identity in session memory only. Clear them on chat/model changes and disablement. Do not persist a lifetime total, read files, execute commands, or retain conversation text. Show an unavailable state and a clear diagnostic when the usage API fails.

### Validation examples

Verify initial unavailability, zero, a valid total, partial usage, snapshot replacement, documented incremental events, duplicate updates, missing or invalid values, a new turn, late measurements from an earlier turn, and model/chat changes.

### Interaction and accessibility

Match the harness’s native theme, typography, and spacing. Keep the display compact in a narrow terminal or panel; preserve full accessible labels when text is shortened. Pair colors and icons with words. Give interactive controls keyboard access, visible focus, and clear labels. Report errors without moving focus or silently replacing valid state. Release subscriptions and timers when disabled, and do not overwrite another mod’s UI if the harness provides a supported composition mechanism.

### Compatibility and completion

Use only supported APIs and installation conventions. Prefer the display locations described above when supported; otherwise explain the limitation and use a supported alternative. Do not invent APIs, events, or usage measurements. Show unavailable readings explicitly. If the harness has no suitable extension mechanism, explain what cannot be implemented instead of claiming the mod is installed.

Preserve existing permissions and unrelated settings. Update an existing mod in its current folder when present. Preserve license notices when adapting reference source. Treat provided source as a reference: verify the requested behavior rather than assuming the reference already implements every requirement. Validate the result using the harness’s supported tools and explain how to enable it, including any unavailable features and any validation that could not be performed.

Create new source in .mint-mods/token-meter/ or update the mod’s existing folder. Inspect Mint’s current mod tools to validate the generated source and report the supported enablement steps. Do not change the original catalog reference package as part of installation.
