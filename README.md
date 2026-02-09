# d3-maps

SVG maps made simple, reactive and responsive out of the box.  
Powered with [d3](https://github.com/d3/d3) and [topojson](https://github.com/TopoJSON/TopoJSON-client).  
Works with Vue. React, Solid, and Svelte support coming soon.

[docs](https://d3-maps.netlify.app/guide/) | [examples](https://d3-maps.netlify.app/examples/)

<!-- ![@d3-maps/vue](https://img.shields.io/bundlephobia/minzip/%40d3-maps/vue) -->

1. **Core** is framework-agnostic
   - Universal higher order logic
   - Map features models: georgaphies, markers, etc
   - Utilities for custom layers: zoom, choroplet, bubble, etc

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

### npm

```bash
# vue
npm add @d3-maps/vue
```

Coming soon

```bash
# react
npm add @d3-maps/react

# solid
npm add @d3-maps/solid

# svelte
npm add @d3-maps/svelte
```

## Development

```bash
pnpm install
pnpm build
pnpm lint
pnpm test
pnpm docs:dev
pnpm docs:build
```

## License

MIT licensed. Copyright © 2026 Georgii Bukharov. See [LICENSE](./LICENSE) for more details.

## Inspired by

[react-simple-maps](https://github.com/zcreativelabs/react-simple-maps)
