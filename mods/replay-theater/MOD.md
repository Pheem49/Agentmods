---
id: replay-theater
name: Replay Theater
category: Workflow
author: Claude Code DevRel
compatibility: Claude Code 2.1.287+ (terminal)
requiredCapabilities: ["Supported file-edit/write tool events with call and turn IDs", "Available before/after edit content or a documented diff payload", "A panel or prompt-band UI with supported navigation controls"]
icon: journal
tags: ["claude-code", "playground", "workflow", "replay-theater"]
featured: false
order: 10
license: Apache-2.0
version: "0.1.0"
repository: https://github.com/anthropics/claude-code-playground/tree/main/claude-code/mods/replay-theater
source: replay-theater.mjs
agents:
  mint:
    compatibility: Mint Mods v1 — creation prompt (port required)
    author: Agentmods
    prompt: |
      Make me a Mint mod called replay-theater: a session-only replay of file-edit tool calls from the last turn, one compact diff at a time.

      Inspect Mint's current mod SDK, documentation, and existing mods before implementing anything. Use only documented, supported events, state, commands, and UI controls. Explain unavailable capabilities instead of inventing an API.

      ### What it is and what it can do

      This is a read-only replay of observed file-edit attempts from the last turn with edits. It records supported edit/write calls without blocking or changing them. A recorded attempt may have failed, been denied, or been cancelled; the replay is not proof that every edit was applied. Use the upstream Replay Theater source and screenshots as behavior references, preserving attribution when adapting source.

      ### What it should look like

      After a turn with recorded edits, show a Replay hint above the prompt, such as "Replay · 5 edit attempts", with an Open replay action when supported. Prefer a side panel titled "Replay Theater" showing:
      - The workspace-relative file name, tool name, and observed outcome.
      - The current step and total, such as "Step 2 of 5".
      - A compact monospace diff: added lines green with +, removed lines red with -, and unchanged lines neutral. Color must not be the only distinction.
      - Counts of added/removed lines when a complete diff is available; label counts as partial if derived only from a truncated payload.
      - A numbered step strip and Prev, Next, and Close actions.

      Show at most 12 diff lines per step and indicate "More lines omitted" when truncated. Keep long lines horizontally scrollable or safely clipped with an accessible full value. Before any recorded edits, show "No edits recorded yet". If edit events exist but diff content is unavailable, show the file/tool/outcome with "Diff unavailable" instead of inventing an empty diff. Failed or denied attempts need explicit labels such as "Denied · proposed change only".

      If a side panel is unsupported, provide a compact above-prompt view or a supported replay command with next/previous navigation. Disable Prev at the first step and Next at the last; opening starts at step one. Close dismisses the view without deleting its replay. Do not apply, revert, or rerun edits from these controls.

      ### Recording and update rules

      Correlate edit attempts and outcomes using documented call/turn IDs, deduplicating repeated delivery. Preserve the documented tool-call order when available and label observed order otherwise. Obtain diffs only from supported before/after data, explicit edit arguments with sufficient context, or a documented diff API. Do not read current files and claim they are a historical before-state. Do not modify files just to build a replay.

      Publish a new replay when a turn ends with recorded edits. A turn without edits keeps the previous replay with its original turn label. Late outcome updates may update the matching replay step only while that replay is still retained. A new replay must not mix steps from earlier turns. If an open replay is replaced, show a clear "New replay available" notice and let me open it rather than changing the step I am reading.

      Retain at most 100 edit steps and 256 KiB of sanitized diff text in one replay; state how many steps or lines were omitted. A MultiEdit call can contain multiple ordered file-edit steps, each linked to its parent call ID. Handle empty content, write/new-file changes, and failed calls without presenting guessed success. Clear pending data at chat/session changes and release subscriptions on disablement.

      ### State and access

      Keep one completed replay and any current-turn pending edits in session memory only. Do not persist replay logs, read unrelated files, retain secret-bearing file contents, or upload diffs. Skip known credential files and redact sensitive payloads before storage. If required edit events or historical diff data are unavailable, explain which parts cannot be implemented accurately.

      ### Validation examples

      Verify empty state, a new-file write, multiple edits to one file, MultiEdit ordering, duplicate events, failed/denied/cancelled attempts, missing diff data, 12-line truncation, replay limits, boundary navigation, a turn without edits, a new replay while reading an older step, late outcomes, and chat/session reset.

      ### Interaction and accessibility

      Match the harness’s native theme, typography, and spacing. Keep the display compact in a narrow terminal or panel; preserve full accessible labels when text is shortened. Pair colors and icons with words. Give interactive controls keyboard access, visible focus, and clear labels. Report errors without moving focus or silently replacing valid state. Release subscriptions and timers when disabled, and do not overwrite another mod’s UI if the harness provides a supported composition mechanism.

      ### Compatibility and completion

      Use only supported APIs and installation conventions. Prefer the display locations described above when supported; otherwise explain the limitation and use a supported alternative. Do not invent APIs, events, or usage measurements. Show unavailable readings explicitly. If the harness has no suitable extension mechanism, explain what cannot be implemented instead of claiming the mod is installed.

      Preserve existing permissions and unrelated settings. Update an existing mod in its current folder when present. Preserve license notices when adapting reference source. Treat provided source as a reference: verify the requested behavior rather than assuming the reference already implements every requirement. Validate the result using the harness’s supported tools and explain how to enable it, including any unavailable features and any validation that could not be performed.

      Create new source in .mint-mods/replay-theater/ or update the mod’s existing folder. Inspect Mint’s current mod tools to validate the generated source and report the supported enablement steps. Do not change the original catalog reference package as part of installation.
  claude-code:
    prompt: body
    source: replay-theater.mjs
    screenshots:
      - file: replay-theater-hint.png
        alt: "Replay hint after a turn with five file-edit calls"
      - file: replay-theater-pane.png
        alt: "Replay Theater pane showing step one of five"
      - file: replay-theater-write.png
        alt: "New-file Write step with its diff capped at twelve lines"
      - file: replay-theater-80-columns.png
        alt: "Replay Theater inline in an eighty-column terminal"
    installCommand: |
      git clone https://github.com/anthropics/claude-code-playground.git
      cd claude-code-playground/claude-code/mods
      claude plugin validate ./replay-theater
      claude plugin marketplace add ./
      claude plugin install replay-theater@claude-code-playground-mods --scope user
    installNotes: >-
      Run the clone step only if the repository is not already cloned. Keep the clone in place: the local marketplace loads files from it.
      Installs for your user across projects. In an open session, run /reload-plugins after installation.
      This upstream sample is shared as-is; no support or maintenance is implied.
      Requires a terminal. Replay is kept in session memory and resets on restart or plugin reload. Diffs are capped, and failed or denied edit calls may still appear. Other mods may compete for the AbovePrompt band.
