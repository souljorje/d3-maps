# @d3-maps/react

## 0.7.0

### Minor Changes

- [#31](https://github.com/souljorje/d3-maps/pull/31) [`bae85e7`](https://github.com/souljorje/d3-maps/commit/bae85e74ed653f64c0818b6a2cca07b328f61746) Thanks [@souljorje](https://github.com/souljorje)! - - Renamed the core types: `MapFeature` -> `MapFeatureData`, `MapMesh` -> `MapMeshData`
  - Switched to explicit stylesheet imports via `@d3-maps/react/index.css` and `@d3-maps/vue/index.css`
  - Re-exported core types and common helper functions from the adapter roots
  - Improved the published browser bundles so CDN builds no longer rely on unexpected external globals

### Patch Changes

- Updated dependencies [[`bae85e7`](https://github.com/souljorje/d3-maps/commit/bae85e74ed653f64c0818b6a2cca07b328f61746)]:
  - @d3-maps/core@0.10.0

## 0.6.0

### Minor Changes

- [#27](https://github.com/souljorje/d3-maps/pull/27) [`d10d18a`](https://github.com/souljorje/d3-maps/commit/d10d18accbfda2776da1b5e10d91f6caa8fad959) Thanks [@souljorje](https://github.com/souljorje)! - - Added `useMapContext` for composing map-aware UI
  - Add focus state support for styling
  - Added `useMapZoom` hook
  - Added `getObjectZoomView` for zooming to object

### Patch Changes

- Updated dependencies [[`d10d18a`](https://github.com/souljorje/d3-maps/commit/d10d18accbfda2776da1b5e10d91f6caa8fad959)]:
  - @d3-maps/core@0.9.0

## 0.5.0

### Minor Changes

- [#25](https://github.com/souljorje/d3-maps/pull/25) [`9e94ed0`](https://github.com/souljorje/d3-maps/commit/9e94ed0ce8ce18fc11cc7bd45066c7516b5e0577) Thanks [@souljorje](https://github.com/souljorje)! - - Added `MapLine` for rendering geographic and cartesian line paths
  - Added `MapAnnotation` for anchoring callout content to map coordinates with connector lines

### Patch Changes

- Updated dependencies [[`9e94ed0`](https://github.com/souljorje/d3-maps/commit/9e94ed0ce8ce18fc11cc7bd45066c7516b5e0577)]:
  - @d3-maps/core@0.8.0

## 0.4.0

### Minor Changes

- [#23](https://github.com/souljorje/d3-maps/pull/23) [`c961754`](https://github.com/souljorje/d3-maps/commit/c961754f2b0f1790d07ae5c6f111645fd41ead6d) Thanks [@souljorje](https://github.com/souljorje)! - Renamed `Map` component to `MapBase`.

- [#23](https://github.com/souljorje/d3-maps/pull/23) [`c961754`](https://github.com/souljorje/d3-maps/commit/c961754f2b0f1790d07ae5c6f111645fd41ead6d) Thanks [@souljorje](https://github.com/souljorje)! - rename shared component input types to use the props suffix

### Patch Changes

- Updated dependencies [[`c961754`](https://github.com/souljorje/d3-maps/commit/c961754f2b0f1790d07ae5c6f111645fd41ead6d)]:
  - @d3-maps/core@0.7.0

## 0.3.0

### Minor Changes

- [#20](https://github.com/souljorje/d3-maps/pull/20) [`8eddfc6`](https://github.com/souljorje/d3-maps/commit/8eddfc69e82d6e2760f14dcafeb63660e0cd4f25) Thanks [@souljorje](https://github.com/souljorje)! - - Enabled missed `mouseup` recovery automatically for map objects rendered inside `MapZoom`

### Patch Changes

- Updated dependencies [[`8eddfc6`](https://github.com/souljorje/d3-maps/commit/8eddfc69e82d6e2760f14dcafeb63660e0cd4f25)]:
  - @d3-maps/core@0.6.0

## 0.2.0

### Minor Changes

- [#14](https://github.com/souljorje/d3-maps/pull/14) [`3b34758`](https://github.com/souljorje/d3-maps/commit/3b34758edcee9536756c819a35f7b18d373d8d7f) Thanks [@souljorje](https://github.com/souljorje)!
  - Added `MapGraticule` component
  - Simplified map-object interaction APIs and normalized SVG rendering behavior
  - Removed conditional path rendering in map layers and rendered SVG nodes consistently

### Patch Changes

- Updated dependencies [[`3b34758`](https://github.com/souljorje/d3-maps/commit/3b34758edcee9536756c819a35f7b18d373d8d7f)]:
  - @d3-maps/core@0.5.0

## 0.1.0

### Minor Changes

- [#10](https://github.com/souljorje/d3-maps/pull/10) [`aa5328d`](https://github.com/souljorje/d3-maps/commit/aa5328dfdb899560765f31df1b13af619e241d5b) Thanks [@souljorje](https://github.com/souljorje)!
  - `@d3-maps/react` first release 🎉

### Patch Changes

- Updated dependencies [[`aa5328d`](https://github.com/souljorje/d3-maps/commit/aa5328dfdb899560765f31df1b13af619e241d5b)]:
  - @d3-maps/core@0.4.0
