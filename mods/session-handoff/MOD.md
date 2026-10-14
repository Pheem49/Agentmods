---
id: "session-handoff"
name: "Session Handoff"
category: "Context"
author: "Agentmods"
compatibility: "Adaptation recipe — depends on harness capabilities"
icon: "handoff"
tags: ["handoff", "summary", "continuity", "new-chat"]
featured: false
order: 11
license: "MIT"
agents: {}
adaptationPrompt: "body"
requiredCapabilities: ["Read access to the current conversation or a user-provided briefing", "A supported user-triggered summary action", "Per-chat state and a panel or text output", "Optional clipboard access and user-selected Markdown export"]
preview: "preview.svg"
updated: "2026-10-14"
overview: {"purpose": "Build an editable briefing so a new chat can continue the goal, decisions, and unfinished work.", "placement": "Side panel with Goal, Done, Decisions, Next steps, Files, Questions, and Constraints.", "actions": ["Generate briefing", "Edit before copying", "Copy Markdown", "Optional export to a user-selected file"]}
changelog: [{"date": "2026-10-14", "scope": "catalog", "summary": "Added a concise overview, readiness and verification details, shared prompt-copy counts, and dated change history."}, {"date": "2026-10-14", "scope": "prompt", "summary": "Added a complete neutral creation recipe and illustrative layout."}]
---

## Description

A compact briefing for your next chat. Keep the goal, progress, open questions, and next steps together, then copy them when you need a fresh start.

## Features

- A structured, editable handoff briefing
- Generate, copy, and optional Markdown export actions
- Per-chat state with freshness indicators
- Explicit unknowns and user-reviewed next steps

## Prompt

Make me a mod called session-handoff for the AI coding agent environment I’m currently using: a compact briefing that helps me continue this task in a new chat without losing the goal, decisions, or unfinished work.

First identify the current agent harness (the app or CLI running this session). Inspect its documentation, extension APIs, and existing mods or plugins before implementing anything. If the target environment cannot be identified from the workspace or session, ask me which app or CLI this is for.

### What it is and what it can do

This is a user-triggered handoff builder. It summarizes the conversation and available task evidence into an editable briefing; it does not continue the task, send a message to another agent, or start a new chat on my behalf.

### What it should look like

Prefer a side panel titled "Session Handoff". Use a compact header with a freshness label, the generation time, and Generate, Copy, and Export Markdown actions. Below it, show these sections in this order:
- Goal: one short paragraph describing what I am trying to achieve.
- Done: concise bullets for completed work, citing file paths or check results when available.
- Decisions: choices already made and the reason for each.
- Next steps: a numbered list of unfinished work, ordered by priority.
- Important files: workspace-relative paths and a short note explaining their role.
- Open questions and blockers: unresolved items, including missing information.
- Constraints: relevant user requirements and things the next agent must preserve.

Use readable text, clear section headings, and a scrollable body. Let me edit the briefing before copying or exporting it. Mark unavailable information as "Unknown" and render an empty section as "None recorded". Show "No handoff yet" with a Generate action before the first briefing. If a panel is unavailable, expose the same structured briefing through a supported command or text output; explain which editing or button interactions are unavailable.

Above the prompt, show a compact hint when supported, such as "Handoff ready · Updated after turn 8" or "Handoff out of date · Generate again". These are format examples, not initial data.

### Actions and update rules

Generate only when I request it. Build the briefing from accessible conversation history and observed task evidence. Include all the sections above and separate completed work from proposed work. Preserve unresolved questions, and do not claim that a check passed without its actual result. If conversation access or model-backed summarization is unavailable to the extension, offer a manual briefing editor or user-invoked workflow instead of pretending automatic summarization exists.

After later turns, mark the saved briefing as out of date when supported turn events are available; do not regenerate it silently. When those events are unavailable, show the generation time and "Freshness unknown". Before replacing a briefing I have edited, let me keep it or explicitly replace it. Retain the previous briefing if generation fails and show a clear error.

Copy should copy the visible, edited briefing as Markdown and report success or failure. Export Markdown is optional: ask me for the destination and confirm before overwriting an existing file. Do not create workspace files automatically. Expose handoff, handoff-generate, and handoff-copy commands only if the harness supports custom commands.

### State and access

Keep the briefing and its generation metadata separately for each chat using supported mod state. If persistence is unavailable, label the briefing "Session only". Limit input to the current chat and task evidence available through supported APIs. Do not read unrelated chats, secret files, environment variables, or credentials. Omit credentials and sensitive payloads from the briefing. Do not upload or send it anywhere automatically.

### Validation examples

Verify the empty state, a generated briefing with missing evidence, manual editing, copy failure, a later turn making the briefing stale, regeneration without losing edits, and isolation between chats. Verify that export does not overwrite a file without confirmation and that no summary runs automatically.

### Interaction and accessibility

Match the harness’s native typography, spacing, and theme. Keep long content scrollable and controls usable in a narrow panel. Give every action a clear text label, support keyboard navigation and visible focus, and announce asynchronous success or errors without moving focus. Do not rely on color alone. Disable unavailable actions with a visible reason, and show an in-progress state for asynchronous actions without changing the panel layout.

### Compatibility and completion

Use only supported APIs and installation conventions. Prefer the display locations described above when supported; otherwise explain the limitation and use a supported alternative. Do not invent APIs, events, or usage measurements. Show unavailable readings explicitly. If the harness has no suitable extension mechanism, explain what cannot be implemented instead of claiming the mod is installed.

Preserve existing permissions and unrelated settings. Update an existing mod in its current folder when present. Preserve license notices when adapting reference source. Validate the result using the harness’s supported tools and explain how to enable it, including any unavailable features. Distinguish verified behavior from behavior that could not be tested in this environment.