updated: "2026-10-14"
overview: {"purpose": "Review recorded file-edit attempts from the latest turn with edits, one compact diff at a time.", "placement": "Replay hint above the prompt and a navigable side panel; compact or text fallback.", "actions": ["Open replay", "Choose a step", "Prev / Next", "Close without applying or reverting edits"]}
changelog: [{"date": "2026-10-14", "scope": "catalog", "summary": "Added a concise overview, readiness and verification details, shared prompt-copy counts, and dated change history."}, {"date": "2026-10-14", "scope": "prompt", "summary": "Expanded creation and adaptation prompts with layout, data states, update rules, state isolation, limitations, and validation examples."}]
---

## Description

Review the file edits from the last turn, one diff at a time. Open a replay with /replay and navigate recorded Edit, Write and MultiEdit calls.

## Features

- Record file-edit tool calls without blocking or changing them
- Navigate per-edit diffs with Prev, Next and Close
- Open the replay with /replay or its prompt-band button
- Session-only history; failed or denied calls may appear in the replay

## Adaptation prompt

Make me a mod called replay-theater for the AI coding agent environment I’m currently using: a session-only replay of file-edit tool calls from the last turn, one compact diff at a time.

First identify the current agent harness (the app or CLI running this session). Inspect its documentation, extension APIs, and existing mods or plugins before implementing anything. If the target environment cannot be identified from the workspace or session, ask me which app or CLI this is for.

### What it is and what it can do

This is a read-only replay of observed file-edit attempts from the last turn with edits. It records supported edit/write calls without blocking or changing them. A recorded attempt may have failed, been denied, or been cancelled; the replay is not proof that every edit was applied. Use the upstream Replay Theater source and screenshots as behavior references, preserving attribution when adapting source.

### What it should look like

After a turn with recorded edits, show a Replay hint above the prompt, such as "Replay · 5 edit attempts", with an Open replay action when supported. Prefer a side panel titled "Replay Theater" showing:
- The workspace-relative file name, tool name, and observed outcome.
- The current step and total, such as "Step 2 of 5".
- A compact monospace diff: added lines green with +, removed lines red with -, and unchanged lines neutral. Color must not be the only distinction.
- Counts of added/removed lines when a complete diff is available; label counts as partial if derived only from a truncated payload.
- A numbered step strip and Prev, Next, and Close actions.

