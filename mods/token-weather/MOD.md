---
id: "token-weather"
name: "Token Weather"
category: "Context"
author: "Pheem49"
compatibility: "Mint Mods v1"
icon: "weather"
tags: ["context", "tokens", "usage"]
featured: true
order: 1
permissions: []
version: "1.0.0"
license: "MIT"
repository: "https://github.com/Pheem49/Mint"
source: "main.ts"
agents:
  mint:
    prompt: body
    source: main.ts
  claude-code:
    source: token-weather.mjs
    version: "0.1.0"
    license: Apache-2.0
    screenshots:
      - file: token-weather-clear.png
        alt: Clear forecast at 18 percent context usage in Claude Code
      - file: token-weather-showers.png
        alt: Showers forecast at 67 percent context usage in Claude Code
      - file: token-weather-storm.png
        alt: Storm forecast at 81 percent context usage in Claude Code
    compatibility: Claude Code 2.1.287+ (terminal)
    author: Claude Code DevRel
    repository: https://github.com/anthropics/claude-code-playground/tree/main/claude-code/mods/token-weather
    prompt: |
      Install the original Token Weather mod for Claude Code from anthropics/claude-code-playground. Use the same upstream package as the install commands below, with its source and behavior unchanged. Do not recreate the mod from a description.

      Installation steps:

      ```bash
      git clone https://github.com/anthropics/claude-code-playground.git
      cd claude-code-playground/claude-code/mods
      claude plugin validate ./token-weather
      claude plugin marketplace add ./
      claude plugin install token-weather@claude-code-playground-mods --scope user
      ```

      Before running the steps, check whether the repository and plugin are already installed. Reuse an existing clone of this repository instead of cloning over it. Keep the clone in place because the local marketplace loads its files. Use the user installation scope shown above. Preserve unrelated settings and plugin files.

      Validate the original plugin and confirm the installed plugin name. If this Claude Code session is already open, reload plugins with /reload-plugins if supported, or tell me to restart it. If installation is blocked or validation fails, report the error instead of generating a replacement mod.
    installCommand: |
      git clone https://github.com/anthropics/claude-code-playground.git
      cd claude-code-playground/claude-code/mods
      claude plugin validate ./token-weather
      claude plugin marketplace add ./
      claude plugin install token-weather@claude-code-playground-mods --scope user
    installNotes: >-
      Run once from a folder where claude-code-playground does not already exist.
      If already cloned, skip the clone step and enter its claude-code/mods folder.
      Keep the clone in place: this marketplace loads files from it. The commands install for your user across projects.
      This is an upstream sample shared as-is. Mint and Claude Code use separate implementations.
      In an open Claude Code session, run /reload-plugins after installation.
---

## Description

A little forecast for your context window. See usage, recent turns, and when it’s time to clear the skies.

## Features

- A context weather band above the composer
- History of the last 12 completed turns
- Unavailable states when provider measurements are missing

## Prompt

Make me a Mint mod called token-weather: a live forecast of my context window, shown in the band above the prompt.

What it should show, on one line:
- A weather icon and word for how full the context window is: under 25% ☀ Clear (yellow), 25–49% ☁ Cloudy (cyan), 50–74% ☂ Showers (blue), 75–89% ☇ Storm (magenta), 90% and up ↯ Compact soon (red).
- The percentage used, then the tokens used out of the window, like "134.4k / 200k".
- A small chart of the last 12 turns, drawn with ▁▂▃▄▅▆▇█.
- How much the last turn added, like "▲ +98.3k last turn".

It should update after every turn.
