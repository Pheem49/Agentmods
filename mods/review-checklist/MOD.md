---
id: "review-checklist"
name: "Review Checklist"
category: "Safety"
author: "Agentmods"
compatibility: "Mint Mods v1"
icon: "review"
tags: ["review", "checklist", "quality"]
featured: false
order: 7
permissions: []
---

## Description

A small reminder before you ship. Keep your review checklist close to the work, and reset it for the next task.

## Features

- A user-managed review checklist
- Per-chat completion state
- No automatic claims that checks passed

## Prompt

Make me a Mint mod called review-checklist: a checklist in a side panel that I can use before shipping changes.

Start with these items:
- Inspect the diff.
- Check that the changes match the requested scope.
- Run the relevant checks.
- Review sensitive changes.

Let me mark each item complete or incomplete and reset the checklist for the next task. Keep its state separately for each chat.

Update the panel whenever I change an item. This is a manual checklist: do not run tools, claim tests passed, or mark anything complete automatically.
