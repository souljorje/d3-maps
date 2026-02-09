# @d3-maps/vue

Vue bindings for @d3-maps/core

## Scope

- Source: [packages/vue/src](./src)
- Components: [packages/vue/src/components](./src/components)
- Composables/helpers: [packages/vue/src/lib](./src/lib) (Vue wrappers around core helpers)
- Tests: [packages/vue/tests](./tests)
- Build output: [packages/vue/dist](./dist)

## Key Files

- [packages/vue/src/index.ts](./src/index.ts) is the public entry
- [packages/vue/src/components/index.ts](./src/components/index.ts) re-exports components

## Responsibilities

- Vue components and composables that wrap @d3-maps/core helpers
- Reuse prop and event contracts from @d3-maps/core for map objects
- Declarative SVG map composition
- Reactivity for data, size, projection, and options

## Commands

Run from repo root:

- `pnpm --filter @d3-maps/vue dev` (tsdown watch)
- `pnpm --filter @d3-maps/vue build`
- `pnpm --filter @d3-maps/vue type-check`
- `pnpm --filter @d3-maps/vue test`
- `pnpm --filter @d3-maps/vue test:watch`

## Conventions

- Vue SFCs use `<script setup lang="ts">` and Composition API.
- Keep component props typed and aligned with @d3-maps/core types.
- Update packages/vue/src/components/index.ts and packages/vue/src/index.ts when adding components.
- Prefer consuming shared logic from @d3-maps/core rather than copying utilities.
- For MapZoom, prefer @d3-maps/core zoom helpers instead of direct d3-zoom usage.
- Use shared helpers from [./../core/src/lib/utils.ts](./../core/src/lib/utils.ts) (copied there from [https://github.com/souljorje/utilities](https://github.com/souljorje/utilities) when needed) for null checks and abstract utility logic via @d3-maps/core exports.
- Do not edit packages/vue/dist directly; rebuild instead.
