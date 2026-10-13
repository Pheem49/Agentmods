---
id: "token-meter"
name: "Token Meter"
category: "Context"
author: "Pheem49"
compatibility: "Mint Mods v1"
icon: "meter"
tags: ["tokens", "usage", "minimal"]
featured: false
order: 3
permissions: []
version: "1.0.0"
license: "MIT"
repository: "https://github.com/Pheem49/Mint"
source: "main.ts"
---

## Description

A quiet token counter, right above the prompt. Know what the latest turn used without leaving your chat.

## Features

- Provider-measured tokens for the current turn
- A compact above-composer display
- An explicit unavailable state

## Prompt

Make me a Mint mod called token-meter: a small token counter in the band above the prompt.

What it should show, on one line:
- The measured token usage for the current turn, like "12,480 tokens this turn".
- "Usage unavailable" when there is no measured usage yet.

Reset the display to "Usage unavailable" at the start of each turn. Update it whenever a new usage measurement arrives. Use the provider's measured token count, not an estimate.
