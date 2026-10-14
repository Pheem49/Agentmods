---
id: "turn-journal"
name: "Turn Journal"
category: "Workflow"
author: "Agentmods"
compatibility: "Mint Mods v1"
requiredCapabilities: ["Turn-end events with stable turn IDs and documented completion outcomes", "Provider-measured usage correlated to a turn when available", "Per-chat state and a panel or supported text output"]
icon: "journal"
tags: ["history", "turns", "journal"]
featured: false
order: 5
permissions: []
updated: "2026-10-14"
overview: {"purpose": "Review the latest 20 observed turn endings, statuses, and measured usage.", "placement": "Scrollable side panel, newest entries first; supported text-list fallback.", "actions": ["Confirm Clear journal"]}
changelog: [{"date": "2026-10-14", "scope": "catalog", "summary": "Added a concise overview, readiness and verification details, shared prompt-copy counts, and dated change history."}, {"date": "2026-10-14", "scope": "prompt", "summary": "Expanded creation and adaptation prompts with layout, data states, update rules, state isolation, limitations, and validation examples."}]
---

## Description

Leave a short trail of completed turns. Keep a lightweight activity journal in a panel beside the conversation.

## Features

- A journal of the latest 20 turns
- Completion status and measured usage
- A clear action

## Adaptation prompt

Make me a mod called turn-journal for the AI coding agent environment I’m currently using: a lightweight journal of the latest 20 ended turns in a side panel.

First identify the current agent harness (the app or CLI running this session). Inspect its documentation, extension APIs, and existing mods or plugins before implementing anything. If the target environment cannot be identified from the workspace or session, ask me which app or CLI this is for.

### What it is and what it can do

This is a compact record of observed turn endings. It lists when each turn ended, its documented status, and measured usage. It is not a transcript archive or proof that every attempted edit succeeded.

### What it should look like

Prefer a side panel titled "Turn Journal" with a retained-entry count and a Clear journal action. Show newest entries first, up to 20 rows. Each row has the end time in the user’s local timezone, a short turn identifier, a status word, and its measured tokens.

Use statuses Completed, Failed, Cancelled, or Unknown according to the documented result. Pair status icons with words. Format measured usage as "12,480 tokens", zero as "0 tokens", and missing usage as "Usage unavailable". If only input/output fields are measured, label those fields instead of guessing a total. Render unknown end times as "Time unavailable"; a locally observed time must be labeled "Observed at" rather than a provider end time.

Before any turn ends, show "No turns recorded yet" and disable Clear journal. Keep rows readable and scrollable in a narrow panel. If the panel is unsupported, provide the same ordered list and clear action through supported text commands.

### Actions and update rules

Initialize from this chat’s saved bounded journal. Add one entry per observed terminal turn event, deduplicated by documented chat/turn identity. Repeated delivery updates the same row without adding another. Usage events never create rows. If a later usage event is reliably correlated to a recorded turn, update that row only; do not assign the latest turn’s usage to an older entry. Unknown status stays Unknown until actual outcome evidence arrives.

After insertion, keep the latest 20 by documented turn order where available; otherwise label the ordering as observed order. Do not let a late older completion displace newer entries merely because it arrived last. Clear journal confirms when entries exist, cancels without changes, and clears only this chat’s entries. Keep enough documented cursor/deduplication state to avoid repopulating cleared entries from replayed events. New turns can be recorded normally.

Update the panel after each terminal event, a correlated late measurement, clearing, or a chat switch. If loading or saving fails, show an error and preserve the last valid journal; do not replace it with an apparently empty history. Compaction does not erase the journal, but no stale context measurement may be presented as per-turn usage.

### State and access

Store only turn IDs, status, timestamps, and numeric measured usage in per-chat mod state. Do not store prompts, responses, tool arguments, or workspace contents. If persistence or chat identity is unavailable, keep session-only state and label it. No workspace file access or shell tools are required.

### Validation examples

Verify empty history, each terminal status, missing usage/time/status, measured zero, duplicates, out-of-order endings, a late correlated measurement, retention at 20 rows, clear confirmation/cancellation, duplicate events after clearing, restore failure, and isolation between chats.

### Interaction and accessibility

Match the harness’s native theme, typography, and spacing. Keep the display compact in a narrow terminal or panel; preserve full accessible labels when text is shortened. Pair colors and icons with words. Give interactive controls keyboard access, visible focus, and clear labels. Report errors without moving focus or silently replacing valid state. Release subscriptions and timers when disabled, and do not overwrite another mod’s UI if the harness provides a supported composition mechanism.

### Compatibility and completion

