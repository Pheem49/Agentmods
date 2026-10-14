---
id: "context-compass"
name: "Context Compass"
category: "Context"
author: "Agentmods"
compatibility: "Mint Mods v1"
requiredCapabilities: ["Measured context occupancy and window capacity", "Documented planning-window data when provided", "Usage, compaction, and model-change events or reliable snapshots"]
icon: "compass"
tags: ["context", "budget", "planning"]
featured: false
order: 6
permissions: []
updated: "2026-10-14"
overview: {"purpose": "Keep measured context usage and available planning-window information in view.", "placement": "Compact Context and Planning line above the prompt; small panel or text fallback.", "actions": ["Read-only readings; no action buttons."]}
changelog: [{"date": "2026-10-14", "scope": "catalog", "summary": "Added a concise overview, readiness and verification details, shared prompt-copy counts, and dated change history."}, {"date": "2026-10-14", "scope": "prompt", "summary": "Expanded creation and adaptation prompts with layout, data states, update rules, state isolation, limitations, and validation examples."}]
---

## Description

Keep the size of your context in view. A simple indicator for the current reading and planning window.

## Features

- The latest measured context usage
- A planning-window indicator
- Stale measurements cleared after compaction

## Adaptation prompt

Make me a mod called context-compass for the AI coding agent environment I’m currently using: a compact view of measured context usage and any documented planning-window information.

First identify the current agent harness (the app or CLI running this session). Inspect its documentation, extension APIs, and existing mods or plugins before implementing anything. If the target environment cannot be identified from the workspace or session, ask me which app or CLI this is for.

### What it is and what it can do

This is a read-only guide to the current context reading and the harness’s documented planning-window metric. It does not infer a planning budget from context size or change model settings.

### What it should look like

Prefer a compact line above the prompt: "Context 28% · 56k / 200k | Planning: Unknown". Use plain labels, monospace readings, and a separator between Context and Planning. These are format examples, not initial values.

When the planning API provides a documented metric, show its actual name, unit, and value. Show a percentage or progress bar only if it provides a comparable numerator and positive capacity; do not imply every planning metric is a token budget. Preserve available context fields individually and use Unknown for unavailable fields. If no readings exist, show "Context: Unknown | Planning: Unknown". No action buttons are required. On narrow displays, wrap into two labeled lines or shorten numbers without dropping the labels. If the band is unsupported, use a small panel or supported text command.

### Updates and data states

Initialize from supported current snapshots. Update each section independently when its documented data changes. Accept finite nonnegative readings and known positive capacities; a measured zero is valid. Derive context percentage only from measured occupancy and capacity for the same snapshot. Never substitute cumulative usage or estimated token counts.

Track the chat, model, and context-generation identity when the API exposes them. After context compaction, invalidate old occupancy and planning readings, show "Waiting for fresh reading", and accept only events or snapshots known to belong to the new generation. Apply the same reset after chat, model, or window-capacity changes. Do not restore older measurements as current. If freshness cannot be determined, label retained values "May be stale" or show Unknown rather than fabricating a current reading.

If the planning field is unsupported, keep "Planning: Unknown" and explain the missing capability during setup. If a provider measurement fails, clear the affected reading, retain other independently valid fields, and expose a short diagnostic. Updating the display must never trigger compaction or a model-settings change.

### State and access

Keep readings and freshness identities in session memory only; do not persist measurements across restarts. Use supported session/usage APIs. No file access, tool execution, message storage, or network requests beyond those supplied by the harness are needed.

### Validation examples

Verify zero, partial context readings, absent planning data, a planning metric with different units, invalid capacities, independent updates, compaction, delayed pre-compaction events, model/chat switches, provider errors, and narrow-display wrapping.

### Interaction and accessibility

Match the harness’s native theme, typography, and spacing. Keep the display compact in a narrow terminal or panel; preserve full accessible labels when text is shortened. Pair colors and icons with words. Give interactive controls keyboard access, visible focus, and clear labels. Report errors without moving focus or silently replacing valid state. Release subscriptions and timers when disabled, and do not overwrite another mod’s UI if the harness provides a supported composition mechanism.

### Compatibility and completion

