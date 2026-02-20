# Architecture

## Goal
Make map creation with D3 simple, reactive, and responsive out of the box, across frameworks.

## Repository Layout
```text
├─ packages/
  ├─ docs/  # VitePress unified docs site
  ├─ core/  # framework-agnostic core utilities (@d3-maps/core)
  ├─ react/ # React adapter (@d3-maps/react)
  ├─ vue/   # Vue adapter (@d3-maps/vue)
  # planned
  ├─ svelte/ # Svelte adapter
  └─ solid/  # Solid adapter
```

## Stack
| Area | Choice |
| --- | --- |
| Language | TypeScript (ESM) |
| Build | Tsdown |
| Tests | Vitest |
| Docs | VitePress |
| Package manager | pnpm workspaces (Node >= 20) |

## Layer Responsibilities
| Layer | Package | Responsibility |
| --- | --- | --- |
| Core | @d3-maps/core | Framework-agnostic map models, contracts, and behavior utilities. |
| Adapter | @d3-maps/react + @d3-maps/vue | Framework bindings that consume core contracts/utilities only. |
| Docs | docs | VitePress site, examples, and API reference rendering. |

## Core Conventions
| Rule | Requirement |
| --- | --- |
| Core boundary | Do not place framework-specific logic in packages/core. |
| Adapter boundary | Reuse core logic; avoid adapter-side utility forks. |
| Adapter imports | Adapters must never import d3-related libraries directly; import only from `@d3-maps/core`. |
| Abstraction location | Put reusable abstract logic in packages/core. |
| Adapter scope | Keep adapters framework-specific and thin wrappers around core. |
| Public exports | Route public API through packages/core/src/index.ts, packages/react/src/index.ts, and packages/vue/src/index.ts. |
| Model contracts | Treat `feature.ts`, `marker.ts`, `zoom.ts`, and `mapObject.ts` as shared model/type contracts. |

## Docs Architecture
| Part | Source |
| --- | --- |
| Example source-of-truth | packages/docs/.vitepress/examples/*.vue |
| Example wrapper generation | scripts/docs-gen-examples.mjs -> packages/docs/examples/*.md |
| API docs generation | typedoc.json + package.json script -> packages/docs/api/core |
| End-to-end docs build | `pnpm docs:build` |

## Related Docs
- [Code Style](code-style.md)
- [Engineering Workflow](engineering-workflow.md)
- [Git Workflow](git-workflow.md)
- [Docs Generation Workflow](docs-generation.md)
- [AGENTS Style Guide](.agents-style.md)
