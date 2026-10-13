---
id: blast-radius
name: Blast Radius
category: Safety
author: Claude Code DevRel
compatibility: Claude Code 2.1.287+ (terminal)
icon: shield
tags: ["claude-code", "playground", "safety", "blast-radius"]
featured: false
order: 9
license: Apache-2.0
version: "0.1.0"
repository: https://github.com/anthropics/claude-code-playground/tree/main/claude-code/mods/blast-radius
source: blast-radius.mjs
agents:
  mint:
    compatibility: Mint Mods v1 — creation prompt (port required)
    author: Agentmods
    prompt: |
      Make me a Mint mod called blast-radius: show me what a risky shell command would affect before it runs.

      What it should do:
      - Hold supported risky shell tool calls, including recursive deletion, git reset --hard, git clean, force pushes and migrations.
      - Show the command and a report of the files, commits or pending migrations it would affect, when that information is available.
      - Give me Proceed and Cancel buttons. Focus Cancel by default.
      - Continue the held call only after I choose Proceed. If I cancel, interrupt the turn or the wait times out, refuse it with a clear reason.

      Show the report in a side panel, with a compact band above the prompt when a side panel is unavailable. Handle one held command at a time and keep each decision tied to its command.

      Use this original mod as the behavior reference:
      https://github.com/anthropics/claude-code-playground/tree/main/claude-code/mods/blast-radius

      Inspect Mint's current mod SDK and existing mods before implementing the port. Use Mint's supported tool hooks and UI controls. Never run a destructive command to measure its impact, and keep Mint's existing permission checks. If Mint cannot safely hold and resume a call, block it with a clear explanation rather than bypassing approval. Report any behavior that cannot be ported.

      Create the mod in .mint-mods/blast-radius/ or update its existing folder, preserve license notices when adapting upstream code, validate it with Mint's mod tools, and report how to enable it. Test destructive-command handling only in a disposable fixture.
  claude-code:
    prompt: body
    source: blast-radius.mjs
    screenshots:
      - file: blast-radius-pane.png
        alt: "A risky deletion held in a pane with Proceed and Cancel buttons"
      - file: blast-radius-cancelled.png
        alt: "Claude reports the deletion was cancelled"
      - file: blast-radius-proceeded.png
        alt: "Claude reports the deletion after the user chose Proceed"
      - file: blast-radius-band.png
        alt: "A git reset report shown above the prompt in a narrow terminal"
    installCommand: |
      git clone https://github.com/anthropics/claude-code-playground.git
      cd claude-code-playground/claude-code/mods
      claude plugin validate ./blast-radius
      claude plugin marketplace add ./
      claude plugin install blast-radius@claude-code-playground-mods --scope user
    installNotes: >-
      Run the clone step only if the repository is not already cloned. Keep the clone in place: the local marketplace loads files from it.
      Installs for your user across projects. In an open session, run /reload-plugins after installation.
      This upstream sample is shared as-is; no support or maintenance is implied.
      Requires bash, git, find and du. Side panes need about 144 terminal columns; narrower terminals share the AbovePrompt band. This sample classifies command text and is not a sandbox or complete permission system.
---

## Description

Hold a risky shell command and inspect its impact before choosing Proceed or Cancel. Includes a side pane and a compact terminal fallback.

## Features

- Inspect supported deletion, reset, cleanup, force-push and migration commands
- Choose Proceed or Cancel before the held Bash tool call continues
- Use a side pane or a band above the prompt in narrow terminals
- Example command classifier; not a sandbox or complete shell parser

## Prompt

Install the original Blast Radius mod for Claude Code from anthropics/claude-code-playground. Use the same upstream package as the install commands below, with its source and behavior unchanged. Do not recreate the mod from a description.

Installation steps:

```bash
git clone https://github.com/anthropics/claude-code-playground.git
cd claude-code-playground/claude-code/mods
claude plugin validate ./blast-radius
claude plugin marketplace add ./
claude plugin install blast-radius@claude-code-playground-mods --scope user
```

Before running the steps, check whether the repository and plugin are already installed. Reuse an existing clone of this repository instead of cloning over it. Keep the clone in place because the local marketplace loads its files. Use the user installation scope shown above. Preserve unrelated settings and plugin files.

Validate the original plugin and confirm the installed plugin name. If this Claude Code session is already open, reload plugins with /reload-plugins if supported, or tell me to restart it. If installation is blocked or validation fails, report the error instead of generating a replacement mod.
