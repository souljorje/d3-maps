# Tsdown Build Strategy

## Goal
Keep published package boundaries intact in ESM, DTS, and browser builds while keeping adapter configs small

## Shared Helper
- `tsdown.config.ts` is the only shared build helper
- `createTsDownConfig()` emits:
  - a neutral-platform ESM build from `src/index.ts`
  - a browser IIFE build from the same entry with `globalName: 'D3Maps'`
- When a package passes `tsconfig`, DTS generation must use the same config unless the package explicitly overrides it

## Core Package
- `@d3-maps/core` uses the default package `tsconfig.json`
- Core owns the D3 and TopoJSON runtime dependencies used by its public API
- Core also owns the published `@types/*` dependencies referenced by `packages/core/dist/index.d.ts`
- Core copies `packages/core/src/index.css` to `packages/core/dist/index.css`
- Core IIFE bundles its D3 and TopoJSON internals through `iifeNoExternal`

## Adapter Packages
- Adapters build with `tsconfig.build.json`
- `tsconfig.build.json` must extend the package-local `tsconfig.json`
- Build configs must remove the workspace alias for `@d3-maps/core` so JS and DTS builds import core as a package boundary
- Published adapter DTS should re-export `@d3-maps/core/types` instead of flattening core internals into adapter declarations
- Adapters must not mirror core's D3 or TopoJSON type dependencies in their own `package.json`

## Stylesheets
- Package JS entries stay side-effect-free
- Consumers import styles explicitly from the adapter package:
  - `@d3-maps/react/index.css`
  - `@d3-maps/vue/index.css`
- Adapters copy `packages/core/src/index.css` into their own `dist/index.css` so browser and bundler consumers can stay inside one package

## Browser Builds
- Adapter IIFE bundles include `@d3-maps/core`
- Adapter IIFE bundles keep framework runtimes external:
  - React adapter expects `React`
  - Vue adapter expects `Vue`
- Core browser build remains available for low-level usage

## Debugging
- If adapter DTS starts importing raw D3 modules again, check `tsconfig.build.json` and the package `tsdown.config.ts`
- If adapter browser builds start expecting a `D3Maps` core global again, check adapter `iifeNoExternal`
- If CSS exports break, verify the package still copies `index.css` into `dist`

## Validation
- `pnpm --filter @d3-maps/core build`
- `pnpm --filter @d3-maps/react build`
- `pnpm --filter @d3-maps/vue build`
- `pnpm typecheck:test`
