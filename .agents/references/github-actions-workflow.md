# GitHub Actions Workflow

## Scope
Repository automation for validation, docs deployment, and package releases.

## Active Workflows
| Workflow | Trigger | Responsibility |
| --- | --- | --- |
| [CI workflow](../../.github/workflows/ci.yml) | Pull requests to `main` | Run lint + tests and build the workspace. Docs build is conditional on docs-related file changes. |
| [Docs deploy workflow](../../.github/workflows/docs-deploy.yml) | Push to `main` + manual dispatch | Build and deploy VitePress docs to GitHub Pages when docs-related files change. |
| [Release workflow](../../.github/workflows/release.yml) | Push to `main` + manual dispatch | Build publishable packages and run Changesets to create release PRs or publish packages. |

## Shared Components
| Component | Location | Used by | Purpose |
| --- | --- | --- | --- |
| Setup composite action | [Setup action](../../.github/actions/setup/action.yml) | CI, docs deploy, release | Standardize pnpm + Node setup, dependency install, and Turbo cache restore. |
| Docs path filters | [Path filters](../../.github/path-filters.yml) | CI, docs deploy | Keep docs-change detection in one source of truth. |

## Release Model
- Stable releases are produced from `main`.
- Prerelease automation is not active.
- Trusted publishing should reference a single workflow path: [Release workflow](../../.github/workflows/release.yml).

## Related Docs
- [Git Workflow](git-workflow.md)
- [Docs Generation Workflow](docs-generation.md)
- [changesets skill](../skills/changesets/SKILL.md)
