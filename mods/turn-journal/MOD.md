---
id: "turn-journal"
name: "Turn Journal"
category: "Workflow"
author: "Agentmods"
compatibility: "Mint Mods v1"
icon: "journal"
tags: ["history", "turns", "journal"]
featured: false
order: 5
permissions: []
---

## Description

Leave a short trail of completed turns. Keep a lightweight activity journal in a panel beside the conversation.

## Features

- A journal of the latest 20 turns
- Completion status and measured usage
- A clear action

## Prompt

Make me a Mint mod called turn-journal: a lightweight journal of completed turns in a side panel.

What each entry should show:
- The time the turn ended.
- Its completion status.
- Its measured token usage, or "Usage unavailable" if there is no measurement.

Add one entry when each turn ends and keep only the latest 20 entries. Store the journal separately for each chat. Add a Clear journal action and a command to clear it.

Update the panel after every completed turn or clear action. Keep the journal in mod state without reading or writing workspace files.
