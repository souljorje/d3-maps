# Adapter Development Flow

Shared workflow for Vue, React, and future adapters (Solid, Svelte)

## Adapter AGENTS De-Dup
- Keep cross-adapter rules in this file and in [.agents/references/architecture.md](.agents/references/architecture.md)
- Keep `packages/<adapter>/AGENTS.md` framework-specific (paths, entrypoints, commands, framework-only guardrails)
- Do not copy identical guardrails between adapters; link to this file instead

## Scope & Parity
- Identify the adapter surface involved (components, hooks, docs)
- If the change is cross-adapter, ensure parity across existing adapters (Vue + React) and document intentional deltas

## Core Contract First
- Start from the core contract in `packages/core/src/lib` (`map.ts`, `feature.ts`, `marker.ts`, `mapObject.ts`, `zoom.ts`)
- If adapters need new behavior/types, add them to core first so adapters stay thin wrappers

## Adapter Boundary
- Reuse `@d3-maps/core` helpers only
- Do not import `d3-*` directly in adapters (canonical rule lives in [.agents/references/architecture.md](.agents/references/architecture.md))

## Public API Wiring
- Route public API through `packages/<adapter>/src/index.ts`
- Keep exports named-only and keep the surface consistent across adapters where it makes sense

## Implementation Patterns
- React: stable callback refs for event props, primitive effect deps, explicit conditionals, and `'use client'` boundaries for hook-using entrypoints
- Vue: `<script setup lang="ts">`, Composition API, keep props/emits aligned with core contracts
- Solid (future): signals + `onMount` + context/provider patterns
- Svelte (future): stores + `onMount` + `setContext/getContext`

## Tests
- Add/adjust adapter tests for behavior parity and edge cases
- Include SSR smoke tests where components/hooks are expected to be SSR-safe

## Docs
- If docs contain framework code, include Vue and React equivalents using VitePress tabs
- Update component docs + examples and regenerate wrappers when example sources change (`pnpm docs:gen:examples`)
- Follow the canonical pipeline in [.agents/references/docs-generation.md](.agents/references/docs-generation.md)

## Release Hygiene
- For publishable package changes, add a changeset and follow the [.agents/skills/changesets/SKILL.md](.agents/skills/changesets/SKILL.md) workflow

## Validation Commands
- `pnpm --filter @d3-maps/<adapter> typecheck`
- `pnpm --filter @d3-maps/<adapter> test`
- `pnpm --filter @d3-maps/docs build`
- `pnpm lint`
- `pnpm test --output-logs=errors-only`
