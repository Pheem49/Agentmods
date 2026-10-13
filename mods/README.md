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
compatibility: Mint Mods v1
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
Create a Mint Mods v1 mod called my-mod in my current workspace.
First inspect the current SDK with mod_help and existing mods with mod_list.
Validate and publish it with Mint's mod tools, preserving existing state.
Describe the behavior you want here. Ask for any required permissions.
```

Required metadata: `id`, `name`, `category`, `author`, `compatibility`.
The ID must match its folder and use lowercase letters, numbers and hyphens.
Categories: `Context`, `Workflow`, `Safety`, `Utilities`.
Description and Prompt sections are required; Features is an optional bullet list.

Optional metadata:

- `tags`: a YAML list of searchable keywords.
- `icon`: `weather`, `checklist`, `meter`, `shield`, `journal`, `compass`, `review`, or `counter`; other names use a terminal icon.
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

Use an `agents` mapping to explicitly declare supported agents. Its keys are `mint` and `claude-code`; including both displays “Mint + Claude Code”. Files without this mapping remain Mint-only.

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