Use only supported APIs and installation conventions. Prefer the display locations described above when supported; otherwise explain the limitation and use a supported alternative. Do not invent APIs, events, or usage measurements. Show unavailable readings explicitly. If the harness has no suitable extension mechanism, explain what cannot be implemented instead of claiming the mod is installed.

Preserve existing permissions and unrelated settings. Update an existing mod in its current folder when present. Preserve license notices when adapting reference source. Treat provided source as a reference: verify the requested behavior rather than assuming the reference already implements every requirement. Validate the result using the harness’s supported tools and explain how to enable it, including any unavailable features and any validation that could not be performed.

## Prompt

Make me a Mint mod called turn-journal: a lightweight journal of the latest 20 ended turns in a side panel.

Inspect Mint's current mod SDK, documentation, and existing mods before implementing anything. Use only documented, supported events, state, commands, and UI controls. Explain unavailable capabilities instead of inventing an API.

### What it is and what it can do

This is a compact record of observed turn endings. It lists when each turn ended, its documented status, and measured usage. It is not a transcript archive or proof that every attempted edit succeeded.

### What it should look like

Prefer a side panel titled "Turn Journal" with a retained-entry count and a Clear journal action. Show newest entries first, up to 20 rows. Each row has the end time in the user’s local timezone, a short turn identifier, a status word, and its measured tokens.

Use statuses Completed, Failed, Cancelled, or Unknown according to the documented result. Pair status icons with words. Format measured usage as "12,480 tokens", zero as "0 tokens", and missing usage as "Usage unavailable". If only input/output fields are measured, label those fields instead of guessing a total. Render unknown end times as "Time unavailable"; a locally observed time must be labeled "Observed at" rather than a provider end time.

Before any turn ends, show "No turns recorded yet" and disable Clear journal. Keep rows readable and scrollable in a narrow panel. If the panel is unsupported, provide the same ordered list and clear action through supported text commands.

### Actions and update rules

Initialize from this chat’s saved bounded journal. Add one entry per observed terminal turn event, deduplicated by documented chat/turn identity. Repeated delivery updates the same row without adding another. Usage events never create rows. If a later usage event is reliably correlated to a recorded turn, update that row only; do not assign the latest turn’s usage to an older entry. Unknown status stays Unknown until actual outcome evidence arrives.

After insertion, keep the latest 20 by documented turn order where available; otherwise label the ordering as observed order. Do not let a late older completion displace newer entries merely because it arrived last. Clear journal confirms when entries exist, cancels without changes, and clears only this chat’s entries. Keep enough documented cursor/deduplication state to avoid repopulating cleared entries from replayed events. New turns can be recorded normally.

Update the panel after each terminal event, a correlated late measurement, clearing, or a chat switch. If loading or saving fails, show an error and preserve the last valid journal; do not replace it with an apparently empty history. Compaction does not erase the journal, but no stale context measurement may be presented as per-turn usage.

### State and access

Store only turn IDs, status, timestamps, and numeric measured usage in per-chat mod state. Do not store prompts, responses, tool arguments, or workspace contents. If persistence or chat identity is unavailable, keep session-only state and label it. No workspace file access or shell tools are required.

### Validation examples

Verify empty history, each terminal status, missing usage/time/status, measured zero, duplicates, out-of-order endings, a late correlated measurement, retention at 20 rows, clear confirmation/cancellation, duplicate events after clearing, restore failure, and isolation between chats.

### Interaction and accessibility

Match the harness’s native theme, typography, and spacing. Keep the display compact in a narrow terminal or panel; preserve full accessible labels when text is shortened. Pair colors and icons with words. Give interactive controls keyboard access, visible focus, and clear labels. Report errors without moving focus or silently replacing valid state. Release subscriptions and timers when disabled, and do not overwrite another mod’s UI if the harness provides a supported composition mechanism.

### Compatibility and completion

Use only supported APIs and installation conventions. Prefer the display locations described above when supported; otherwise explain the limitation and use a supported alternative. Do not invent APIs, events, or usage measurements. Show unavailable readings explicitly. If the harness has no suitable extension mechanism, explain what cannot be implemented instead of claiming the mod is installed.

Preserve existing permissions and unrelated settings. Update an existing mod in its current folder when present. Preserve license notices when adapting reference source. Treat provided source as a reference: verify the requested behavior rather than assuming the reference already implements every requirement. Validate the result using the harness’s supported tools and explain how to enable it, including any unavailable features and any validation that could not be performed.

Create new source in .mint-mods/turn-journal/ or update the mod’s existing folder. Inspect Mint’s current mod tools to validate the generated source and report the supported enablement steps. Do not change the original catalog reference package as part of installation.
