# D3-maps

## Goal
Make map creation with D3 simple, reactive, and responsive out of the box, across frameworks.

## Package Guides
- [Core Guide](packages/core/AGENTS.md)
- [Vue Guide](packages/vue/AGENTS.md)
- [Docs Guide](packages/docs/AGENTS.md)

## Repository Layout
```text
├─ packages/
  ├─ docs/  # VitePress unified docs site
  ├─ core/  # framework-agnostic core utilities (@d3-maps/core)
  ├─ vue/   # Vue adapter (@d3-maps/vue)
  # planned
  ├─ react/  # React adapter
  ├─ svelte/ # Svelte adapter
  └─ solid/  # Solid adapter
```

## Common Commands
| Command | Description |
| --- | --- |
| `pnpm install` | Install workspace dependencies. |
| `pnpm dev` | Run docs dev server (`docs` workspace). |
| `pnpm build` | Build core, vue, and docs packages. |
| `pnpm test` | Run core and vue test suites. |
| `pnpm docs:dev` | Run VitePress docs in dev mode. |
| `pnpm docs:gen:examples` | Generate docs example wrapper pages from `.vitepress/examples`. |
| `pnpm typedoc` | Generate API reference docs via TypeDoc. |
| `pnpm docs:gen` | Run all docs generation steps. |
| `pnpm docs:build` | Generate docs and build VitePress site. |
| `pnpm docs:preview` | Preview built docs site. |
| `pnpm lint` | Run ESLint. |
| `pnpm lintfix` | Run ESLint with auto-fix. |

## Global Rules

| Topic | Rule |
| --- | --- |
| Nested AGENTS | Always update all relevant nested AGENTS files when rules/scope change. |
| Markdown links | Write `.md` mentions as relative links with readable titles. |
| Architecture constraints | Follow [Architecture](.agents/docs/architecture.md). |
| Engineering workflow | Follow [Engineering Workflow](.agents/docs/engineering-workflow.md). |
| Style | Follow [Code Style](.agents/docs/code-style.md). |

## Deep Docs

- [Architecture](.agents/docs/architecture.md)
- [Code Style](.agents/docs/code-style.md)
- [Engineering Workflow](.agents/docs/engineering-workflow.md)
- [Git Workflow](.agents/docs/git-workflow.md)
- [Docs Generation Workflow](.agents/docs/docs-generation.md)
- [AGENTS Style Guide](.agents/docs/.agents-style.md)
