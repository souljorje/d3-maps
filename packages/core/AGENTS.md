# @d3-maps/core

## Scope
| Area | Path |
| --- | --- |
| Source | packages/core/src |
| Tests | packages/core/tests |
| Build output | packages/core/dist |

## Entry Points
| Item | Path | Contract |
| --- | --- | --- |
| Public API | packages/core/src/index.ts | Export all supported public symbols. |
| Map context/projection model | packages/core/src/lib/map.ts | Map data/context contracts and projection setup. |
| Data model | packages/core/src/lib/data.ts | Shared GeoJSON/TopoJSON resolution and normalized geographic feature data contracts. |
| Feature model | packages/core/src/lib/feature.ts | Rendered feature contracts, keys, props, transformers, and feature enrichment helpers. |
| Element model | packages/core/src/lib/element.ts | Shared low-level interactive SVG element prop contracts. |
| Interaction model | packages/core/src/lib/interaction.ts | Shared interaction state, style resolution, and DOM event helpers. |
| Marker model | packages/core/src/lib/marker.ts | Marker coordinate/props contracts plus marker transform resolver. |
| Zoom model and behavior | packages/core/src/lib/zoom.ts | Zoom types/events/contracts and behavior setup helpers. |
| Shared utilities | packages/core/src/lib/utils.ts | Reusable assertions/null checks/helpers. |

## Commands
| Command | Purpose |
| --- | --- |
| `pnpm --filter @d3-maps/core typecheck` | Run TypeScript checks. |
| `pnpm --filter @d3-maps/core build` | Typecheck and build package. |
| `pnpm --filter @d3-maps/core dev` | Build in watch mode. |
| `pnpm --filter @d3-maps/core test` | Run tests once. |
| `pnpm --filter @d3-maps/core test:watch` | Run tests in watch mode. |

## Guardrails
| Rule | Requirement |
| --- | --- |
| Framework boundaries | Keep package framework-agnostic and side-effect-free. |
| API stability | Add new exports via packages/core/src/index.ts and flag breaking changes. |
| Shared abstractions | Keep reusable logic in core; adapters should be framework-specific wrappers only. |
| Domain contracts | Treat core as shared model/type contracts, not view-only helpers. |
| Map context inputs | If helper depends on map context values, accept the context object. |
| Build ownership | Keep D3 and TopoJSON runtime plus published type dependencies owned here, not mirrored into adapters. |

## Related

- [Root Guide](../../AGENTS.md)

| Reference | When to read |
|---|---|
| [Architecture](.agents/references/architecture.md) | Understand project boundaries and mandatory principles |
| [Build Policy](.agents/references/build.md) | Read when working with tsdown, Turbo, package exports, DTS, CSS or other build changes. |
| [Code Style](.agents/references/code-style.md) | Read for TypeScript, markdown and other shared conventions. |
