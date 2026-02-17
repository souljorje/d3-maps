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
| `pnpm build` | Build the full project (packages + docs generation + docs site). |
| `pnpm test` | Run core and vue test suites. |
| `pnpm docs:gen:examples` | Generate docs example wrapper pages from `.vitepress/examples`. |
| `pnpm typedoc` | Generate API reference docs via TypeDoc. |
| `pnpm docs:gen` | Run all docs generation steps. |
| `pnpm docs:build` | Build VitePress docs only (includes docs generation). |
| `pnpm docs:preview` | Preview built docs site. |
| `pnpm lint` | Run ESLint. |
| `pnpm lintfix` | Run ESLint with auto-fix. |

## Global Rules
| Topic | Rule |
| --- | --- |
| AGENTS.md files | Follow [AGENTS Style Guide](.agents/references/agents-style.md) when updating AGENTS.md files. |
| Nested AGENTS | Always update all relevant nested AGENTS files when rules/scope change. |
| Duplicated AGENTS | Never duplicate content in AGENTS files. |
| Markdown links | Write `.md` mentions as relative links with readable titles. |
| Architecture constraints | Follow [Architecture](.agents/references/architecture.md). |
| Engineering workflow | Follow [Engineering Workflow](.agents/references/engineering-workflow.md). |
| Code Style | Follow [Code Style](.agents/references/code-style.md). |

## Skills
| Skill | When to use |
|-------|-------------|
| [vitest](.agents/skills/vitest/SKILL.md) | Writing or updating test suites, mocking setup, or coverage/test config. |
| [changesets](.agents/skills/changesets/SKILL.md) | Creating or updating `.changeset/*.md` entries for package changes (everything under `packages/*` except `packages/docs`). |

## Detailed Instructions

- [Architecture](.agents/references/architecture.md)
- [Code Style](.agents/references/code-style.md)
- [Engineering Workflow](.agents/references/engineering-workflow.md)
- [Git Workflow](.agents/references/git-workflow.md)
- [Docs Generation Workflow](.agents/references/docs-generation.md)
- [AGENTS Style Guide](.agents/references/agents-style.md)
