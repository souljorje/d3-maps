# docs/examples

## Scope
| Area | Path |
| --- | --- |
| Examples landing page | [Examples Home](index.md) |

## Commands
| Command | Purpose |
| --- | --- |
| `pnpm --filter @d3-maps/docs gen:examples` | Regenerate example wrapper pages. |
| `pnpm build:docs` | Build docs locally after regenerating example wrappers. |

## Inputs/Outputs
| Type | Path |
| --- | --- |
| Demo source files | packages/docs/.vitepress/examples |
| Generator command definition | packages/docs/package.json |
| Generator script | scripts/docs-gen-examples.mjs |
| Generated wrappers output directory | packages/docs/examples (`*.md` except AGENTS file) |
| Generated examples index | packages/docs/examples/index.md |

## Guardrails
| Rule | Requirement |
| --- | --- |
| Generated docs ownership | Treat wrapper markdown files in packages/docs/examples as generated output managed by docs generation commands. |

## Related
- [Docs Guide](../AGENTS.md)
- [Root Guide](../../../AGENTS.md)
- [Architecture](../../../.agents/references/architecture.md)
- [Docs Generation Workflow](../../../.agents/references/docs-generation.md)
