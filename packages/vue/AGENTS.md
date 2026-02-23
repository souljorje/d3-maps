# @d3-maps/vue

## Scope
| Area | Path |
| --- | --- |
| Source | packages/vue/src |
| Components | packages/vue/src/components |
| Composables/hooks | packages/vue/src/hooks |
| Tests | packages/vue/tests |
| Build output | packages/vue/dist |

## Entry Points
| Item | Path | Contract |
| --- | --- | --- |
| Package entry | packages/vue/src/index.ts | Public API for Vue adapter. |
| Components export | packages/vue/src/components/index.ts | Re-export all public components. |
| Composables export | packages/vue/src/hooks/index.ts | Re-export all public composables and composable types. |
| Plugin export | packages/vue/src/plugin.ts | Vue plugin entrypoint for component registration. |

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
| Required workflow | Must follow [Adapter Development Flow](../../.agents/references/adapter-development-flow.md) for any change in this package. Do not bypass steps. |
| SFC style | Use `<script setup lang="ts">` and Composition API. |
| Emits | Keep Vue emits as lowercase DOM-like events (`mouseenter`, `zoom`, `zoomend`) rather than React-style callbacks. |
| Vue patterns | Follow the [vue-best-practices](../../.agents/skills/vue-best-practices/SKILL.md) skill for Composition API, typing, and reactivity decisions. |
| Public exports | Keep public surface routed through packages/vue/src/index.ts (which exports components, composables, and plugin). |

## Skills
| Skill | When to use |
|-------|-------------|
| [vue-best-practices](../../.agents/skills/vue-best-practices/SKILL.md) | Any Vue component/composable work in this package, including TypeScript and Composition API decisions. |

## References
- [Root Guide](../../AGENTS.md)
- [Core Guide](../core/AGENTS.md)
- [Agent Meta-Flow](../../.agents/references/agent-meta-flow.md)
- [Adapter Development Flow](../../.agents/references/adapter-development-flow.md)
- [Architecture](../../.agents/references/architecture.md)
- [Code Style](../../.agents/references/code-style.md)
