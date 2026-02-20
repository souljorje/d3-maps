# d3-maps

Reactive SVG maps, powered by D3.  
Works with Vue and React. Solid and Svelte support coming soon.

[![CI](https://github.com/souljorje/d3-maps/actions/workflows/ci.yml/badge.svg)](https://github.com/souljorje/d3-maps/actions/workflows/ci.yml) [![Deploy Docs](https://github.com/souljorje/d3-maps/actions/workflows/docs-deploy.yml/badge.svg)](https://github.com/souljorje/d3-maps/actions/workflows/docs-deploy.yml)

[Docs site](https://souljorje.github.io/d3-maps)

<!-- ![@d3-maps/vue](https://img.shields.io/bundlephobia/minzip/%40d3-maps/vue) -->

1. **Core** is framework-agnostic
   - Universal higher order logic
   - Map objects models: features, markers, etc
   - Utilities for custom layers: zoom, choropleth, bubble, etc

2. **Adapters** are framework-specific
   - Vue / React / Svelte / Solid bindings
   - Rendering and reactivity integration
   - Declarative components and composables (hooks)

The core never depends on a framework.
Adapters depend on the core.

## Features

- SSR friendly
- Lightweight and tree-shakable
- Automatic rerender
- Zoom and drag on all devices
- Customize map with any objects
- Automatic transform lightweight TopoJSON to functional GeoJSON

## Installation

### pnpm

```bash
# vue
pnpm add @d3-maps/vue

# react
pnpm add @d3-maps/react
```

### npm

```bash
npm install @d3-maps/vue
npm install @d3-maps/react
```

### bun

```bash
bun add @d3-maps/vue
bun add @d3-maps/react
```

Coming soon adapters

```bash
# solid
pnpm add @d3-maps/solid

# svelte
pnpm add @d3-maps/svelte
```

## Development

```bash
pnpm install
pnpm build
pnpm dev
```

## Contributing

[Contributing Guide](CONTRIBUTING.md)

## License

MIT licensed. Copyright © 2026 Georgii Bukharov. See [LICENCE](./LICENCE) for more details.

## Inspired by

[react-simple-maps](https://github.com/zcreativelabs/react-simple-maps)
