---
id: "review-checklist"
name: "Review Checklist"
category: "Safety"
author: "Agentmods"
compatibility: "Mint Mods v1"
requiredCapabilities: ["Per-chat completion state or labeled session-only state", "Supported checkbox and reset controls or text commands", "A supported confirmation flow for resetting nonempty progress"]
icon: "review"
tags: ["review", "checklist", "quality"]
featured: false
order: 7
permissions: []
updated: "2026-10-14"
overview: {"purpose": "Track the four review reminders you explicitly check before shipping changes.", "placement": "Side panel with four labeled checkboxes and a completion count.", "actions": ["Check or uncheck an item", "Confirm Reset checklist"]}
changelog: [{"date": "2026-10-14", "scope": "catalog", "summary": "Added a concise overview, readiness and verification details, shared prompt-copy counts, and dated change history."}, {"date": "2026-10-14", "scope": "prompt", "summary": "Expanded creation and adaptation prompts with layout, data states, update rules, state isolation, limitations, and validation examples."}]
---

## Description

A small reminder before you ship. Keep your review checklist close to the work, and reset it for the next task.

## Features

- A user-managed review checklist
- Per-chat completion state
- No automatic claims that checks passed

## Adaptation prompt

Make me a mod called review-checklist for the AI coding agent environment I’m currently using: a manual review checklist in a side panel before shipping changes.

First identify the current agent harness (the app or CLI running this session). Inspect its documentation, extension APIs, and existing mods or plugins before implementing anything. If the target environment cannot be identified from the workspace or session, ask me which app or CLI this is for.

### What it is and what it can do

This is a manual reminder of review steps, not a test runner or an automated approval system. It tracks what I explicitly mark complete and does not certify that changes are safe to ship.

### What it should look like

Prefer a side panel titled "Review Checklist" with a header such as "1 of 4 items checked". Start with four unchecked rows in this order:
- Inspect the diff.
- Check that the changes match the requested scope.
- Run the relevant checks.
- Review sensitive changes.

Each row has a checkbox and its full text. Completed rows keep readable text and a checked icon; unchecked rows use an empty checkbox. Below the list, show Reset checklist and the note "Manual checklist — checked items are not verification evidence". No rows should be prechecked. When all are checked, show "4 of 4 items checked" without a "Safe to ship" claim. Keep the layout scrollable and usable in a narrow panel. If a panel is unavailable, provide a numbered text list with supported check, uncheck, and reset commands.

### Actions and update rules

Toggle only the selected item when I use its checkbox or an explicit command. Require stable IDs, so a duplicate event cannot toggle the wrong row or undo a single intended check. Offer an explicit completion value in commands instead of an ambiguous repeated toggle. Update the count and display immediately after a successful state change.

Reset checklist restores the same four default items to unchecked. If any are checked, confirm the reset and preserve them if I cancel. If all are already unchecked, reset is a harmless no-op. Reopening the panel or a new agent turn must not reset progress automatically. Show the current state immediately when opening or switching chats.

Do not execute tests, inspect files automatically, mark completion from tool events, or infer completion from the agent’s prose. A checked "Run the relevant checks" row means only that I checked the reminder; it must not display test outcomes. If state saving fails, retain the previous confirmed values and show a clear error.

### State and access

Keep completion values and stable default item IDs separately for each chat in supported mod state, preserving existing completion state during upgrades. If persistence is unavailable, label state "Session only". Do not read or write workspace files, inspect other chats, or run tools. Keep changes from a chat switch isolated from the previous chat.

### Validation examples

Verify four unchecked initial items, checking and unchecking one item, duplicate action delivery, explicit command completion values, reset confirmation and cancellation, reopening with saved progress, a failed state write, all items checked without approval claims, and chat isolation.

### Interaction and accessibility

Match the harness’s native theme, typography, and spacing. Keep the display compact in a narrow terminal or panel; preserve full accessible labels when text is shortened. Pair colors and icons with words. Give interactive controls keyboard access, visible focus, and clear labels. Report errors without moving focus or silently replacing valid state. Release subscriptions and timers when disabled, and do not overwrite another mod’s UI if the harness provides a supported composition mechanism.

### Compatibility and completion

