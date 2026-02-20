# docs

## Scope
| Area | Path |
| --- | --- |
| Main pages | [Docs Home](index.md), [Guide](guide/index.md), [Components](components/index.md), [Examples](examples/index.md), [API](api/index.md) |
| VitePress config | packages/docs/.vitepress/config.js |
| Theme runtime | packages/docs/.vitepress/theme/index.js |
| Demo sources | packages/docs/.vitepress/examples |
| Public assets | packages/docs/public |

## Commands
| Command | Purpose |
| --- | --- |
| `pnpm --filter docs dev` | Run VitePress locally. |
| `pnpm docs:build` | Build docs site (includes docs generation). |
| `pnpm --filter docs preview` | Preview built docs site. |
| `pnpm docs:gen` | Regenerate examples wrappers and API docs. |

## Routing
- [API Guide](api/AGENTS.md)
- [Examples Guide](examples/AGENTS.md)

## Guardrails
| Rule | Requirement |
| --- | --- |
| Navigation | Keep nav/sidebar changes in packages/docs/.vitepress/config.js. |
| Theme registration | Register global demo components in packages/docs/.vitepress/theme/index.js. |
| Generated content | Do not hand-edit generated files in packages/docs/examples and generated API markdown in packages/docs/api/core. |
| Docs style | Follow [Docs Style](../../.agents/references/docs-style.md). |

## Skills
| Skill | When to use |
|-------|-------------|
| [vitepress](../../.agents/skills/vitepress/SKILL.md) | Changing VitePress config, theme behavior, markdown features, or docs site navigation/content structure. |

## References
- [Root Guide](../../AGENTS.md)
- [Architecture](../../.agents/references/architecture.md)
- [Docs Generation Workflow](../../.agents/references/docs-generation.md)
- [Code Style](../../.agents/references/code-style.md)
