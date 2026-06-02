---
description: Explanation of the d3-maps core architecture and adapter responsibilities
---

# Architecture

`d3-maps` separates shared map logic from framework rendering

## Core

`@d3-maps/core` owns framework-agnostic complex logic

- Rendering context and lifecycle
- Map layers models: features, markers, zoom, etc
- Data normalization
- Shared types

## Adapters

`@d3-maps/react` and `@d3-maps/vue`*  
implement framework-specific integrations using `core`

- Components and hooks
- Reactivity for props, state, and events
- Native SVG rendering

<sup>\*`@d3-maps/svelte` and `@d3-maps/solid` coming soon</sup>
