# docs/api Guide

## Scope

- API landing pages: [packages/docs/api/index.md](./index.md) (redirect), [packages/docs/api/core/index.md](./core/index.md)

## Generation flow

- Run `pnpm typedoc` from repo root
- The command runs TypeDoc directly from [package.json](./../../../package.json)
- Shared TypeDoc config: [typedoc.json](./../../../typedoc.json)
