---
id: "session-counter"
name: "Session Counter"
category: "Utilities"
author: "Agentmods"
compatibility: "Mint Mods v1"
icon: "counter"
tags: ["turns", "counter", "starter"]
featured: false
order: 8
permissions: []
---

## Description

A minimal counter for completed turns. A tiny mod that makes a good starting point for your own ideas.

## Features

- A persistent per-chat turn counter
- A reset command
- A simple starter mod

## Prompt

Make me a Mint mod called session-counter: a small counter of completed turns in the band above the prompt.

What it should show, on one line:
- The number of completed turns in this chat, like "8 turns completed".

Increase the count exactly once when a turn ends. Store the count separately for each chat and show its saved value immediately when the mod opens. Add a reset command that sets it back to zero.

Update the display after each completed turn or reset. This mod should not need file access or permission to run tools.
