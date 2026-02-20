# Code Style

## Scope
Code conventions for all packages and docs custom code.

## Canonical Sources
| Topic | Source |
| --- | --- |
| Lint rules | eslint.config.js |
| Shared utility file | packages/core/src/lib/utils.ts |
| Architecture constraints | [Architecture](architecture.md) |

## Rules
| Topic | Rule |
| --- | --- |
| Programming paradigm | Prefer functional and declarative patterns. |
| Boolean naming | Prefix boolean props/vars with `is`, `has`, `should`. |
| Optimization | Prefer elegant short solutions; avoid premature optimization. |
| Shared helpers | Copy reusable assertions/null checks/helpers from https://github.com/souljorje/utilities into packages/core/src/lib/utils.ts, then consume via package exports. |

## Markdown Rules
| Topic | Rule |
| --- | --- |
| .md references | Write `.md` file mentions as relative links with readable titles (example: `[Code Style](code-style.md)`). |
| Link-title backticks | Do not use backticks in markdown link titles. |
| File trees | Use repository tree style defined in [Architecture](architecture.md). |
| AGENTS verbosity | Prefer concise, scannable structure over long prose. |
