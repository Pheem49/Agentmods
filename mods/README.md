# Mod catalog

Each folder is one entry on Agentmods. Keep these files in Git so prompts, descriptions, source, and previews can be reviewed and shared together.

```text
mods/
  token-weather/
    MOD.md
    main.ts       # optional reference source
    preview.png   # optional real screenshot
```

## Create an entry

Create `mods/my-mod/MOD.md`:

```markdown
---
id: my-mod
name: My Mod
category: Utilities
author: Your name
compatibility: Adaptation recipe — depends on harness capabilities
agents: {}
adaptationPrompt: body
requiredCapabilities: [Per-chat state, Supported text output]
icon: counter
tags: [utility, starter]
featured: false
---

## Description
A short explanation of what this mod helps you do.

## Features
- Describe the first capability
- Describe the second capability

## Prompt
Make me a mod called my-mod for the AI coding agent environment I’m currently using.
Identify the current harness and inspect its documented extension APIs first.
Describe what the mod is, what it can do, its layout, fields, actions, empty states,
update rules, state scope, access requirements, and unsupported-feature behavior.
Use supported APIs, validate the result, and explain how to enable it.
```

Required metadata: `id`, `name`, `category`, `author`, `compatibility`.
The ID must match its folder and use lowercase letters, numbers and hyphens.
Categories: `Context`, `Workflow`, `Safety`, `Utilities`.
Description and Prompt sections are required; Features is an optional bullet list.

Optional metadata:

- `tags`: a YAML list of searchable keywords.
- `icon`: `weather`, `checklist`, `meter`, `shield`, `journal`, `compass`, `review`, `counter`, `handoff`, `timeline`, `checks`, or `workspace`; other names use a terminal icon.
- `featured`: boolean; default false.
- `order`: a number for the initial catalog order; unspecified entries sort by ID.
- `source`: a filename such as `main.ts` or `main.js`. Including it makes the entry “Source + prompt.”
- `preview`: a filename such as `preview.png`. Without an image, the frontend shows its illustrative preview.
- `version`, `license`, `repository`: optional strings; repository URLs must use HTTPS.
- `permissions`: a YAML list describing the included source's privileged capabilities.

Source and preview must exist inside the same folder. Supported lowercase image extensions: `.png`, `.jpg`, `.jpeg`, `.webp`, `.gif`, `.svg`.
Include attribution and the required license notice when sharing someone else's source.

## Prompt boundaries

Put `## Prompt` last. Everything after that heading is the copyable prompt, including Markdown headings and code blocks. Frontmatter, Description, and Features are never copied by the Copy prompt button.

## Verify

```bash
npm run validate:mods
npm test
npm run build
```

Vite reads `mods/*/MOD.md` and declared assets at build time. In development, content changes update the frontend through Vite. There is no server database or runtime installation implied by this catalog.

## Per-agent prompts and installation

Use an `agents` mapping to explicitly declare supported agents. Its keys are `mint` and `claude-code`; including both lists “Mint + Claude Code” under specific implementations. Use `agents: {}` with a neutral adaptation prompt for recipes without a listed implementation. Legacy files without this mapping remain Mint-only.

```yaml
agents:
  mint:
    prompt: body
    source: main.ts
  claude-code:
    compatibility: Claude Code (terminal)
    prompt: |
      Create or adapt this mod for Claude Code.
      Inspect the current Claude Code mod APIs before writing code.
```

`prompt: body` explicitly uses the final `## Prompt` section. Otherwise, `prompt` is a non-empty string (use YAML `|` for multiple lines). A config never inherits another agent's prompt or source. The root Description and Prompt sections remain required for every entry.

Optional fields per agent:

- `compatibility`: overrides the root compatibility string.
- `source`: a local `.ts`, `.js`, or `.mjs` filename; expose only code meant for that agent.
- `installCommand`: the exact shell command or multiline steps for a real installable package. Omit it when there is no package; the install button stays hidden.
- `installNotes`: prerequisites, install scope, and instructions for updating an existing install.
- `author`, `repository`: attribution and HTTPS source URL for that agent's implementation.

Root `source` is catalog reference metadata. In explicit `agents` configs, declare source on the relevant agent too. Compatibility labels describe the selected implementation; never imply that Mint and Claude Code run the same file unless verified.

