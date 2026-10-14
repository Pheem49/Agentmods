---
id: "task-checklist"
name: "Task Checklist"
category: "Workflow"
author: "Pheem49"
compatibility: "Mint Mods v1"
requiredCapabilities: ["Per-chat mod state or explicitly labeled session-only state", "Supported input, button, and list controls or custom text commands", "Stable item IDs for independent task actions"]
icon: "checklist"
tags: ["tasks", "planning", "checklist"]
featured: false
order: 2
permissions: []
version: "1.0.0"
license: "MIT"
repository: "https://github.com/Pheem49/Mint"
source: "main.ts"
agents:
  mint:
    prompt: body
    source: main.ts
    overview: {"purpose": "The reference starter adds and clears per-chat tasks. The creation prompt requests an expanded checklist with editing and completion controls.", "placement": "Side panel with a task count, table, New task input, and Clear tasks button.", "actions": ["Add task", "Clear tasks"]}
updated: "2026-10-14"
overview: {"purpose": "Manage a manual task list alongside the conversation, with separate state for each chat.", "placement": "Scrollable side panel with a count, task rows, and a New task input.", "actions": ["Add task", "Edit or remove a task", "Mark complete or incomplete", "Confirm Clear tasks"]}
changelog: [{"date": "2026-10-14", "scope": "catalog", "summary": "Added a concise overview, readiness and verification details, shared prompt-copy counts, and dated change history."}, {"date": "2026-10-14", "scope": "prompt", "summary": "Expanded creation and adaptation prompts with layout, data states, update rules, state isolation, limitations, and validation examples."}]
---

## Description

Keep the next steps beside your conversation. Add tasks, follow your plan, and clear the list when you’re done.

## Features

- A task list in the side panel
- Add, edit, complete, and remove tasks through explicit actions
- Per-chat state and a clear action

## Adaptation prompt

Make me a mod called task-checklist for the AI coding agent environment I’m currently using: a user-managed task list in a side panel beside the conversation.

First identify the current agent harness (the app or CLI running this session). Inspect its documentation, extension APIs, and existing mods or plugins before implementing anything. If the target environment cannot be identified from the workspace or session, ask me which app or CLI this is for.

### What it is and what it can do

This is a small manual task list. Let me add, edit, mark complete, remove, and clear tasks without changing workspace files or executing the tasks.

### What it should look like

Prefer a side panel titled "Task Checklist". Show a header count such as "2 of 5 tasks complete". Each row contains a completion checkbox, task text, and clearly labeled Edit and Remove actions. Use a stable item ID internally; visually strike through completed text while preserving a readable label and checkbox state.

Below the list, show a labeled New task input and an Add action, plus a Clear tasks button. Before the first task, show "No tasks yet — add your first task" and "0 tasks". Disable Clear tasks when empty. Keep long task text wrapped and the body scrollable. On narrow terminals, use concise rows with stable displayed item IDs. If interactive controls are unsupported, expose supported add, edit, complete, remove, and clear commands with a text list; explain unavailable controls.

### Actions and update rules

Trim leading and trailing whitespace and ignore empty additions. Permit equal task names as separate items with separate IDs. Enter or Add creates one item; repeated delivery of the same UI action must not duplicate it. Reset the input only after saving succeeds. Editing preserves the item ID and completion state; Cancel leaves the original text intact. Removing acts on the selected ID, not all items with the same name.

Only explicit user actions change completion state. Do not mark tasks complete from agent statements or tool activity. Clear tasks asks for confirmation only when the list is nonempty, and Cancel preserves it. If confirmation controls are unsupported, use a documented two-step clear command or another supported explicit confirmation mechanism.

Render immediately when opened, after each successful action, and after chat changes. Keep the view synchronized with supported state updates. If saving fails, retain the last confirmed state and show an error; do not claim the action succeeded or erase the input. Cap the list at 100 tasks and each task at 500 characters; reject further additions with a clear message rather than silently truncating them.

### State and access

Store IDs, text, and completion state separately for each chat using supported mod state. Restore the same chat’s list when reopened, preserving existing items when upgrading. Migrate older plain-text task arrays into items with IDs and incomplete status without deleting text. If persistence or chat identity is unavailable, use isolated session-only state and show "Session only". Do not write workspace files, run tasks, read other chats, or require shell access.

### Validation examples

Verify empty and whitespace input, duplicate names, a duplicate action event, editing and cancelling, toggling, removing one duplicate, confirming/cancelling clear, save failure, capacity limits, restoring an existing list, migration from plain-text tasks, and isolation between chats.

### Interaction and accessibility

