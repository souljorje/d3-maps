# CI/CD

## Scope
Repository automation for validation, package releases and docs deploy.

## Active Workflows
| Workflow | Trigger | Responsibility |
| --- | --- | --- |
| [CI workflow](../../.github/workflows/ci.yml) | Pull requests to `main` | Run lint + tests and build publishable packages only via `pnpm build`. Docs are excluded from CI builds. |
| [Release workflow](../../.github/workflows/release.yml) | Push to `main` + manual dispatch | Build publishable packages and run Changesets to create release PRs or publish packages. |

## Shared Components
| Component | Location | Used by | Purpose |
| --- | --- | --- | --- |
| Setup composite action | [Setup action](../../.github/actions/setup/action.yml) | CI, release | Standardize pnpm + Node setup, dependency install, and Turbo cache restore. |

## Docs Deployment
- Docs deploys are handled by Netlify continuous deployment
- Netlify uses [`ignore`](../../netlify.toml) with [`scripts/netlify-ignore-build.mjs`](../../scripts/netlify-ignore-build.mjs) and [`.netlifyignore`](../../.netlifyignore) to skip deploys when changes are limited to ignored-only areas.

## Release Model
- Stable releases are produced from `main`.
- Prerelease automation is not active.
- Trusted publishing should reference a single workflow path: [Release workflow](../../.github/workflows/release.yml).

## Related Docs
- [Git Workflow](git-workflow.md)
- [Docs Generation Workflow](docs-generation.md)
- [changesets skill](../skills/changesets/SKILL.md)
