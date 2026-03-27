<img src="https://raw.githubusercontent.com/souljorje/d3-maps/refs/heads/main/packages/docs/public/d3-maps-logo.svg" alt ="d3-maps logo" width="100" height="100">

# d3-maps

Simple SVG maps powered by D3.  
Works with Vue and React. Solid and Svelte support coming soon.

[![CI](https://github.com/souljorje/d3-maps/actions/workflows/ci.yml/badge.svg)](https://github.com/souljorje/d3-maps/actions/workflows/ci.yml) [![Deploy Docs](https://github.com/souljorje/d3-maps/actions/workflows/docs-deploy.yml/badge.svg)](https://github.com/souljorje/d3-maps/actions/workflows/docs-deploy.yml) [![vue size](https://deno.bundlejs.com/badge?q=@d3-maps/vue&badge=detailed)](https://bundlejs.com/?q=@d3-maps/vue) [![react size](https://deno.bundlejs.com/badge?q=@d3-maps/react&badge=detailed)](https://bundlejs.com/?q=@d3-maps/react)

[**Docs**](https://souljorje.github.io/d3-maps/guide) · [**Examples**](https://souljorje.github.io/d3-maps/examples)

<!-- ![@d3-maps/vue](https://img.shields.io/bundlephobia/minzip/%40d3-maps/vue) -->

## Architecture

**Core** is framework-agnostic

- Universal higher order logic
- Map objects models: features, markers, etc
- Utilities for custom layers: zoom, choropleth, bubble, etc

**Adapters** are framework-specific

- Vue and React bindings
- Rendering and reactivity integration
- Declarative components and composables

The core never depends on a framework.
Adapters depend on the core.

## Features

- Drop-in components, powerful defaults
- Zoom, drag, lines, markers, and more
- Reactive rerender
- Responsive by default
- Lightweight and tree-shakable
- SSR friendly
- Supports TopoJSON and GeoJSON

## Installation

### pnpm

```bash
pnpm add @d3-maps/vue
```

```bash
pnpm add @d3-maps/react
```

### npm

```bash
npm install @d3-maps/vue
```

```bash
npm install @d3-maps/react
```

### bun

```bash
bun add @d3-maps/vue
```

```bash
bun add @d3-maps/react
```

## Development

```bash
pnpm install
pnpm build
pnpm dev
```

## Contributing

See the [Contributing Guide](CONTRIBUTING.md)

## License

MIT licensed. Copyright © 2026 Georgii Bukharov. See [LICENCE](./LICENCE) for more details.

## Inspired by

[react-simple-maps](https://github.com/zcreativelabs/react-simple-maps)
