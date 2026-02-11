# docs Guide

Documentation site for d3-maps

## Scope

- Content: [packages/docs/getting-started/index.md](./getting-started/index.md), [packages/docs/components/index.md](./components/index.md), [packages/docs/examples/index.md](./examples/index.md), [packages/docs/api/core/index.md](./api/core/index.md), [packages/docs/index.md](./index.md)
- Config/theme: [packages/docs/.vitepress/config.js](./.vitepress/config.js), [packages/docs/.vitepress/theme/index.js](./.vitepress/theme/index.js)
- Static assets: [packages/docs/public/d3-maps-logo.svg](./public/d3-maps-logo.svg)
- Nested guides: [packages/docs/examples/AGENTS.md](./examples/AGENTS.md), [packages/docs/api/AGENTS.md](./api/AGENTS.md)

## Commands

Run from repo root:

- `pnpm --filter docs dev`
- `pnpm --filter docs build`
- `pnpm --filter docs preview`
- `pnpm docs:gen:examples`
- `pnpm typedoc`
- `pnpm docs:gen`
- `pnpm docs:build`
- `git push` triggers `pre-push` hook running `pnpm docs:build`

## Conventions

- Keep navigation and site config in [packages/docs/.vitepress/config.js](./.vitepress/config.js).
- Prefer editing markdown content under [packages/docs/getting-started/index.md](./getting-started/index.md), [packages/docs/components/index.md](./components/index.md), and [packages/docs/examples/index.md](./examples/index.md).
- Keep getting-started topic pages flat under `packages/docs/getting-started/*.md` (no nested `getting-started/concepts` folder).
- Demo source-of-truth is `packages/docs/.vitepress/examples/*.vue` and demos are rendered via stable ids in `<Demo component-name="...">`.
- Demo preview components are registered globally in [packages/docs/.vitepress/theme/index.js](./.vitepress/theme/index.js) from `packages/docs/.vitepress/examples/*.vue` (no virtual demo module).
- Example wrapper pages are generated into [packages/docs/examples/index.md](./examples/index.md) by [scripts/docs-gen-examples.mjs](./../../scripts/docs-gen-examples.mjs); do not hand-edit generated wrapper files.
- Use native VitePress `::: code-group` in Demo slots for source tabs; keep source-tab logic out of `Demo.vue`.
- Prefer Tailwind utility classes in theme Vue components; keep [packages/docs/.vitepress/theme/custom.css](./.vitepress/theme/custom.css) for global VitePress overrides only.
- Prefer `pnpm docs:build` for end-to-end docs validation (generation + VitePress build).
