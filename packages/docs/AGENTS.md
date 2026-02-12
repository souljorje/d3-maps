# docs

## Scope
| Area | Path |
| --- | --- |
| Main pages | [Docs Home](index.md), [Getting Started](getting-started/index.md), [Components](components/index.md), [Examples](examples/index.md), [API](api/index.md) |
| VitePress config | packages/docs/.vitepress/config.js |
| Theme runtime | packages/docs/.vitepress/theme/index.js |
| Demo sources | packages/docs/.vitepress/examples |
| Public assets | packages/docs/public |

## Commands
| Command | Purpose |
| --- | --- |
| `pnpm --filter docs dev` | Run VitePress locally. |
| `pnpm --filter docs build` | Build docs site only. |
| `pnpm --filter docs preview` | Preview built docs site. |
| `pnpm docs:gen` | Regenerate examples wrappers and API docs. |
| `pnpm docs:build` | Regenerate and build docs site. |

## Routing
- [API Guide](api/AGENTS.md)
- [Examples Guide](examples/AGENTS.md)

## Guardrails
| Rule | Requirement |
| --- | --- |
| Navigation | Keep nav/sidebar changes in packages/docs/.vitepress/config.js. |
| Theme registration | Register global demo components in packages/docs/.vitepress/theme/index.js. |
| Generated content | Do not hand-edit generated files in packages/docs/examples and generated API markdown in packages/docs/api/core. |

## References
- [Root Guide](../../AGENTS.md)
- [API Guide](api/AGENTS.md)
- [Examples Guide](examples/AGENTS.md)
- [Architecture](../../agents/docs/architecture.md)
- [Engineering Workflow](../../agents/docs/engineering-workflow.md)
- [Docs Generation Workflow](../../agents/docs/docs-generation.md)
- [Code Style](../../agents/docs/code-style.md)
- [AGENTS Style Guide](../../agents/docs/agents-style.md)
