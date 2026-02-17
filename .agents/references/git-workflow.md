# Git Workflow

## Commit Standard
| Topic | Rule |
| --- | --- |
| Specification | [Conventional Commits v1.0.0](https://www.conventionalcommits.org/en/v1.0.0/) |
| Subject format | `type(scope): summary` |
| Allowed types | `feat`, `fix`, `docs`, `refactor`, `ci`, `chore`, `test` |
| Body | Prefer a body for anything non-trivial (include what changed and why) |

## Commit Body Style

- Use a blank line between subject and body
- Use short bullets; keep it user-facing (not a file list)

Template:

```text
type(scope): summary

- What changed (1-3 bullets).
- Why it changed / behavior impact.
```

## Examples
| Type | Example |
| --- | --- |
| Feature | `feat(product): add product detail page` |
| Fix | `fix(auth): handle token refresh edge case` |
| Docs | `docs(api): regenerate typedoc pages` |

With body:

```text
feat(core): add auto-fit helper for responsive maps

- Add `fitProjectionToBounds(...)` to reduce boilerplate when resizing.
- Keeps existing behavior; opt-in helper only.
```

## Pull Request Checks
| Check | Command |
| --- | --- |
| Tests | `pnpm test` |
| Lint | `pnpm lint` |
| Docs build | `pnpm docs:build` |

## Hooks
| Hook | Behavior |
| --- | --- |
| pre-commit | Runs `lint-staged`, then `pnpm test` from package.json (`simple-git-hooks`). |
| pre-push | Runs `pnpm docs:build` from package.json (`simple-git-hooks`). |

## Related Docs
- [Architecture](architecture.md)
- [Code Style](code-style.md)
- [GitHub Actions Workflow](github-actions-workflow.md)
- [changesets skill](../skills/changesets/SKILL.md)
