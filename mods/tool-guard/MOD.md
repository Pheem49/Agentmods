---
id: "tool-guard"
name: "Tool Guard"
category: "Safety"
author: "Pheem49"
compatibility: "Mint Mods v1"
requiredCapabilities: ["A synchronous or documented blocking pre-tool-use hook", "Structured shell-command text and call IDs", "A supported deny result, mod logging, and compact status output"]
icon: "shield"
tags: ["shell", "safety", "guard"]
featured: false
order: 4
permissions: []
version: "1.0.0"
license: "MIT"
repository: "https://github.com/Pheem49/Mint"
source: "main.ts"
updated: "2026-10-14"
overview: {"purpose": "Block recognized recursive rm shell calls using a supported pre-execution hook.", "placement": "Compact active badge plus the harness’s denial message for blocked calls.", "actions": ["Use normal mod controls to enable or disable", "No per-call bypass"]}
changelog: [{"date": "2026-10-14", "scope": "catalog", "summary": "Added a concise overview, readiness and verification details, shared prompt-copy counts, and dated change history."}, {"date": "2026-10-14", "scope": "prompt", "summary": "Expanded creation and adaptation prompts with layout, data states, update rules, state isolation, limitations, and validation examples."}]
---

## Description

Put a pause before recursive deletion. A small example guard for shell commands that need a second look.

## Features

- A pre-tool-use check for recursive rm
- A clear reason when a call is blocked
- An active guard badge

## Adaptation prompt

Make me a mod called tool-guard for the AI coding agent environment I’m currently using: a small example guard that blocks supported recursive-deletion shell calls before they run.

First identify the current agent harness (the app or CLI running this session). Inspect its documentation, extension APIs, and existing mods or plugins before implementing anything. If the target environment cannot be identified from the workspace or session, ask me which app or CLI this is for.

### What it is and what it can do

This is a limited example classifier for recursive rm shell calls. It intercepts supported shell tool calls before execution and denies recognized recursive deletion. It is not a sandbox or complete shell parser and must not promise protection against every command syntax.

### What it should look like

Show a compact badge above the prompt: "Tool Guard active · recursive deletion blocked" only after the blocking hook has registered successfully. For a denied call, show "Blocked recursive deletion" with a short reason and call ID through the harness’s supported denial UI. Log the blocked call ID, omitting raw command payloads and sensitive arguments.

There is no Proceed or one-call bypass button. Use the harness’s normal mod controls to disable the guard. If blocking is unsupported, show "Tool Guard unavailable · no blocking hook" and explain that the badge alone cannot protect calls. If the status band is unavailable, use a supported panel or text status while preserving the actual blocking behavior.

### Classification and update rules

Check every supported shell tool call while enabled. Use the documented structured action type and command field, not incidental words in arbitrary tool outputs. Recognize direct rm invocations with recursive short flags such as -r, -rf, and -fr, or --recursive, including supported ordinary whitespace, option ordering, and the option terminator. Distinguish quoted text or echo arguments from an actual rm invocation when the supported parser permits it.

State the exact syntax scope implemented. Do not claim to handle aliases, variable expansion, command substitution, arbitrary pipelines, wrappers, or nested shells unless they are parsed and tested. Never run a command to classify it. If command text or syntax cannot be inspected safely for a supported shell call, use the supported deny mechanism with "Tool Guard could not inspect this call" rather than displaying a false active guarantee. Other tool types remain unaffected.

Return the documented blocking result for each recognized recursive deletion, with a reason that identifies this mod. Preserve all existing harness permission checks; disabling the mod does not authorize any command. Duplicate hook delivery must not execute a blocked call or create repeated log entries for the same ID. Nonrecursive calls pass through the mod without bypassing normal approval.

Keep the status synchronized with hook registration, errors, and enable/disable state. Remove the hook when disabled. If the hook cannot be installed or fails, report the failure explicitly. Do not simulate blocking with a visual warning after execution.

### State and access

Keep only a bounded set of recent blocked call IDs for deduplication in session memory. Use supported mod logging without writing a new log file. Do not retain full command input, read workspace files, run shell commands, or change approval policies. No persistent history is required.

### Validation examples

Use mocked tool calls or disposable fixtures; never test deletion against real user data. Verify recursive short and long flags, option ordering, nonrecursive rm, quoted/echo text, missing command data, unsupported syntax, non-shell calls, duplicate IDs, a failed hook registration, existing approval flow, and disablement.

### Interaction and accessibility

Match the harness’s native theme, typography, and spacing. Keep the display compact in a narrow terminal or panel; preserve full accessible labels when text is shortened. Pair colors and icons with words. Give interactive controls keyboard access, visible focus, and clear labels. Report errors without moving focus or silently replacing valid state. Release subscriptions and timers when disabled, and do not overwrite another mod’s UI if the harness provides a supported composition mechanism.

