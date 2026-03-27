---
"@d3-maps/core": minor
"@d3-maps/react": minor
"@d3-maps/vue": minor
---

- Renamed the core  types: `MapFeature` -> `MapFeatureData`, `MapMesh` -> `MapMeshData`
- Switched to explicit stylesheet imports via `@d3-maps/react/index.css` and `@d3-maps/vue/index.css`
- Re-exported core types and common helper functions from the adapter roots
- Improved the published browser bundles so CDN builds no longer rely on unexpected external globals
