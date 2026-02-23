# Adapter Development Flow

Shared workflow for Vue, React, and future adapters (Solid, Svelte)

## Adapter AGENTS De-Dup
- Keep cross-adapter rules in this file and in [Architecture](architecture.md)
- Keep `packages/<adapter>/AGENTS.md` framework-specific (paths, entrypoints, commands, framework-only guardrails)
- Do not copy identical guardrails between adapters; link to this file instead

## Scope & Parity
- Identify the adapter surface involved (components, hooks, docs)
- If the change is cross-adapter, ensure parity across existing adapters and document intentional deltas

## Core Contract First
- Start from the core contract in `packages/core/src/lib` (`map.ts`, `feature.ts`, `marker.ts`, `mapObject.ts`, `zoom.ts`)
- If adapters need new behavior/types, add them to core first so adapters stay thin wrappers

## Adapter Boundary
- Reuse `@d3-maps/core` helpers only
- Do not import `d3-*` directly in adapters (canonical rule lives in [Architecture](architecture.md))

## Public API Wiring
- Route public API through `packages/<adapter>/src/index.ts`
- Keep exports named-only and keep the surface consistent across adapters where it makes sense

## Implementation Patterns
- Split every adapter feature into two concerns:
  - Render: deterministic SVG markup derived from props and core contracts
  - Behavior: imperative DOM behavior wiring that enhances existing markup (zoom, drag, pointer/focus interactions)
- Render must be side-effect free:
  - no DOM reads/writes
  - no timers
  - no behavior construction during render
- Behavior wiring happens after mount and must be:
  - idempotent (safe to re-run on relevant option changes)
  - cleanly disposable (remove listeners/behaviors on unmount)
- Prop changes drive two updates:
  - markup updates via re-render
  - behavior updates via re-apply with new options
- Keep shared interaction semantics consistent across adapters:
  - map object interaction is a small state machine (for example default/hover/active)
  - style resolution is deterministic and derived from state + user styles
- Interop/SSR mental model:
  - server render may produce static SVG markup
  - interactivity attaches only on the client after mount
  - do not require DOM availability to render markup

## Tests
- Add/adjust adapter tests for behavior parity and edge cases
- Include SSR smoke tests where components/hooks are expected to be SSR-safe

## Docs
- If docs contain framework code, include all adapter equivalents using VitePress tabs
- Update component docs + examples and regenerate wrappers when example sources change (`pnpm docs:gen:examples`)
- Follow the canonical pipeline in [Docs Generation Workflow](docs-generation.md)

## Release Hygiene
- For publishable package changes, add a changeset and follow the [changesets skill](../skills/changesets/SKILL.md)

## Validation Commands
- `pnpm --filter @d3-maps/<adapter> typecheck`
- `pnpm --filter @d3-maps/<adapter> test`
- `pnpm --filter @d3-maps/docs build`
- `pnpm lint`
- `pnpm test --output-logs=errors-only`