Use only supported APIs and installation conventions. Prefer the display locations described above when supported; otherwise explain the limitation and use a supported alternative. Do not invent APIs, events, or usage measurements. Show unavailable readings explicitly. If the harness has no suitable extension mechanism, explain what cannot be implemented instead of claiming the mod is installed.

Preserve existing permissions and unrelated settings. Update an existing mod in its current folder when present. Preserve license notices when adapting reference source. Treat provided source as a reference: verify the requested behavior rather than assuming the reference already implements every requirement. Validate the result using the harness’s supported tools and explain how to enable it, including any unavailable features and any validation that could not be performed.

## Prompt

Make me a Mint mod called context-compass: a compact view of measured context usage and any documented planning-window information.

Inspect Mint's current mod SDK, documentation, and existing mods before implementing anything. Use only documented, supported events, state, commands, and UI controls. Explain unavailable capabilities instead of inventing an API.

### What it is and what it can do

This is a read-only guide to the current context reading and the harness’s documented planning-window metric. It does not infer a planning budget from context size or change model settings.

### What it should look like

Prefer a compact line above the prompt: "Context 28% · 56k / 200k | Planning: Unknown". Use plain labels, monospace readings, and a separator between Context and Planning. These are format examples, not initial values.

When the planning API provides a documented metric, show its actual name, unit, and value. Show a percentage or progress bar only if it provides a comparable numerator and positive capacity; do not imply every planning metric is a token budget. Preserve available context fields individually and use Unknown for unavailable fields. If no readings exist, show "Context: Unknown | Planning: Unknown". No action buttons are required. On narrow displays, wrap into two labeled lines or shorten numbers without dropping the labels. If the band is unsupported, use a small panel or supported text command.

### Updates and data states

Initialize from supported current snapshots. Update each section independently when its documented data changes. Accept finite nonnegative readings and known positive capacities; a measured zero is valid. Derive context percentage only from measured occupancy and capacity for the same snapshot. Never substitute cumulative usage or estimated token counts.

Track the chat, model, and context-generation identity when the API exposes them. After context compaction, invalidate old occupancy and planning readings, show "Waiting for fresh reading", and accept only events or snapshots known to belong to the new generation. Apply the same reset after chat, model, or window-capacity changes. Do not restore older measurements as current. If freshness cannot be determined, label retained values "May be stale" or show Unknown rather than fabricating a current reading.

If the planning field is unsupported, keep "Planning: Unknown" and explain the missing capability during setup. If a provider measurement fails, clear the affected reading, retain other independently valid fields, and expose a short diagnostic. Updating the display must never trigger compaction or a model-settings change.

### State and access

Keep readings and freshness identities in session memory only; do not persist measurements across restarts. Use supported session/usage APIs. No file access, tool execution, message storage, or network requests beyond those supplied by the harness are needed.

### Validation examples

Verify zero, partial context readings, absent planning data, a planning metric with different units, invalid capacities, independent updates, compaction, delayed pre-compaction events, model/chat switches, provider errors, and narrow-display wrapping.

### Interaction and accessibility

Match the harness’s native theme, typography, and spacing. Keep the display compact in a narrow terminal or panel; preserve full accessible labels when text is shortened. Pair colors and icons with words. Give interactive controls keyboard access, visible focus, and clear labels. Report errors without moving focus or silently replacing valid state. Release subscriptions and timers when disabled, and do not overwrite another mod’s UI if the harness provides a supported composition mechanism.

### Compatibility and completion

Use only supported APIs and installation conventions. Prefer the display locations described above when supported; otherwise explain the limitation and use a supported alternative. Do not invent APIs, events, or usage measurements. Show unavailable readings explicitly. If the harness has no suitable extension mechanism, explain what cannot be implemented instead of claiming the mod is installed.

Preserve existing permissions and unrelated settings. Update an existing mod in its current folder when present. Preserve license notices when adapting reference source. Treat provided source as a reference: verify the requested behavior rather than assuming the reference already implements every requirement. Validate the result using the harness’s supported tools and explain how to enable it, including any unavailable features and any validation that could not be performed.

Create new source in .mint-mods/context-compass/ or update the mod’s existing folder. Inspect Mint’s current mod tools to validate the generated source and report the supported enablement steps. Do not change the original catalog reference package as part of installation.
