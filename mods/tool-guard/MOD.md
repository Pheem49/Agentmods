---
id: "tool-guard"
name: "Tool Guard"
category: "Safety"
author: "Pheem49"
compatibility: "Mint Mods v1"
icon: "shield"
tags: ["shell", "safety", "guard"]
featured: false
order: 4
permissions: []
version: "1.0.0"
license: "MIT"
repository: "https://github.com/Pheem49/Mint"
source: "main.ts"
---

## Description

Put a pause before recursive deletion. A small example guard for shell commands that need a second look.

## Features

- A pre-tool-use check for recursive rm
- A clear reason when a call is blocked
- An active guard badge

## Prompt

Make me a Mint mod called tool-guard: a small guard that blocks recursive deletion in shell tool calls.

What it should do:
- Check shell commands before they run for recursive rm flags, such as rm -r, rm -rf and rm --recursive.
- Block matching calls with a clear reason saying recursive deletion is blocked while Tool Guard is enabled.
- Show an active guard badge above the prompt.
- Log the ID of each blocked call.

Check every shell tool call while the mod is enabled. Keep Mint's existing permission checks in place. Describe this as a simple example guard, not complete protection against every shell command.
