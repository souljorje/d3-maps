# Build Policy

Tsdown and package-boundary rules for published workspaces.

## Skills

| Skill | When to use |
|---|---|
| `tsdown` | Required when changing tsdown config, build outputs, package exports, DTS, CSS emission, or package-boundary builds. |
| `turborepo` | Required when changing Turbo task graphs, caching, filtering, CI build orchestration, or workspace build behavior. |

## Shared config

- `tsdown.config.ts` is the shared build helper.
- `createTsDownConfig()` emits neutral-platform ESM from `src/index.ts`
- When a package passes `tsconfig`, DTS generation must use that same config unless explicitly overridden.

## Core package

- `@d3-maps/core` uses its package `tsconfig.json`.
- Core owns D3 and TopoJSON runtime dependencies used by the public API.
- Core owns published `@types/*` dependencies referenced by its `dist/index.d.ts`.
- Core copies `packages/core/src/style.css` to `packages/core/dist/style.css`.
- Core IIFE bundles D3 and TopoJSON internals through `iifeNoExternal`.

## Adapter packages

- Adapters build with `tsconfig.build.json`.
- `tsconfig.build.json` extends the package-local `tsconfig.json`.
- Adapter build configs remove the workspace alias for `@d3-maps/core` so JS and DTS import core as a package boundary.
- Published adapter DTS should re-export core types through the package boundary.
- Adapters must not mirror core D3 or TopoJSON type dependencies in their own package manifests.

## Stylesheets

- Package JS entries stay side-effect-free.
- Consumers import adapter styles explicitly from `@d3-maps/react/style.css` or `@d3-maps/vue/style.css`.
- Adapters copy `packages/core/src/style.css` into their own `dist/style.css`.

## Validation commands

- `pnpm --filter @d3-maps/core build`
- `pnpm --filter @d3-maps/react build`
- `pnpm --filter @d3-maps/vue build`
- `pnpm typecheck:test`
