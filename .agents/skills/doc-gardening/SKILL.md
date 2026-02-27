---
name: doc-gardening
description: Documentation hygiene for this repo. Use when fixing broken links, removing drift between docs and repo config, keeping AGENTS.md as a map (TOC), or extending `pnpm agents:check`.
---

## Goal

Keep repo documentation consistent, link-valid, and aligned with reality, with mechanical checks that prevent drift

## Quick Start

1. Run `pnpm agents:check`
2. Fix the reported issues by updating links or docs
3. Re-run `pnpm agents:check` until it passes

## What To Treat As Source Of Truth

- Commands and hooks: `package.json`
- CI behavior: `.github/workflows/*`
- Generated docs ownership: [Docs Generation Workflow](../../references/docs-generation.md)
- Repo rules and boundaries: `.agents/references/*` + `AGENTS.md` (TOC-style)

## Fixing Common Failures

- Broken markdown links:
  - Prefer relative file links for repo files
  - In `packages/docs/**`, VitePress route links like `/guide/core-concepts/` are allowed, but should resolve to a page under `packages/docs`
- Doc drift:
  - If a doc claims a hook or command exists, confirm it is defined in `package.json` or the relevant workflow file
  - Remove stale claims rather than adding new automation unless explicitly requested

## Extending `agents:check`

Update `scripts/agents-check.mjs` to add new drift checks when a problem recurs

Guidelines:
- Keep checks deterministic and fast
- Prefer checks that produce actionable output (file + what to change)
- Scope checks to the repo knowledge base, avoid scanning generated or third-party reference bundles
