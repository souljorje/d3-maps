# d3-maps

Reactive SVG maps, powered by D3.  
Works with Vue. React, Solid, and Svelte support coming soon.

[docs](https://souljorje.github.io/d3-maps)

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

### npm

```bash
# vue
pnpm add @d3-maps/vue
```

Coming soon

```bash
# react
pnpm add @d3-maps/react

# solid
pnpm add @d3-maps/solid

# svelte
pnpm add @d3-maps/svelte
```

## Development

```bash
pnpm install
pnpm build
pnpm docs:dev
pnpm docs:build
```

## Contributing

[Contributing Guide](CONTRIBUTING.md)

## License

MIT licensed. Copyright © 2026 Georgii Bukharov. See [LICENCE](./LICENCE) for more details.

## Inspired by

[react-simple-maps](https://github.com/zcreativelabs/react-simple-maps)
