---
id: blast-radius
name: Blast Radius
category: Safety
author: Claude Code DevRel
compatibility: Claude Code 2.1.287+ (terminal)
requiredCapabilities: ["Documented hooks that can hold, deny, and resume a tool call safely", "Permission-scoped read-only impact inspection for supported commands", "Supported user decisions, call IDs, cancellation, and timeout handling"]
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
      Make me a Mint mod called blast-radius: a pre-execution impact review for supported risky shell commands, with Proceed and Cancel decisions tied to the held call.

      Inspect Mint's current mod SDK, documentation, and existing mods before implementing anything. Use only documented, supported events, state, commands, and UI controls. Explain unavailable capabilities instead of inventing an API.

      ### What it is and what it can do

      This is an example command-impact reviewer, not a complete shell parser or sandbox. For supported risky shell calls—recursive deletion, git reset --hard, git clean, force pushes, and known migration commands—it holds the call, shows available impact evidence, and requires a decision. Use the upstream Blast Radius source and screenshots as behavior references, preserving attribution when adapting source.

      ### What it should look like

      Prefer a side panel titled "Blast Radius". Show the held command as literal text, its working directory, call ID, classified risk, and a Pending decision status. Below, show affected workspace-relative files, commits, or pending migrations only when read-only inspection establishes them. Include counts, a bounded list of at most 50 items, and "More items omitted" when truncated. Unknown impact appears as "Impact unavailable" with its reason, never "Nothing affected".

      At the bottom, show Proceed and Cancel, focus Cancel by default, and display a 60-second decision timeout if supported. Make destructive-risk text conspicuous without relying on color alone. Above the prompt, show a compact hint such as "Risky command held · review impact". In a narrow terminal, move the report and actions into a supported compact band or text decision flow. If no usable decision UI exists, deny the call rather than waiting invisibly.

      ### Actions and update rules

      Classify the structured shell call before execution. Build an impact report using permitted read-only file/repository metadata or documented nonmutating inspection. Never execute the destructive command, run a migration, contact a remote to force-push, or use an unverified dry-run flag just to measure impact. Do not expand the project’s permissions to complete a report. Distinguish inspected facts from classifier guesses and state what was not inspected.

      Keep only one held decision active. Bind each decision to the exact command, working directory, and call ID. Deny additional risky calls while another decision is pending, or use a documented safe queue with separate decisions; never reuse an approval for another command. Disable Proceed until the report is ready. If impact inspection fails or remains unavailable, deny with the reason; do not represent unknown impact as safe.

      Proceed resumes that exact held call at most once through the documented continuation API and leaves normal harness approval checks in force. A second click is a no-op. If the command or inspectable targets change while held, invalidate the report and require a fresh review instead of resuming with stale evidence. Cancel, timeout, turn interruption, chat switch, or disablement denies the held call and shows the corresponding reason. Do not automatically rerun a denied call.

      Show Pending, Proceeded, Cancelled, Timed out, or Denied states as appropriate, then clear active decision controls. Proceeded means the call was released, not that execution succeeded; show actual execution status separately only when observed. If safe holding/resuming is unavailable but blocking exists, deny with a clear explanation. If blocking itself is unavailable, report that the guard cannot be implemented safely.

      ### State and access

      Keep report and decision state in memory for the active session only. Use permitted, bounded inspection of relevant targets; do not scan unrelated directories or retain sensitive command payloads. Keep existing permission checks. Release subscriptions and deny pending calls before cleanup; if the API cannot guarantee this lifecycle, do not implement the holding flow.

      ### Validation examples

      Use mocked calls or disposable fixtures only. Verify each supported command class, unavailable impact, truncated reports, changed targets, double Proceed, cancellation, timeout, interruption, two simultaneous calls, pending-call cleanup, missing continuation APIs, and preserved harness approval checks. Never test destructive-command handling on real user work.

      ### Interaction and accessibility

      Match the harness’s native theme, typography, and spacing. Keep the display compact in a narrow terminal or panel; preserve full accessible labels when text is shortened. Pair colors and icons with words. Give interactive controls keyboard access, visible focus, and clear labels. Report errors without moving focus or silently replacing valid state. Release subscriptions and timers when disabled, and do not overwrite another mod’s UI if the harness provides a supported composition mechanism.

      ### Compatibility and completion

      Use only supported APIs and installation conventions. Prefer the display locations described above when supported; otherwise explain the limitation and use a supported alternative. Do not invent APIs, events, or usage measurements. Show unavailable readings explicitly. If the harness has no suitable extension mechanism, explain what cannot be implemented instead of claiming the mod is installed.

      Preserve existing permissions and unrelated settings. Update an existing mod in its current folder when present. Preserve license notices when adapting reference source. Treat provided source as a reference: verify the requested behavior rather than assuming the reference already implements every requirement. Validate the result using the harness’s supported tools and explain how to enable it, including any unavailable features and any validation that could not be performed.

      Create new source in .mint-mods/blast-radius/ or update the mod’s existing folder. Inspect Mint’s current mod tools to validate the generated source and report the supported enablement steps. Do not change the original catalog reference package as part of installation.
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
updated: "2026-10-14"
overview: {"purpose": "Inspect available impact evidence before deciding whether a held risky shell call should continue.", "placement": "Impact report in a side panel; compact band or supported text decision fallback.", "actions": ["Proceed with the exact held call", "Cancel; also denies on timeout or interruption"]}
changelog: [{"date": "2026-10-14", "scope": "catalog", "summary": "Added a concise overview, readiness and verification details, shared prompt-copy counts, and dated change history."}, {"date": "2026-10-14", "scope": "prompt", "summary": "Expanded creation and adaptation prompts with layout, data states, update rules, state isolation, limitations, and validation examples."}]
---