Match the harness’s native theme, typography, and spacing. Keep the display compact in a narrow terminal or panel; preserve full accessible labels when text is shortened. Pair colors and icons with words. Give interactive controls keyboard access, visible focus, and clear labels. Report errors without moving focus or silently replacing valid state. Release subscriptions and timers when disabled, and do not overwrite another mod’s UI if the harness provides a supported composition mechanism.

### Compatibility and completion

Use only supported APIs and installation conventions. Prefer the display locations described above when supported; otherwise explain the limitation and use a supported alternative. Do not invent APIs, events, or usage measurements. Show unavailable readings explicitly. If the harness has no suitable extension mechanism, explain what cannot be implemented instead of claiming the mod is installed.

Preserve existing permissions and unrelated settings. Update an existing mod in its current folder when present. Preserve license notices when adapting reference source. Treat provided source as a reference: verify the requested behavior rather than assuming the reference already implements every requirement. Validate the result using the harness’s supported tools and explain how to enable it, including any unavailable features and any validation that could not be performed.

## Prompt

Make me a Mint mod called task-checklist: a user-managed task list in a side panel beside the conversation.

Inspect Mint's current mod SDK, documentation, and existing mods before implementing anything. Use only documented, supported events, state, commands, and UI controls. Explain unavailable capabilities instead of inventing an API.

### What it is and what it can do

This is a small manual task list. Let me add, edit, mark complete, remove, and clear tasks without changing workspace files or executing the tasks.

### What it should look like

Prefer a side panel titled "Task Checklist". Show a header count such as "2 of 5 tasks complete". Each row contains a completion checkbox, task text, and clearly labeled Edit and Remove actions. Use a stable item ID internally; visually strike through completed text while preserving a readable label and checkbox state.

Below the list, show a labeled New task input and an Add action, plus a Clear tasks button. Before the first task, show "No tasks yet — add your first task" and "0 tasks". Disable Clear tasks when empty. Keep long task text wrapped and the body scrollable. On narrow terminals, use concise rows with stable displayed item IDs. If interactive controls are unsupported, expose supported add, edit, complete, remove, and clear commands with a text list; explain unavailable controls.

### Actions and update rules

Trim leading and trailing whitespace and ignore empty additions. Permit equal task names as separate items with separate IDs. Enter or Add creates one item; repeated delivery of the same UI action must not duplicate it. Reset the input only after saving succeeds. Editing preserves the item ID and completion state; Cancel leaves the original text intact. Removing acts on the selected ID, not all items with the same name.

Only explicit user actions change completion state. Do not mark tasks complete from agent statements or tool activity. Clear tasks asks for confirmation only when the list is nonempty, and Cancel preserves it. If confirmation controls are unsupported, use a documented two-step clear command or another supported explicit confirmation mechanism.

Render immediately when opened, after each successful action, and after chat changes. Keep the view synchronized with supported state updates. If saving fails, retain the last confirmed state and show an error; do not claim the action succeeded or erase the input. Cap the list at 100 tasks and each task at 500 characters; reject further additions with a clear message rather than silently truncating them.

### State and access

Store IDs, text, and completion state separately for each chat using supported mod state. Restore the same chat’s list when reopened, preserving existing items when upgrading. Migrate older plain-text task arrays into items with IDs and incomplete status without deleting text. If persistence or chat identity is unavailable, use isolated session-only state and show "Session only". Do not write workspace files, run tasks, read other chats, or require shell access.

### Validation examples

Verify empty and whitespace input, duplicate names, a duplicate action event, editing and cancelling, toggling, removing one duplicate, confirming/cancelling clear, save failure, capacity limits, restoring an existing list, migration from plain-text tasks, and isolation between chats.

### Interaction and accessibility

Match the harness’s native theme, typography, and spacing. Keep the display compact in a narrow terminal or panel; preserve full accessible labels when text is shortened. Pair colors and icons with words. Give interactive controls keyboard access, visible focus, and clear labels. Report errors without moving focus or silently replacing valid state. Release subscriptions and timers when disabled, and do not overwrite another mod’s UI if the harness provides a supported composition mechanism.

### Compatibility and completion

Use only supported APIs and installation conventions. Prefer the display locations described above when supported; otherwise explain the limitation and use a supported alternative. Do not invent APIs, events, or usage measurements. Show unavailable readings explicitly. If the harness has no suitable extension mechanism, explain what cannot be implemented instead of claiming the mod is installed.

Preserve existing permissions and unrelated settings. Update an existing mod in its current folder when present. Preserve license notices when adapting reference source. Treat provided source as a reference: verify the requested behavior rather than assuming the reference already implements every requirement. Validate the result using the harness’s supported tools and explain how to enable it, including any unavailable features and any validation that could not be performed.

Create new source in .mint-mods/task-checklist/ or update the mod’s existing folder. Inspect Mint’s current mod tools to validate the generated source and report the supported enablement steps. Do not change the original catalog reference package as part of installation.
