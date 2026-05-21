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
| Data and feature model | packages/core/src/lib/data.ts | Shared GeoJSON/TopoJSON resolution plus geographic feature render/data contracts and feature enrichment helpers. |
| Object model | packages/core/src/lib/object.ts | Shared low-level interactive SVG object prop contracts. |
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
| Domain contracts | Treat `map.ts`, `data.ts`, `object.ts`, `marker.ts`, `zoom.ts`, and `interaction.ts` as shared model/type contracts, not view-only helpers. |
| Map context inputs | If helper depends on map context values, accept the context object. |
| Build ownership | Keep D3 and TopoJSON runtime plus published type dependencies owned here, not mirrored into adapters. |

## References
- [Root Guide](../../AGENTS.md)
- [Architecture](../../.agents/references/architecture.md)
- [Tsdown Build Strategy](../../.agents/references/tsdown-build-strategy.md)
- [Code Style](../../.agents/references/code-style.md)
