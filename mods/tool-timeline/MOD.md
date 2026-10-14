---
id: "tool-timeline"
name: "Tool Timeline"
category: "Workflow"
author: "Agentmods"
compatibility: "Adaptation recipe — depends on harness capabilities"
icon: "timeline"
tags: ["tools", "events", "timeline", "duration"]
featured: false
order: 12
license: "MIT"
agents: {}
adaptationPrompt: "body"
requiredCapabilities: ["Supported tool-start and tool-completion events with correlation IDs", "A clock for measuring elapsed duration", "Per-session state and a panel or text output"]
preview: "preview.svg"
updated: "2026-10-14"
overview: {"purpose": "Follow observed tool calls, outcomes, and measured durations without interrupting them.", "placement": "Chronological side-panel list plus a compact running/completed hint above the prompt.", "actions": ["Filter by status", "Open call details", "Clear completed", "Jump to latest"]}
changelog: [{"date": "2026-10-14", "scope": "catalog", "summary": "Added a concise overview, readiness and verification details, shared prompt-copy counts, and dated change history."}, {"date": "2026-10-14", "scope": "prompt", "summary": "Added a complete neutral creation recipe and illustrative layout."}]
---

## Description

Follow the tools your agent uses. See running calls, completed results, and measured durations in a compact timeline without interrupting the work.

## Features

- A chronological list of observed tool calls
- Running, succeeded, failed, and cancelled states
- Measured durations with explicit unknown states
- Status filters, detail view, and a clear action

## Prompt

Make me a mod called tool-timeline for the AI coding agent environment I’m currently using: a live activity timeline showing which tools the agent is calling, which ones are still running, and how each observed call ended.

First identify the current agent harness (the app or CLI running this session). Inspect its documentation, extension APIs, and existing mods or plugins before implementing anything. If the target environment cannot be identified from the workspace or session, ask me which app or CLI this is for.

### What it is and what it can do

This is a read-only activity monitor for supported tool events. It helps me follow the agent’s work without blocking, retrying, cancelling, or modifying tool calls.

### What it should look like

Prefer a side panel titled "Tool Timeline". In its header, show counts of running and completed calls, a status filter with All, Running, Failed, and Cancelled options, and a Clear completed action. Below it, show a chronological list, oldest first:
- A status icon and word: Running, Succeeded, Failed, Cancelled, or Unknown.
- The tool name and a short, safe description when the event provides one.
- The start time and elapsed duration, such as "Read · Succeeded · 0.8s".
- A shortened call ID so overlapping calls can be distinguished.

Use a neutral spinner for Running, a check for Succeeded, an error mark for Failed, and a stop mark for Cancelled. Always show a text label alongside color or icons. Render times and IDs in monospace. Clicking a row should show the full call ID, available timestamps, and a sanitized error summary; keep raw arguments and outputs hidden. Show "No tool calls observed" before the first event and "Tool events unavailable" when the harness cannot expose them.

Above the prompt, show a compact status when supported, such as "Tools · 2 running · 5 completed · 1 failed". If a panel is unavailable, use a compact list or supported text command. State which interactions are unavailable.

### Events and update rules

Create a Running entry on each observed tool-start event. Match completion events by their documented call ID, never just by tool name. Update the same entry when a completion arrives; do not create duplicates if events are replayed. Concurrent calls must have independent entries. A retry with a new call ID is a separate call.

Use the documented result status to distinguish success, failure, cancellation, and permission denial. Render a denied call as "Blocked" in the row and count it separately from successes. If the API does not provide an outcome, show "Unknown"; do not infer success from the mere presence of output. If a completion arrives without a start, show the known result with "Start unknown" and an unavailable duration.

Measure duration with a monotonic clock for calls observed from start to finish when possible. Show "Duration unavailable" when timing cannot be established. Update running durations at most once per second; stop the timer when no calls are running and release all subscriptions and timers when disabled. If the harness reports interruption without an outcome, mark unfinished calls Unknown rather than leaving them running forever.

Retain the latest 100 completed calls plus active calls. Clear completed removes completed entries only and leaves running calls intact. Keep the view stable while I am reading older rows; provide a Jump to latest action instead of forcing scroll on every event. Recalculate the visible counts after completion, filtering, or clearing, and label counts as retained-session counts rather than lifetime totals.

### State and access

Keep history in memory for the current session only. Do not write log files, inspect workspace files, or persist raw tool inputs and outputs. Omit credentials, tokens, and sensitive payloads. Do not attempt to replace the tool runner or bypass the harness’s permission checks. If tool-start or tool-completion events are unavailable, explain that the live timeline cannot be implemented accurately.

### Validation examples

Verify concurrent calls of the same tool, out-of-order events, duplicate completions, denied calls, failures, cancellations, missing start events, missing outcomes, duration updates, clearing with a running call, and disabling the mod without leaving timers active.

### Interaction and accessibility

Match the harness’s native typography, spacing, and theme. Keep long content scrollable and controls usable in a narrow panel. Give every action a clear text label, support keyboard navigation and visible focus, and announce asynchronous success or errors without moving focus. Do not rely on color alone. Disable unavailable actions with a visible reason, and show an in-progress state for asynchronous actions without changing the panel layout.

### Compatibility and completion

Use only supported APIs and installation conventions. Prefer the display locations described above when supported; otherwise explain the limitation and use a supported alternative. Do not invent APIs, events, or usage measurements. Show unavailable readings explicitly. If the harness has no suitable extension mechanism, explain what cannot be implemented instead of claiming the mod is installed.

Preserve existing permissions and unrelated settings. Update an existing mod in its current folder when present. Preserve license notices when adapting reference source. Validate the result using the harness’s supported tools and explain how to enable it, including any unavailable features. Distinguish verified behavior from behavior that could not be tested in this environment.
