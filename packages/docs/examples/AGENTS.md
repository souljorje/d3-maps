# docs/examples

## Scope
| Area | Path |
| --- | --- |
| Examples landing page | [Examples Home](index.md) |
| Generated wrappers example | [Basic Example](basic.md) |

## Commands
| Command | Purpose |
| --- | --- |
| `pnpm docs:gen:examples` | Regenerate example wrapper pages. |
| `pnpm docs:gen` | Regenerate wrappers and API docs. |

## Inputs/Outputs
| Type | Path |
| --- | --- |
| Demo source files | packages/docs/.vitepress/examples |
| Generator script | scripts/docs-gen-examples.mjs |
| Generated wrappers output directory | packages/docs/examples (`*.md` except AGENTS file) |
| Generated examples index | [Examples Home](index.md) |

## References
- [Docs Guide](../AGENTS.md)
- [Root Guide](../../../AGENTS.md)
- [Architecture](../../../.agents/docs/architecture.md)
- [Engineering Workflow](../../../.agents/docs/engineering-workflow.md)
- [Docs Generation Workflow](../../../.agents/docs/docs-generation.md)
- [AGENTS Style Guide](../../../.agents/docs/.agents-style.md)
