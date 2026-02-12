# @d3-maps/vue

## Scope
| Area | Path |
| --- | --- |
| Source | packages/vue/src |
| Components | packages/vue/src/components |
| Composables/helpers | packages/vue/src/lib |
| Tests | packages/vue/tests |
| Build output | packages/vue/dist |

## Entry Points
| Item | Path | Contract |
| --- | --- | --- |
| Package entry | packages/vue/src/index.ts | Public API for Vue adapter. |
| Components export | packages/vue/src/components/index.ts | Re-export all public components. |

## Commands
| Command | Purpose |
| --- | --- |
| `pnpm --filter @d3-maps/vue typecheck` | Run Vue TypeScript checks. |
| `pnpm --filter @d3-maps/vue build` | Typecheck and build package. |
| `pnpm --filter @d3-maps/vue test` | Run tests once. |
| `pnpm --filter @d3-maps/vue test:watch` | Run tests in watch mode. |

## Guardrails
| Rule | Requirement |
| --- | --- |
| SFC style | Use `<script setup lang="ts">` and Composition API. |
| Type contracts | Align component props/events with `@d3-maps/core` contracts. |
| Exports | Update packages/vue/src/components/index.ts and packages/vue/src/index.ts for public components. |
| Shared logic | Reuse `@d3-maps/core` helpers; do not duplicate core abstractions in Vue package. |
| Adapter imports | Never import d3-related libraries directly in adapters; import only from `@d3-maps/core`. |
| Zoom behavior | Prefer `@d3-maps/core` zoom helpers over direct `d3-zoom` usage. |

## References
- [Root Guide](../../AGENTS.md)
- [Core Guide](../core/AGENTS.md)
- [Architecture](../../.agents/references/architecture.md)
- [Engineering Workflow](../../.agents/references/engineering-workflow.md)
- [Code Style](../../.agents/references/code-style.md)
