# @d3-maps/svelte

## Scope

| Area | Path |
| --- | --- |
| Source | packages/svelte/src |
| Tests | packages/svelte/tests |
| Build output | packages/svelte/dist |

## Entry points

| Item | Path |
| --- | --- |
| Named public exports | packages/svelte/src/index.ts |
| Public component props | packages/svelte/src/types.ts |
| Context getters and zoom commands | packages/svelte/src/context.ts |
| Runes components | packages/svelte/src/components |

## Commands

| Command | Purpose |
| --- | --- |
| `pnpm --filter @d3-maps/svelte typecheck` | Check component contracts. |
| `pnpm --filter @d3-maps/svelte typecheck:test` | Check tests and fixtures. |
| `pnpm --filter @d3-maps/svelte test` | Run client and DOM-free server suites. |
| `pnpm build --filter=@d3-maps/svelte` | Build dependencies and the package through Turbo. |

## Guardrails

| Rule | Requirement |
| --- | --- |
| Supported runtime | Svelte 5.20 or newer within major 5; CI uses the latest stable Svelte 5. |
| Reactivity | Use runes and snippet children. Keep map context in a getter; do not capture its current value in component initialization. |
| Interactivity | Use core bindings in actions or effects, never during rendering. Return disposal from the action/effect. |
| Styles | State styles and native inline styles use CSS declaration strings. |
| Packaging | Keep Svelte components in source form for consumer-side client/SSR compilation. Use svelte-package for preprocessing/declarations and the shared Tsdown configuration for neutral JavaScript. |
| Context identity | Preserve the context module boundary so distributed components and public hooks share the same symbols. |
| CSS | Import the public style.css explicitly in applications; never import it from the JavaScript entry. |

## References

- [Root Guide](../../AGENTS.md)
- [Adapter Development](../../.agents/references/adapter-development.md)
- [Build Policy](../../.agents/references/build.md)
- [Code Style](../../.agents/references/code-style.md)
