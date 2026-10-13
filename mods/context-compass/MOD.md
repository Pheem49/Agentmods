---
id: "context-compass"
name: "Context Compass"
category: "Context"
author: "Agentmods"
compatibility: "Mint Mods v1"
icon: "compass"
tags: ["context", "budget", "planning"]
featured: false
order: 6
permissions: []
---

## Description

Keep the size of your context in view. A simple indicator for the current reading and planning window.

## Features

- The latest measured context usage
- A planning-window indicator
- Stale measurements cleared after compaction

## Prompt

Make me a Mint mod called context-compass: a compact view of my context usage in the band above the prompt.

What it should show:
- The latest measured context usage, with tokens used out of the window and the percentage used.
- The planning-window information when the current Mint SDK provides it.
- "Unknown" for readings that are unavailable.

Show the current reading when the mod opens and update it whenever usage changes. Clear stale readings after context compaction and wait for a fresh measurement.

Use real measurements. Do not estimate token counts or change my model settings.
