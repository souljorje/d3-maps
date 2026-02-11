# D3-maps

## Goal

Make map creation with D3 simple, reactive, and responsive out of the box, across frameworks.

## Package Guides

- [packages/core/AGENTS.md](./packages/core/AGENTS.md)
- [packages/vue/AGENTS.md](./packages/vue/AGENTS.md)
- [packages/docs/AGENTS.md](./packages/docs/AGENTS.md)

## Repository Layout

```text
├─ packages/
  ├─ docs/  # VitePress unified docs site
  ├─ core/  # framework-agnostic core utilities (@d3-maps/core)
  ├─ vue/   # Vue adapter (@d3-maps/vue)
  # planned
  ├─ react/  # React adapter
  ├─ svelte/ # Svelte adapter
  └─ solid/  # Solid adapter
```

## Stack

- Language: TypeScript (ESM)
- Build: Tsdown
- Tests: Vitest
- Docs: VitePress
- Package manager: pnpm workspaces (Node >= 20)

## Common Commands (root)

- `pnpm install`

| Command | Description |
| --- | --- |
| `pnpm dev` | Run docs dev server (`docs` workspace). |
| `pnpm build` | Build core, vue, and docs packages. |
| `pnpm test` | Run core and vue test suites. |
| `pnpm docs:dev` | Run VitePress docs in dev mode. |
| `pnpm docs:gen:examples` | Generate docs example wrapper pages from `.vitepress/examples`. |
| `pnpm typedoc` | Generate API reference docs via TypeDoc. |
| `pnpm docs:gen` | Run all docs generation steps. |
| `pnpm docs:build` | Generate docs and build VitePress site. |
| `pnpm docs:preview` | Preview built docs site. |
| `pnpm lint` | Run ESLint. |
| `pnpm lintfix` | Run ESLint with auto-fix. |

## Commit & Pull Request Guidelines

Follow the [Conventional Commits v1.0.0](https://www.conventionalcommits.org/en/v1.0.0/).

- Format: type(scope): summary
- Types: feat, fix, docs, style, refactor, test, chore
- Examples:
  - feat(product): add product detail page
  - fix(auth): handle token refresh edge case

## Conventions

- ALWAYS update (all nested) AGENTS.md files when facing relevant updates
- Use `pnpm --filter <pkg>` for package-specific scripts.
- Follow ESLint rules from [eslint.config.js](./eslint.config.js).
- Paradigm: Prefer functional and declarative programming patterns
- Declarativity: Prefix boolean props/variables with is, has, should (e.g., isLoading, hasError)
- Prefer the most elegant and short solution; avoid premature optimization.
- For type assertions, null checks, and sharable abstract helpers, copy needed functions from [https://github.com/souljorje/utilities](https://github.com/souljorje/utilities) into [./packages/core/src/lib/utils.ts](./packages/core/src/lib/utils.ts), then consume them across packages.

## Do

- ALWAYS install latest stable package version initially
- ALWAYS use context7 MCP when working with third-party packages for the latest guides and code patterns
- ALWAYS write file mentions as short relative links in .md files e.g. `[./src/index.ts](./src/index.ts)`
- Use tree-style folder structure in .md files

## Don’t

- NEVER use ` in link titles in .md files

## When stuck

- Ask for clarification when changing public API or build outputs.
