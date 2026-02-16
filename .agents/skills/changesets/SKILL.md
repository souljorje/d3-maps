---
name: changesets
description: Create or update a Changesets entry. Always preview and get explicit confirmation before writing `.changeset/*.md`.
---

## When to use

- Add one for user-facing changes to any package under `packages/*`, except `packages/docs` (the docs package is excluded from versioning/publishing)

## Bump Rules

- `patch`: fixes, internal refactors, perf, test-only changes.
- `minor`: new backward-compatible API/behavior.
- `major`: breaking API/behavior or requirement changes.

## Process (Always)

1. Review the branch diff (what changed and which package(s) it affects).
2. Check whether a pending `.changeset/*.md` already exists (ignore `.changeset/README.md` and `.changeset/config.json`).
3. Draft a changeset with a short, user-facing summary (no implementation details).
4. Preview the exact file content and ask for explicit `confirm`.
5. Only after `confirm`, write/update the `.changeset/*.md` file.
6. Optionally validate with `pnpm changeset status`.

## Format

Use double quotes in frontmatter (Changesets convention):

```md
---
'@d3-maps/core': patch
'@d3-maps/vue': minor
---

Short user-facing summary of the change.
```
