# @d3-maps/solid

## Scope

| Area | Path |
| --- | --- |
| Source | packages/solid/src |
| Tests | packages/solid/tests |
| Build integration | packages/solid/build |
| Build output | packages/solid/dist |

## Entry points

| Item | Path |
| --- | --- |
| Named public exports | packages/solid/src/index.ts |
| Component prop contracts | packages/solid/src/types.ts |
| Reactive context and zoom commands | packages/solid/src/context.ts |
| Thin framework components | packages/solid/src/components |

## Commands

| Command | Purpose |
| --- | --- |
| `pnpm --filter @d3-maps/solid typecheck` | Check component contracts. |
| `pnpm --filter @d3-maps/solid typecheck:test` | Check tests and fixtures. |
| `pnpm --filter @d3-maps/solid test` | Run client and DOM-free server suites. |
| `pnpm build --filter=@d3-maps/solid` | Build dependencies and package through Turbo. |

## Guardrails

| Rule | Requirement |
| --- | --- |
| Supported runtime | Solid 2 with the matching @solidjs/web renderer; Solid 1 is not supported. |
| JSX ownership | Import JSX types and web rendering APIs from @solidjs/web. |
| Reactivity | Preserve prop getters with omit. Read map context accessors inside JSX or computations. |
| Effects | Use Solid 2 compute/effect phases. Attach core behavior only in the effect phase and return cleanup. |
| Lifecycle | onSettled replaces onMount. Do not create primitives inside ref callbacks or imperative effect callbacks. |
| Feature identity | Use keyed For with feature.key and accessor items. |
| Styles | Native and interaction styles use CSS property objects. |
| Packaging | Build hydratable browser and DOM-free server entry points with the pinned Solid 2 compiler and shared Tsdown config. Keep runtime peers external. |
| CSS | Import the public style.css explicitly; do not import it from the JavaScript entry. |
| Tests | Flush staged signal writes at imperative assertion boundaries. Exercise development diagnostics and SSR separately. |

## References

- [Root Guide](../../AGENTS.md)
- [Adapter Development](../../.agents/references/adapter-development.md)
- [Build Policy](../../.agents/references/build.md)
- [Code Style](../../.agents/references/code-style.md)