Token Weather demonstrates separate Mint source and an upstream Claude Code sample package. Its Claude installation follows the [upstream README](https://github.com/anthropics/claude-code-playground/tree/main/claude-code/mods/token-weather). The website copies commands; it never runs them or installs software on a visitor's machine.

### Screenshots

Declare images on the agent whose interface they show:

```yaml
agents:
  claude-code:
    prompt: body
    source: my-mod.mjs
    screenshots:
      - file: my-mod-pane.png
        alt: My Mod pane showing the current task
    license: Apache-2.0
    version: "0.1.0"
```

Each file must exist in the mod folder and use a supported image extension. `alt` is required. Images appear as a gallery and the first image is used as that agent's preview. Switching agents switches screenshots too. Root `preview` remains available for entries with a shared image. Preserve original attribution and distribute the required license when importing source or screenshots.

### Packaged mod prompts

For a ready-to-install package, Copy prompt asks the selected agent to install the original package using the exact `installCommand` steps, preserving its source and behavior. It must not ask the agent to rebuild an approximation. Entries without a package retain a creation prompt. Token Weather's Mint creation prompt and Claude Code package installation prompt are intentionally different.


## Neutral adaptation prompts

Add a `## Adaptation prompt` section **before** the final `## Prompt` section. It describes the mod’s behavior for the user’s current AI coding agent without assuming a brand, SDK, folder, or install command. The website selects “Adapt to my agent” by default when this section exists.

Tell the agent to identify the current harness (the app or CLI running the session), inspect its documented extension APIs, use supported display locations and real measurements, report unavailable features, preserve permissions and license notices, validate the result, and explain enablement. If the target cannot be identified, ask the user; if no extension mechanism exists, explain the limitation.

Keep `## Prompt` and the `agents` mapping for specific implementations. Adaptation recipes are separate from compatibility declarations and do not expose another agent’s source or install commands as generic instructions.

For a neutral-only recipe, set `agents: {}` and `adaptationPrompt: body` in frontmatter, and keep the complete generic prompt in the final `## Prompt` section. This avoids duplicating the prompt and does not claim Mint or Claude Code compatibility. The only accepted value for the `adaptationPrompt` metadata field is `body`.

Add `requiredCapabilities` as a YAML list of capabilities the harness must expose; these are shown on the detail page and are separate from permissions granted to actual source.

Complete creation prompts should specify the purpose, capabilities, visual layout and fields, actions, empty/loading/error states, update triggers, state lifetime and isolation, required access, supported alternatives, and validation examples. Use `###` headings inside the prompt to preserve its boundaries. Conceptual previews must be labeled illustrative; do not present them as screenshots of a working implementation.

## Overview, change history, and runtime verification

Add concise catalog facts to frontmatter:

```yaml
updated: "2026-10-14"
overview:
  purpose: What this mod helps the user do.
  placement: Where it appears and the supported fallback.
  actions: [Generate, Copy, Reset]
changelog:
  - date: "2026-10-14"
    scope: prompt
    summary: Describe the actual change made to the recipe.
```

`overview` requires nonempty purpose and placement strings, with actions as a string list. Describe a read-only display explicitly when it has no buttons. A per-agent `overview` can override the shared summary for a different implementation. `updated` and changelog dates must be real ISO calendar dates. Changelog scopes are `prompt`, `source`, or `catalog`; dates cannot exceed `updated`. Record observed changes, not inferred upstream release dates. Keep source versions separate from catalog edits.

Readiness is computed from each config: an install command means Installable package; source without an install command means Reference source; otherwise it is a Creation recipe. Runtime verification defaults to Not verified. To publish a verified claim, add this to the relevant `agents` config only, replacing every placeholder with actual test evidence:

```yaml
verification:
  status: verified
  date: "2026-10-14"
  environment: The actual harness version and interface tested
  evidence: https://your-repository.example/path/to/the-runtime-test-report
  notes: Describe what was tested and the limits of that test.
```

Allowed statuses are `not-verified`, `verified`, and `needs-review`. A verified status requires date, environment, and an HTTPS evidence URL. Evidence must describe the current listed implementation; if relevant source changes invalidate a report, set needs-review until retested. An adaptation recipe does not inherit another harness's verification.

Prompt-copy counts come from the shared API, never frontmatter or seeded popularity figures. Do not use install commands, source-copy clicks, or catalog test results as installation/download counts.