Show at most 12 diff lines per step and indicate "More lines omitted" when truncated. Keep long lines horizontally scrollable or safely clipped with an accessible full value. Before any recorded edits, show "No edits recorded yet". If edit events exist but diff content is unavailable, show the file/tool/outcome with "Diff unavailable" instead of inventing an empty diff. Failed or denied attempts need explicit labels such as "Denied · proposed change only".

If a side panel is unsupported, provide a compact above-prompt view or a supported replay command with next/previous navigation. Disable Prev at the first step and Next at the last; opening starts at step one. Close dismisses the view without deleting its replay. Do not apply, revert, or rerun edits from these controls.

### Recording and update rules

Correlate edit attempts and outcomes using documented call/turn IDs, deduplicating repeated delivery. Preserve the documented tool-call order when available and label observed order otherwise. Obtain diffs only from supported before/after data, explicit edit arguments with sufficient context, or a documented diff API. Do not read current files and claim they are a historical before-state. Do not modify files just to build a replay.

Publish a new replay when a turn ends with recorded edits. A turn without edits keeps the previous replay with its original turn label. Late outcome updates may update the matching replay step only while that replay is still retained. A new replay must not mix steps from earlier turns. If an open replay is replaced, show a clear "New replay available" notice and let me open it rather than changing the step I am reading.

Retain at most 100 edit steps and 256 KiB of sanitized diff text in one replay; state how many steps or lines were omitted. A MultiEdit call can contain multiple ordered file-edit steps, each linked to its parent call ID. Handle empty content, write/new-file changes, and failed calls without presenting guessed success. Clear pending data at chat/session changes and release subscriptions on disablement.

### State and access

Keep one completed replay and any current-turn pending edits in session memory only. Do not persist replay logs, read unrelated files, retain secret-bearing file contents, or upload diffs. Skip known credential files and redact sensitive payloads before storage. If required edit events or historical diff data are unavailable, explain which parts cannot be implemented accurately.

### Validation examples

Verify empty state, a new-file write, multiple edits to one file, MultiEdit ordering, duplicate events, failed/denied/cancelled attempts, missing diff data, 12-line truncation, replay limits, boundary navigation, a turn without edits, a new replay while reading an older step, late outcomes, and chat/session reset.

### Interaction and accessibility

Match the harness’s native theme, typography, and spacing. Keep the display compact in a narrow terminal or panel; preserve full accessible labels when text is shortened. Pair colors and icons with words. Give interactive controls keyboard access, visible focus, and clear labels. Report errors without moving focus or silently replacing valid state. Release subscriptions and timers when disabled, and do not overwrite another mod’s UI if the harness provides a supported composition mechanism.

### Compatibility and completion

Use only supported APIs and installation conventions. Prefer the display locations described above when supported; otherwise explain the limitation and use a supported alternative. Do not invent APIs, events, or usage measurements. Show unavailable readings explicitly. If the harness has no suitable extension mechanism, explain what cannot be implemented instead of claiming the mod is installed.

Preserve existing permissions and unrelated settings. Update an existing mod in its current folder when present. Preserve license notices when adapting reference source. Treat provided source as a reference: verify the requested behavior rather than assuming the reference already implements every requirement. Validate the result using the harness’s supported tools and explain how to enable it, including any unavailable features and any validation that could not be performed.

## Prompt

Install the original Replay Theater mod for Claude Code from anthropics/claude-code-playground. Use the same upstream package as the install commands below, with its source and behavior unchanged. Do not recreate the mod from a description.

Installation steps:

```bash
git clone https://github.com/anthropics/claude-code-playground.git
cd claude-code-playground/claude-code/mods
claude plugin validate ./replay-theater
claude plugin marketplace add ./
claude plugin install replay-theater@claude-code-playground-mods --scope user
```

Before running the steps, check whether the repository and plugin are already installed. Reuse an existing clone of this repository instead of cloning over it. Keep the clone in place because the local marketplace loads its files. Use the user installation scope shown above. Preserve unrelated settings and plugin files.

Validate the original plugin and confirm the installed plugin name. If this Claude Code session is already open, reload plugins with /reload-plugins if supported, or tell me to restart it. If installation is blocked or validation fails, report the error instead of generating a replacement mod.
