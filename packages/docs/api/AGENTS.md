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

## References
- [Docs Guide](../AGENTS.md)
- [Root Guide](../../../AGENTS.md)
- [Architecture](../../../agents/docs/architecture.md)
- [Engineering Workflow](../../../agents/docs/engineering-workflow.md)
- [Docs Generation Workflow](../../../agents/docs/docs-generation.md)
- [AGENTS Style Guide](../../../agents/docs/agents-style.md)
