---
id: "task-checklist"
name: "Task Checklist"
category: "Workflow"
author: "Pheem49"
compatibility: "Mint Mods v1"
icon: "checklist"
tags: ["tasks", "planning", "checklist"]
featured: false
order: 2
permissions: []
version: "1.0.0"
license: "MIT"
repository: "https://github.com/Pheem49/Mint"
source: "main.ts"
---

## Description

Keep the next steps beside your conversation. Add tasks, follow your plan, and clear the list when you’re done.

## Features

- A task list in the side panel
- An input for adding tasks
- Per-chat state and a clear action

## Prompt

Make me a Mint mod called task-checklist: a simple task list in a side panel beside my conversation.

What it should show:
- The number of tasks and a table of their names.
- A New task input for adding a task.
- A Clear tasks button to empty the list.

Keep the list separately for each chat and restore it when I reopen the mod. Ignore empty input and trim extra spaces. Let me add or clear tasks with commands too.

Update the panel immediately whenever the list changes.