Use only supported APIs and installation conventions. Prefer the display locations described above when supported; otherwise explain the limitation and use a supported alternative. Do not invent APIs, events, or usage measurements. Show unavailable readings explicitly. If the harness has no suitable extension mechanism, explain what cannot be implemented instead of claiming the mod is installed.

Preserve existing permissions and unrelated settings. Update an existing mod in its current folder when present. Preserve license notices when adapting reference source. Treat provided source as a reference: verify the requested behavior rather than assuming the reference already implements every requirement. Validate the result using the harness’s supported tools and explain how to enable it, including any unavailable features and any validation that could not be performed.

## Prompt

Make me a Mint mod called review-checklist: a manual review checklist in a side panel before shipping changes.

Inspect Mint's current mod SDK, documentation, and existing mods before implementing anything. Use only documented, supported events, state, commands, and UI controls. Explain unavailable capabilities instead of inventing an API.

### What it is and what it can do

This is a manual reminder of review steps, not a test runner or an automated approval system. It tracks what I explicitly mark complete and does not certify that changes are safe to ship.

### What it should look like

Prefer a side panel titled "Review Checklist" with a header such as "1 of 4 items checked". Start with four unchecked rows in this order:
- Inspect the diff.
- Check that the changes match the requested scope.
- Run the relevant checks.
- Review sensitive changes.

Each row has a checkbox and its full text. Completed rows keep readable text and a checked icon; unchecked rows use an empty checkbox. Below the list, show Reset checklist and the note "Manual checklist — checked items are not verification evidence". No rows should be prechecked. When all are checked, show "4 of 4 items checked" without a "Safe to ship" claim. Keep the layout scrollable and usable in a narrow panel. If a panel is unavailable, provide a numbered text list with supported check, uncheck, and reset commands.

### Actions and update rules

Toggle only the selected item when I use its checkbox or an explicit command. Require stable IDs, so a duplicate event cannot toggle the wrong row or undo a single intended check. Offer an explicit completion value in commands instead of an ambiguous repeated toggle. Update the count and display immediately after a successful state change.

Reset checklist restores the same four default items to unchecked. If any are checked, confirm the reset and preserve them if I cancel. If all are already unchecked, reset is a harmless no-op. Reopening the panel or a new agent turn must not reset progress automatically. Show the current state immediately when opening or switching chats.

Do not execute tests, inspect files automatically, mark completion from tool events, or infer completion from the agent’s prose. A checked "Run the relevant checks" row means only that I checked the reminder; it must not display test outcomes. If state saving fails, retain the previous confirmed values and show a clear error.

### State and access

Keep completion values and stable default item IDs separately for each chat in supported mod state, preserving existing completion state during upgrades. If persistence is unavailable, label state "Session only". Do not read or write workspace files, inspect other chats, or run tools. Keep changes from a chat switch isolated from the previous chat.

### Validation examples

Verify four unchecked initial items, checking and unchecking one item, duplicate action delivery, explicit command completion values, reset confirmation and cancellation, reopening with saved progress, a failed state write, all items checked without approval claims, and chat isolation.

### Interaction and accessibility

Match the harness’s native theme, typography, and spacing. Keep the display compact in a narrow terminal or panel; preserve full accessible labels when text is shortened. Pair colors and icons with words. Give interactive controls keyboard access, visible focus, and clear labels. Report errors without moving focus or silently replacing valid state. Release subscriptions and timers when disabled, and do not overwrite another mod’s UI if the harness provides a supported composition mechanism.

### Compatibility and completion

Use only supported APIs and installation conventions. Prefer the display locations described above when supported; otherwise explain the limitation and use a supported alternative. Do not invent APIs, events, or usage measurements. Show unavailable readings explicitly. If the harness has no suitable extension mechanism, explain what cannot be implemented instead of claiming the mod is installed.

Preserve existing permissions and unrelated settings. Update an existing mod in its current folder when present. Preserve license notices when adapting reference source. Treat provided source as a reference: verify the requested behavior rather than assuming the reference already implements every requirement. Validate the result using the harness’s supported tools and explain how to enable it, including any unavailable features and any validation that could not be performed.

Create new source in .mint-mods/review-checklist/ or update the mod’s existing folder. Inspect Mint’s current mod tools to validate the generated source and report the supported enablement steps. Do not change the original catalog reference package as part of installation.
