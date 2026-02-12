# Git Workflow

## Commit Standard
| Topic | Rule |
| --- | --- |
| Specification | Conventional Commits v1.0.0 |
| Format | `type(scope): summary` |
| Allowed types | `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore` |

## Examples
| Type | Example |
| --- | --- |
| Feature | `feat(product): add product detail page` |
| Fix | `fix(auth): handle token refresh edge case` |
| Docs | `docs(api): regenerate typedoc pages` |

## Pull Request Checks
| Check | Command |
| --- | --- |
| Tests | `pnpm test` |
| Lint | `pnpm lint` |
| Docs build | `pnpm docs:build` |

## Hooks
| Hook | Behavior |
| --- | --- |
| pre-commit | Runs `lint-staged` from package.json. |
| pre-push | Runs `pnpm docs:build` from package.json. |

## Related Docs
- [Architecture](architecture.md)
- [Code Style](code-style.md)
