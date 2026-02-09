# docs Guide

Unified documentation site for @d3-maps across frameworks.

## Scope

- Content: [packages/docs/guide](./guide), [packages/docs/api](./api), [packages/docs/examples](./examples), [packages/docs/index.md](./index.md)
- Config/theme: [packages/docs/.vitepress](./.vitepress)
- Static assets: [packages/docs/public](./public)

## Commands

Run from repo root:

- `pnpm --filter docs dev`
- `pnpm --filter docs build`
- `pnpm --filter docs preview`

## Conventions

- Keep navigation and site config in [packages/docs/.vitepress/config.js](./.vitepress/config.js).
- Prefer editing markdown content under [packages/docs/guide](./guide), [packages/docs/api](./api), and [packages/docs/examples](./examples); 
- Keep examples in sync with current package names and frameworks.
- When demonstrating zoom scaling, prefer @d3-maps/core helpers in examples.
