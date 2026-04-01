# d3-maps <img src="https://raw.githubusercontent.com/souljorje/d3-maps/refs/heads/main/packages/docs/public/d3-maps-logo.svg" alt ="d3-maps logo" width="20" height="20"> [![CI](https://github.com/souljorje/d3-maps/actions/workflows/ci.yml/badge.svg)](https://github.com/souljorje/d3-maps/actions/workflows/ci.yml) [![Netlify Status](https://api.netlify.com/api/v1/badges/619b15fb-c666-48ed-9715-894474c88e35/deploy-status)](https://d3-maps.netlify.app)

Interactive SVG maps for React and Vue powered by D3.  
Solid and Svelte support coming soon.

<!-- ![@d3-maps/vue](https://img.shields.io/bundlephobia/minzip/%40d3-maps/vue) -->

[**Docs**](https://d3-maps.netlify.app/guide) · [**Examples**](https://d3-maps.netlify.app/examples)

## Features

✨ Drop-in components, powerful defaults  
🧩 Zoom, drag, lines, markers, and more  
⚛️ Reactive rendering  
📱 Responsive by default  
🪶 Lightweight and tree-shakable  
🧑‍💻 Fully typed  
🗄️ SSR friendly  
🗺️ Supports TopoJSON and GeoJSON

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

## Installation

### Vue

```bash
pnpm add @d3-maps/vue
```

```bash
npm install @d3-maps/vue
```

```bash
bun add @d3-maps/vue
```

```html
<script src="https://cdn.jsdelivr.net/npm/@d3-maps/vue"></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@d3-maps/vue/index.css" />
```

### React

```bash
pnpm add @d3-maps/react
```

```bash
npm install @d3-maps/react
```

```bash
bun add @d3-maps/react
```

```html
<script src="https://cdn.jsdelivr.net/npm/@d3-maps/react"></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@d3-maps/react/index.css" />
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
