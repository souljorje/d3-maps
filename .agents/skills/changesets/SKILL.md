---
name: changesets
description: Create or update Changesets entries. Always preview all proposed `.changeset/*.md` files together and get explicit confirmation before writing any of them.
---

## When to use

Add changesets for user-facing changes to any publishable package (private: false) under `packages/*`

## Bump Rules

- `patch`: fixes, internal refactors, perf changes
- `minor`: new backward-compatible API or behavior
- `major`: breaking API, behavior, or requirement changes

## Split Rule

Use **minimal split**:

- one changeset per affected package set
- package-only notes stay in their own package-only changeset
- notes affecting the same set of multiple packages stay in one shared changeset
- do not create extra files unless the release-note scope is actually different

Scope is defined by release-note impact across packages, not by how many source files changed

## Process (Always)

1. Review the branch diff against `main` to identify changes and which publishable package(s) they affect
2. Check whether pending `.changeset/*.md` files already exist (ignore `.changeset/README.md`)
3. Reuse an existing pending changeset when its package scope already matches the new note group
4. Group release-note items by affected package set
5. Draft one changeset file per scope group with short, user-facing bullet summaries written in past tense and without implementation details
6. Preview **all proposed changeset files together** and ask for one explicit `confirm`
7. Only after `confirm`, write or update all proposed `.changeset/*.md` files in one batch
8. Optionally validate with `pnpm changeset status`

## Format

```md
---
'package-1': minor
'package-2': minor
---

- Short user-facing list of changes
```
