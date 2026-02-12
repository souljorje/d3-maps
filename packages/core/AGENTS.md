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
| Map object interaction model | packages/core/src/lib/mapObject.ts | Shared map object types, state, events, style resolution. |
| Feature model | packages/core/src/lib/feature.ts | `MapFeature` and `MapFeatureProps` contracts plus feature key resolver. |
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
| Domain contracts | Treat `feature.ts`, `marker.ts`, `zoom.ts`, and `mapObject.ts` as shared model/type contracts, not view-only helpers. |
| Map context inputs | If helper depends on map context values, accept the context object. |

## References
- [Root Guide](../../AGENTS.md)
- [Architecture](../../.agents/docs/architecture.md)
- [Engineering Workflow](../../.agents/docs/engineering-workflow.md)
- [Code Style](../../.agents/docs/code-style.md)
- [AGENTS Style Guide](../../.agents/docs/.agents-style.md)