### Compatibility and completion

Use only supported APIs and installation conventions. Prefer the display locations described above when supported; otherwise explain the limitation and use a supported alternative. Do not invent APIs, events, or usage measurements. Show unavailable readings explicitly. If the harness has no suitable extension mechanism, explain what cannot be implemented instead of claiming the mod is installed.

Preserve existing permissions and unrelated settings. Update an existing mod in its current folder when present. Preserve license notices when adapting reference source. Treat provided source as a reference: verify the requested behavior rather than assuming the reference already implements every requirement. Validate the result using the harness’s supported tools and explain how to enable it, including any unavailable features and any validation that could not be performed.

## Prompt

Make me a Mint mod called tool-guard: a small example guard that blocks supported recursive-deletion shell calls before they run.

Inspect Mint's current mod SDK, documentation, and existing mods before implementing anything. Use only documented, supported events, state, commands, and UI controls. Explain unavailable capabilities instead of inventing an API.

### What it is and what it can do

This is a limited example classifier for recursive rm shell calls. It intercepts supported shell tool calls before execution and denies recognized recursive deletion. It is not a sandbox or complete shell parser and must not promise protection against every command syntax.

### What it should look like

Show a compact badge above the prompt: "Tool Guard active · recursive deletion blocked" only after the blocking hook has registered successfully. For a denied call, show "Blocked recursive deletion" with a short reason and call ID through the harness’s supported denial UI. Log the blocked call ID, omitting raw command payloads and sensitive arguments.

There is no Proceed or one-call bypass button. Use the harness’s normal mod controls to disable the guard. If blocking is unsupported, show "Tool Guard unavailable · no blocking hook" and explain that the badge alone cannot protect calls. If the status band is unavailable, use a supported panel or text status while preserving the actual blocking behavior.

### Classification and update rules

Check every supported shell tool call while enabled. Use the documented structured action type and command field, not incidental words in arbitrary tool outputs. Recognize direct rm invocations with recursive short flags such as -r, -rf, and -fr, or --recursive, including supported ordinary whitespace, option ordering, and the option terminator. Distinguish quoted text or echo arguments from an actual rm invocation when the supported parser permits it.

State the exact syntax scope implemented. Do not claim to handle aliases, variable expansion, command substitution, arbitrary pipelines, wrappers, or nested shells unless they are parsed and tested. Never run a command to classify it. If command text or syntax cannot be inspected safely for a supported shell call, use the supported deny mechanism with "Tool Guard could not inspect this call" rather than displaying a false active guarantee. Other tool types remain unaffected.

Return the documented blocking result for each recognized recursive deletion, with a reason that identifies this mod. Preserve all existing harness permission checks; disabling the mod does not authorize any command. Duplicate hook delivery must not execute a blocked call or create repeated log entries for the same ID. Nonrecursive calls pass through the mod without bypassing normal approval.

Keep the status synchronized with hook registration, errors, and enable/disable state. Remove the hook when disabled. If the hook cannot be installed or fails, report the failure explicitly. Do not simulate blocking with a visual warning after execution.

### State and access

Keep only a bounded set of recent blocked call IDs for deduplication in session memory. Use supported mod logging without writing a new log file. Do not retain full command input, read workspace files, run shell commands, or change approval policies. No persistent history is required.

### Validation examples

Use mocked tool calls or disposable fixtures; never test deletion against real user data. Verify recursive short and long flags, option ordering, nonrecursive rm, quoted/echo text, missing command data, unsupported syntax, non-shell calls, duplicate IDs, a failed hook registration, existing approval flow, and disablement.

### Interaction and accessibility

Match the harness’s native theme, typography, and spacing. Keep the display compact in a narrow terminal or panel; preserve full accessible labels when text is shortened. Pair colors and icons with words. Give interactive controls keyboard access, visible focus, and clear labels. Report errors without moving focus or silently replacing valid state. Release subscriptions and timers when disabled, and do not overwrite another mod’s UI if the harness provides a supported composition mechanism.

### Compatibility and completion

Use only supported APIs and installation conventions. Prefer the display locations described above when supported; otherwise explain the limitation and use a supported alternative. Do not invent APIs, events, or usage measurements. Show unavailable readings explicitly. If the harness has no suitable extension mechanism, explain what cannot be implemented instead of claiming the mod is installed.

Preserve existing permissions and unrelated settings. Update an existing mod in its current folder when present. Preserve license notices when adapting reference source. Treat provided source as a reference: verify the requested behavior rather than assuming the reference already implements every requirement. Validate the result using the harness’s supported tools and explain how to enable it, including any unavailable features and any validation that could not be performed.

Create new source in .mint-mods/tool-guard/ or update the mod’s existing folder. Inspect Mint’s current mod tools to validate the generated source and report the supported enablement steps. Do not change the original catalog reference package as part of installation.