## Description

Hold a risky shell command and inspect its impact before choosing Proceed or Cancel. Includes a side pane and a compact terminal fallback.

## Features

- Inspect supported deletion, reset, cleanup, force-push and migration commands
- Choose Proceed or Cancel before the held Bash tool call continues
- Use a side pane or a band above the prompt in narrow terminals
- Example command classifier; not a sandbox or complete shell parser

## Adaptation prompt

Make me a mod called blast-radius for the AI coding agent environment I’m currently using: a pre-execution impact review for supported risky shell commands, with Proceed and Cancel decisions tied to the held call.

First identify the current agent harness (the app or CLI running this session). Inspect its documentation, extension APIs, and existing mods or plugins before implementing anything. If the target environment cannot be identified from the workspace or session, ask me which app or CLI this is for.

### What it is and what it can do

This is an example command-impact reviewer, not a complete shell parser or sandbox. For supported risky shell calls—recursive deletion, git reset --hard, git clean, force pushes, and known migration commands—it holds the call, shows available impact evidence, and requires a decision. Use the upstream Blast Radius source and screenshots as behavior references, preserving attribution when adapting source.

### What it should look like

Prefer a side panel titled "Blast Radius". Show the held command as literal text, its working directory, call ID, classified risk, and a Pending decision status. Below, show affected workspace-relative files, commits, or pending migrations only when read-only inspection establishes them. Include counts, a bounded list of at most 50 items, and "More items omitted" when truncated. Unknown impact appears as "Impact unavailable" with its reason, never "Nothing affected".

At the bottom, show Proceed and Cancel, focus Cancel by default, and display a 60-second decision timeout if supported. Make destructive-risk text conspicuous without relying on color alone. Above the prompt, show a compact hint such as "Risky command held · review impact". In a narrow terminal, move the report and actions into a supported compact band or text decision flow. If no usable decision UI exists, deny the call rather than waiting invisibly.

### Actions and update rules

Classify the structured shell call before execution. Build an impact report using permitted read-only file/repository metadata or documented nonmutating inspection. Never execute the destructive command, run a migration, contact a remote to force-push, or use an unverified dry-run flag just to measure impact. Do not expand the project’s permissions to complete a report. Distinguish inspected facts from classifier guesses and state what was not inspected.

Keep only one held decision active. Bind each decision to the exact command, working directory, and call ID. Deny additional risky calls while another decision is pending, or use a documented safe queue with separate decisions; never reuse an approval for another command. Disable Proceed until the report is ready. If impact inspection fails or remains unavailable, deny with the reason; do not represent unknown impact as safe.

Proceed resumes that exact held call at most once through the documented continuation API and leaves normal harness approval checks in force. A second click is a no-op. If the command or inspectable targets change while held, invalidate the report and require a fresh review instead of resuming with stale evidence. Cancel, timeout, turn interruption, chat switch, or disablement denies the held call and shows the corresponding reason. Do not automatically rerun a denied call.

Show Pending, Proceeded, Cancelled, Timed out, or Denied states as appropriate, then clear active decision controls. Proceeded means the call was released, not that execution succeeded; show actual execution status separately only when observed. If safe holding/resuming is unavailable but blocking exists, deny with a clear explanation. If blocking itself is unavailable, report that the guard cannot be implemented safely.

### State and access

Keep report and decision state in memory for the active session only. Use permitted, bounded inspection of relevant targets; do not scan unrelated directories or retain sensitive command payloads. Keep existing permission checks. Release subscriptions and deny pending calls before cleanup; if the API cannot guarantee this lifecycle, do not implement the holding flow.

### Validation examples

Use mocked calls or disposable fixtures only. Verify each supported command class, unavailable impact, truncated reports, changed targets, double Proceed, cancellation, timeout, interruption, two simultaneous calls, pending-call cleanup, missing continuation APIs, and preserved harness approval checks. Never test destructive-command handling on real user work.

### Interaction and accessibility

Match the harness’s native theme, typography, and spacing. Keep the display compact in a narrow terminal or panel; preserve full accessible labels when text is shortened. Pair colors and icons with words. Give interactive controls keyboard access, visible focus, and clear labels. Report errors without moving focus or silently replacing valid state. Release subscriptions and timers when disabled, and do not overwrite another mod’s UI if the harness provides a supported composition mechanism.

### Compatibility and completion

Use only supported APIs and installation conventions. Prefer the display locations described above when supported; otherwise explain the limitation and use a supported alternative. Do not invent APIs, events, or usage measurements. Show unavailable readings explicitly. If the harness has no suitable extension mechanism, explain what cannot be implemented instead of claiming the mod is installed.

Preserve existing permissions and unrelated settings. Update an existing mod in its current folder when present. Preserve license notices when adapting reference source. Treat provided source as a reference: verify the requested behavior rather than assuming the reference already implements every requirement. Validate the result using the harness’s supported tools and explain how to enable it, including any unavailable features and any validation that could not be performed.

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
