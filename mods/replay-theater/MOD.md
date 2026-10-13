---
id: replay-theater
name: Replay Theater
category: Workflow
author: Claude Code DevRel
compatibility: Claude Code 2.1.287+ (terminal)
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
      Make me a Mint mod called replay-theater: let me review the file edits from the last turn, one diff at a time.

      What it should show:
      - A Replay hint above the prompt after a turn with file edits.
      - A side panel with the file name, tool name, current step and total number of steps.
      - A short diff in red and green, with counts of added and removed lines.
      - A numbered strip of steps and Prev, Next and Close buttons.

      Record supported file-edit and file-write tool calls without blocking or changing them. Open the replay with a replay command or the Replay button. Keep diffs compact, showing up to 12 lines per step and indicating when more lines are omitted.

      Update the replay after each turn with edits. A turn without edits should keep the previous replay. Keep it in memory for the current session only. Recorded calls may have failed or been denied, so do not present the replay as proof that every edit succeeded. Use a compact view above the prompt when a side panel is unavailable.

      Use this original mod as the behavior reference:
      https://github.com/anthropics/claude-code-playground/tree/main/claude-code/mods/replay-theater

      Inspect Mint's current mod SDK and existing mods before implementing the port. Use Mint's supported tool events, commands and UI controls; report unavailable data or behavior instead of inventing it. Do not modify files just to build a replay.

      Create the mod in .mint-mods/replay-theater/ or update its existing folder, preserve license notices when adapting upstream code, validate it with Mint's mod tools, and report how to enable it.
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
---

## Description

Review the file edits from the last turn, one diff at a time. Open a replay with /replay and navigate recorded Edit, Write and MultiEdit calls.

## Features

- Record file-edit tool calls without blocking or changing them
- Navigate per-edit diffs with Prev, Next and Close
- Open the replay with /replay or its prompt-band button
- Session-only history; failed or denied calls may appear in the replay

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
