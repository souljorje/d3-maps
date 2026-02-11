# Introduction

d3-maps is a small set of building blocks for creating SVG maps with D3 projections — with framework adapters for reactivity and rendering.

## Architecture

The core provides framework-agnostic complex logic.  
Adapters implement the core in a simple way.

- **Core** `@d3-maps/core`
  - Context creation, data transformation
  - Map layers types and models: features, markers, zoom, etc
  - Utilities for custom layers: choropleth, bubble, etc
- **Adapters** `@d3-maps/<framework>`
  - Vue / React / Svelte / Solid bindings
  - Rendering and reactivity integration
  - Declarative components and composables (hooks)

## Mental model

1) Provide map **data** (TopoJSON or GeoJSON).
2) Provide a **projection** (or use defaults).
3) Render **features** (paths) and add **custom SVG layers** (markers, labels, overlays).
4) Add optional **zoom/drag** behavior.
