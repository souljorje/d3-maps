# @d3-maps/core Guide

Framework-agnostic utilities for building reactive D3 maps.

## Scope

- Source: packages/core/src
- Tests: packages/core/tests
- Build output: packages/core/dist

## Key Files

- packages/core/src/index.ts exports public API.
- packages/core/src/lib/map.ts contains map context/projection helpers.
- packages/core/src/lib/mapObject.ts contains shared map object types and event contracts.
- packages/core/src/lib/feature.ts and packages/core/src/lib/marker.ts contain feature/marker helpers.
- packages/core/src/lib/zoom.ts contains pure zoom behavior helpers.
- packages/core/src/lib/utils.ts contains shared utility helpers.

## Responsibilities

- Core functions for GeoJSON and TopoJSON transformation and map rendering
- Pure helper functions for map entities (Feature, Marker, etc)
- Pure helpers for map object interaction state and style resolution
- Helpers for d3-zoom behavior creation, configuration, and transform/scale formatting
- Helpers for custom maps (choropleth, bubble, and similar)

## Commands

Run from repo root:

- `pnpm --filter @d3-maps/core build`
- `pnpm --filter @d3-maps/core typecheck`
- `pnpm --filter @d3-maps/core test`
- `pnpm --filter @d3-maps/core test:watch`

## Conventions

- Keep the public API stable: add exports via ./src/index.ts and document breaking changes.
- Keep utilities framework-agnostic and side-effect-free
- For shared type assertions, null checks, and abstract reusable helpers, copy needed functions from [https://github.com/souljorje/utilities](https://github.com/souljorje/utilities) into [./src/lib/utils.ts](./src/lib/utils.ts).
- Avoid framework-specific code in core; write ALL abstract reusable logic in core; adapters must follow KISS principle and be framework-specific only
- When helpers depend on values that come from MapContext, accept the whole context object instead of individual properties.
