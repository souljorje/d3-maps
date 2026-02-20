# @d3-maps/react

## Scope
| Area | Path |
| --- | --- |
| Source | packages/react/src |
| Components | packages/react/src/components |
| Hooks/helpers | packages/react/src/lib |
| Tests | packages/react/tests |
| Build output | packages/react/dist |

## Entry Points
| Item | Path | Contract |
| --- | --- | --- |
| Package entry | packages/react/src/index.ts | Public API for React adapter. |
| Components export | packages/react/src/components/index.ts | Re-export all public components. |

## Commands
| Command | Purpose |
| --- | --- |
| `pnpm --filter @d3-maps/react typecheck` | Run TypeScript checks. |
| `pnpm --filter @d3-maps/react build` | Typecheck and build package. |
| `pnpm --filter @d3-maps/react test` | Run tests once. |
| `pnpm --filter @d3-maps/react test:watch` | Run tests in watch mode. |

## Guardrails
| Rule | Requirement |
| --- | --- |
| Type contracts | Align component props/events with `@d3-maps/core` contracts. |
| Exports | Update packages/react/src/components/index.ts and packages/react/src/index.ts for public components/hooks. |
| Shared logic | Reuse `@d3-maps/core` helpers; do not duplicate core abstractions in React package. |
| Adapter imports | Never import d3-related libraries directly in adapters; import only from `@d3-maps/core`. |
| Zoom behavior | Prefer `@d3-maps/core` zoom helpers over direct `d3-zoom` usage. |

## Skills
| Skill | When to use |
|-------|-------------|
| [vercel-react-best-practices](../../.agents/skills/react-best-practices/SKILL.md) | Any React component/hook implementation, optimization, or refactor in this package. |

## References
- [Root Guide](../../AGENTS.md)
- [Core Guide](../core/AGENTS.md)
- [Architecture](../../.agents/references/architecture.md)
- [Engineering Workflow](../../.agents/references/engineering-workflow.md)
- [Code Style](../../.agents/references/code-style.md)
