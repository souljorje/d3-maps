# docs/api

## Scope
| Area | Path |
| --- | --- |
| API index/landing | [API Home](index.md), [Core API](core/index.md) |
| Generated API docs | packages/docs/api/core |

## Commands
| Command | Purpose |
| --- | --- |
| `pnpm typedoc` | Generate API markdown from package exports. |
| `pnpm docs:gen` | Regenerate examples wrappers and API docs. |

## Inputs/Outputs
| Type | Path |
| --- | --- |
| TypeDoc command definition | package.json |
| TypeDoc config | typedoc.json |
| Primary API source package | packages/core/src/index.ts |
| Generated output directory | packages/docs/api/core |

## Guardrails
| Rule | Requirement |
| --- | --- |
| Generated docs ownership | Treat API markdown in packages/docs/api/core as generated output managed by docs generation commands. |

## References
- [Docs Guide](../AGENTS.md)
- [Root Guide](../../../AGENTS.md)
- [Architecture](../../../.agents/references/architecture.md)
- [Docs Generation Workflow](../../../.agents/references/docs-generation.md)
