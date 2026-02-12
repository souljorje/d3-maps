# Docs Generation Workflow

## Scope
Generated docs content for `packages/docs`.

## Pipeline
| Step | Command | Input | Output |
| --- | --- | --- | --- |
| 1 | `pnpm docs:gen:examples` | packages/docs/.vitepress/examples/*.vue | generated wrappers in packages/docs/examples/*.md |
| 2 | `pnpm typedoc` | typedoc.json + package API exports | API markdown in packages/docs/api/core |
| 3 | `pnpm docs:gen` | Step 1 + Step 2 | all generated docs artifacts |
| 4 | `pnpm docs:build` | generated docs + VitePress content | production docs build |

## Example Wrapper Generation
| Item | Location |
| --- | --- |
| Generator script | scripts/docs-gen-examples.mjs |
| Source examples | packages/docs/.vitepress/examples |
| Generated wrappers | packages/docs/examples |
| Generated index page | [Examples Home](../../packages/docs/examples/index.md) |

## TypeDoc Generation
| Item | Location |
| --- | --- |
| Root command | `pnpm typedoc` |
| Command definition | package.json |
| TypeDoc config | typedoc.json |
| API package landing | [Core API](../../packages/docs/api/core/index.md) |

## Ownership Rules
| Rule | Requirement |
| --- | --- |
| Wrapper pages | Do not manually edit generated wrappers in packages/docs/examples/*.md. |
| Example source | Edit Vue demo source files in packages/docs/.vitepress/examples/*.vue. |
| API docs | Regenerate with `pnpm typedoc` after public API changes. |
| Validation | Run `pnpm docs:build` before push; root pre-push runs this. |

## Related Docs
- [Architecture](architecture.md)
- [Code Style](code-style.md)
- [AGENTS Style Guide](.agents-style.md)
