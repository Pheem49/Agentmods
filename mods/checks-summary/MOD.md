---
id: "checks-summary"
name: "Checks Summary"
category: "Safety"
author: "Agentmods"
compatibility: "Adaptation recipe — depends on harness capabilities"
icon: "checks"
tags: ["tests", "build", "lint", "verification", "stale"]
featured: false
order: 13
license: "MIT"
agents: {}
adaptationPrompt: "body"
requiredCapabilities: ["Supported shell/tool events including command, working directory, and exit code", "Workspace-change events or revision evidence for freshness", "Per-workspace state and a panel or text output"]
preview: "preview.svg"
updated: "2026-10-14"
overview: {"purpose": "Review observed test, build, and lint outcomes and see which results became stale after edits.", "placement": "Side-panel check groups with status and freshness badges; compact prompt-band summary.", "actions": ["Expand observed commands", "Classify an ambiguous command", "Clear history"]}
changelog: [{"date": "2026-10-14", "scope": "catalog", "summary": "Added a concise overview, readiness and verification details, shared prompt-copy counts, and dated change history."}, {"date": "2026-10-14", "scope": "prompt", "summary": "Added a complete neutral creation recipe and illustrative layout."}]
---

## Description

Keep observed test, build, and lint results together. Know which checks passed, failed, or became stale after later file changes.

## Features

- Observed test, build, and lint results in one view
- Exit-code evidence and concise failure details
- Stale-result indicators after workspace changes
- Explicit Not run, Running, and Unknown states

## Prompt

Make me a mod called checks-summary for the AI coding agent environment I’m currently using: an evidence-based summary of test, build, and lint commands that have actually run in this workspace, with freshness indicators after later edits.

First identify the current agent harness (the app or CLI running this session). Inspect its documentation, extension APIs, and existing mods or plugins before implementing anything. If the target environment cannot be identified from the workspace or session, ask me which app or CLI this is for.

### What it is and what it can do

This is a passive verification dashboard. It observes supported command execution events and records their results. It does not run checks automatically and does not treat an agent’s written claim as proof that a check passed.

### What it should look like

Prefer a side panel titled "Checks Summary" with a small header showing the current workspace and a Clear history action. Show three default rows—Tests, Build, and Lint—with an expandable list of the observed commands in each group.

Each command row should show:
- The exact observed command and its workspace-relative working directory.
- A status icon and word: Not run, Running, Passed, Failed, Cancelled, or Unknown.
- Its actual exit code when available, measured duration when available, and completion time.
- A freshness badge: Fresh, Stale, or Freshness unknown.
- A short sanitized failure excerpt when the available output identifies a failure.

Use a check with the word Passed, an error mark with Failed, a spinner with Running, and a neutral dash with Not run or Unknown. Mark stale results with an amber text badge, keeping the previous outcome visible—for example, "Passed · Stale after edits". Never rely on color alone. In the empty state, all three groups show "Not run"; do not prefill successful results.

Above the prompt, show a compact summary when supported, such as "Checks · Tests passed · Build not run · Lint stale". For a group containing multiple distinct commands, report Failed if any current result failed, Running if any is active, and Passed only if all observed current commands passed. Otherwise show Unknown or Not run. Keep freshness separate from result status. If a panel is unavailable, expose the same table through a supported text command.

### Recording and update rules

Record only commands actually observed through supported execution APIs. Correlate starts and completions by call ID, storing the latest run for each combination of command, working directory, and check group. A retry replaces the displayed latest result for that command while retaining a bounded recent history.

Start with conservative recognition of direct, documented test, build, and lint commands and script names found in project configuration, when reading that configuration is permitted. Let me manually classify an observed command if its purpose is ambiguous. Do not treat arbitrary shell text containing the word "test" as a verified test run. A compound shell command is a combined check with one overall exit code unless structured events expose each child result; do not assign the final exit code to every subcommand.

Passed requires an observed successful exit code. Failed requires an observed nonzero exit code. Cancellation or permission denial is never Passed. If the outcome is missing, show Unknown. Do not invent test counts, coverage, exit codes, or durations. A group marked Passed means only its listed observed commands passed; do not imply that the complete project test suite or every check has run.

Track a supported workspace-change sequence when possible. Save the sequence at check start and completion. If workspace files change while the check is running or after completion, conservatively mark the result Stale. A later rerun may become Fresh only if no observed relevant changes happened during that run. If workspace events are unavailable, use a reliable documented revision mechanism when supported; if there is no reliable freshness evidence, show Freshness unknown. Branch, root, or workspace changes must invalidate freshness or switch to separately scoped state.

Update rows immediately on observed command start, completion, cancellation, file change, manual classification, or Clear history. Clear history removes recorded evidence and returns groups to Not run; it must not run any commands or change files.

### State and access

Scope results to the current workspace and session. Keep at most 50 recent runs in mod state. Do not read arbitrary logs or write workspace files. If configuration access is needed, read only relevant project manifest files through supported permissions. Store short sanitized excerpts rather than entire command output, omitting credentials and secrets. Provide no automatic rerun button unless it goes through the harness’s normal explicit user action and permission flow; observation alone must never execute a command.

### Validation examples

Verify an untouched Not run state, success, nonzero exit code, permission denial, cancellation, missing exit code, overlapping runs, a compound command with only an overall result, edits during and after a run, rerunning stale checks, changing workspaces, and missing freshness events. Confirm that opening or clearing the dashboard does not run tests.

### Interaction and accessibility

Match the harness’s native typography, spacing, and theme. Keep long content scrollable and controls usable in a narrow panel. Give every action a clear text label, support keyboard navigation and visible focus, and announce asynchronous success or errors without moving focus. Do not rely on color alone. Disable unavailable actions with a visible reason, and show an in-progress state for asynchronous actions without changing the panel layout.

### Compatibility and completion

Use only supported APIs and installation conventions. Prefer the display locations described above when supported; otherwise explain the limitation and use a supported alternative. Do not invent APIs, events, or usage measurements. Show unavailable readings explicitly. If the harness has no suitable extension mechanism, explain what cannot be implemented instead of claiming the mod is installed.

Preserve existing permissions and unrelated settings. Update an existing mod in its current folder when present. Preserve license notices when adapting reference source. Validate the result using the harness’s supported tools and explain how to enable it, including any unavailable features. Distinguish verified behavior from behavior that could not be tested in this environment.
