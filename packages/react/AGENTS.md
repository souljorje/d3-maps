# @d3-maps/react

## Scope
| Area | Path |
| --- | --- |
| Source | packages/react/src |
| Components | packages/react/src/components |
| Hooks | packages/react/src/hooks |
| Tests | packages/react/tests |
| Build output | packages/react/dist |

## Entry Points
| Item | Path | Contract |
| --- | --- | --- |
| Package entry | packages/react/src/index.ts | Public API for React adapter. |
| Components export | packages/react/src/components/index.ts | Re-export all public components. |
| Hooks export | packages/react/src/hooks/index.ts | Re-export all public hooks and hook types. |

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
| React support | React 19 only; keep `peerDependencies` for `react` and `react-dom` as `>=19 <20`. |
| Next.js boundary | Any hook-using entrypoint must be client-only (`'use client'`); in Next.js App Router, import it from Client Components. |
| Effects and callbacks | Keep effect deps primitive-focused and use stable callback refs for event props (follow the [vercel-react-best-practices](../../.agents/skills/react-best-practices/SKILL.md) skill). |
| Public exports | Keep public surface as named exports routed through packages/react/src/index.ts (and packages/react/src/hooks/index.ts for hooks/types). |

## Skills
| Skill | When to use |
|-------|-------------|
| [vercel-react-best-practices](../../.agents/skills/react-best-practices/SKILL.md) | Any React component/hook implementation, optimization, or refactor in this package. |

## References
- [Root Guide](../../AGENTS.md)
- [Core Guide](../core/AGENTS.md)
- [Agent Meta-Flow](../../.agents/references/agent-meta-flow.md)
- [Adapter Development Flow](../../.agents/references/adapter-development-flow.md)
- [Architecture](../../.agents/references/architecture.md)
- [Code Style](../../.agents/references/code-style.md)
