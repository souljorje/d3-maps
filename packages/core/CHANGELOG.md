# @d3-maps/core

## 0.16.0

### Minor Changes

- [#48](https://github.com/souljorje/d3-maps/pull/48) [`0a73c16`](https://github.com/souljorje/d3-maps/commit/0a73c16139be60d4d4d07dcce02b7347e852e8f7) Thanks [@souljorje](https://github.com/souljorje)! - - Reordered zoom command parameters so `transition` comes before `point`.
  - Changed `zoomToFeature` to accept `padding` and `transition` as positional arguments.

## 0.15.0

### Minor Changes

- [#45](https://github.com/souljorje/d3-maps/pull/45) [`e44054f`](https://github.com/souljorje/d3-maps/commit/e44054f63a2b4e5495de6c0f06868f5c4819b285) Thanks [@souljorje](https://github.com/souljorje)! - - Removed `center`/`zoom` props from zoom
  - Added programmatic methods for zoom: `transform`, `translateBy`, `translateTo`, `scaleBy`, `scaleTo`, `scaleWith`, `zoomToFeature`, and `reset`
  - Fixed map object components inside `MapZoom` to avoid rerendering on controlled zoom state updates when they only need zoom presence
  - Added feature change event/callback to MapFeature

## 0.14.0

### Minor Changes

- [#43](https://github.com/souljorje/d3-maps/pull/43) [`1ccc793`](https://github.com/souljorje/d3-maps/commit/1ccc793140103f075a4782b6f4356a607a026b20) Thanks [@souljorje](https://github.com/souljorje)! - - Turned `MapSphere` into a wrapper that renders separate background, content, and border layers.
  - Added `noClip` to opt out of sphere clipping.

## 0.13.0

### Minor Changes

- [#40](https://github.com/souljorje/d3-maps/pull/40) [`5d93205`](https://github.com/souljorje/d3-maps/commit/5d93205583c933ebc86b05368f7a56c5ccff17af) Thanks [@souljorje](https://github.com/souljorje)! - - Move data prop from MapBase to MapFeatures
  - Normalized MapFeatures inputs and transformer output around GeoJSON feature data
  - Changed styling prop from `name` to `data-d3m`
  - Split sphere rendering from graticule rendering with dedicated MapSphere support
  - Replaced MapObject-facing APIs with MapElement and interaction naming

## 0.12.0

### Minor Changes

- [#38](https://github.com/souljorje/d3-maps/pull/38) [`e28d478`](https://github.com/souljorje/d3-maps/commit/e28d478b66f1ba123accdf6dc81998c444f3c15d) Thanks [@souljorje](https://github.com/souljorje)! - - Added support for passing multiple GeoJSON and TopoJSON map data inputs into the core map context
  - Added projection fit modes for fitting to the sphere, all normalized features, or a selected feature object

## 0.11.0

### Minor Changes

- [#35](https://github.com/souljorje/d3-maps/pull/35) [`a95776e`](https://github.com/souljorje/d3-maps/commit/a95776edd67d00057fa258610a6c9cde6993b022) Thanks [@souljorje](https://github.com/souljorje)! - - Added `topologyObjectKey` support for selecting a specific TopoJSON object

## 0.10.0

### Minor Changes

- [#31](https://github.com/souljorje/d3-maps/pull/31) [`bae85e7`](https://github.com/souljorje/d3-maps/commit/bae85e74ed653f64c0818b6a2cca07b328f61746) Thanks [@souljorje](https://github.com/souljorje)! - - Renamed the core types: `MapFeature` -> `MapFeatureData`, `MapMesh` -> `MapMeshData`
  - Switched to explicit stylesheet imports via `@d3-maps/react/index.css` and `@d3-maps/vue/index.css`
  - Re-exported core types and common helper functions from the adapter roots
  - Improved the published browser bundles so CDN builds no longer rely on unexpected external globals

## 0.9.0

### Minor Changes

- [#27](https://github.com/souljorje/d3-maps/pull/27) [`d10d18a`](https://github.com/souljorje/d3-maps/commit/d10d18accbfda2776da1b5e10d91f6caa8fad959) Thanks [@souljorje](https://github.com/souljorje)! - - Added `useMapContext` for composing map-aware UI
  - Add focus state support for styling
  - Added `useMapZoom` hook
  - Added `getObjectZoomView` for zooming to object

## 0.8.0

### Minor Changes

- [#25](https://github.com/souljorje/d3-maps/pull/25) [`9e94ed0`](https://github.com/souljorje/d3-maps/commit/9e94ed0ce8ce18fc11cc7bd45066c7516b5e0577) Thanks [@souljorje](https://github.com/souljorje)! - - Added `MapLine` for rendering geographic and cartesian line paths
  - Added `MapAnnotation` for anchoring callout content to map coordinates with connector lines

## 0.7.0

### Minor Changes

- [#23](https://github.com/souljorje/d3-maps/pull/23) [`c961754`](https://github.com/souljorje/d3-maps/commit/c961754f2b0f1790d07ae5c6f111645fd41ead6d) Thanks [@souljorje](https://github.com/souljorje)! - rename shared component input types to use the props suffix

## 0.6.0

### Minor Changes

- [#20](https://github.com/souljorje/d3-maps/pull/20) [`8eddfc6`](https://github.com/souljorje/d3-maps/commit/8eddfc69e82d6e2760f14dcafeb63660e0cd4f25) Thanks [@souljorje](https://github.com/souljorje)! - - Enabled missed `mouseup` recovery automatically for map objects rendered inside `MapZoom`

## 0.5.0

### Minor Changes

- [#14](https://github.com/souljorje/d3-maps/pull/14) [`3b34758`](https://github.com/souljorje/d3-maps/commit/3b34758edcee9536756c819a35f7b18d373d8d7f) Thanks [@souljorje](https://github.com/souljorje)!
  - Added `MapGraticule` component
  - Simplified map-object interaction APIs and normalized SVG rendering behavior
  - Removed conditional path rendering in map layers and rendered SVG nodes consistently

## 0.4.0

### Minor Changes

- [#10](https://github.com/souljorje/d3-maps/pull/10) [`aa5328d`](https://github.com/souljorje/d3-maps/commit/aa5328dfdb899560765f31df1b13af619e241d5b) Thanks [@souljorje](https://github.com/souljorje)!
  - Added shared zoom transform helpers to keep adapter zoom behavior consistent

## 0.3.0

### Minor Changes

- [#9](https://github.com/souljorje/d3-maps/pull/9) [`32c02ed`](https://github.com/souljorje/d3-maps/commit/32c02edcb10b3548cfe90a3e3f795cc560a8e281) Thanks [@souljorje](https://github.com/souljorje)!
  - Zoom: rename `modifiers` to `config`
  - Zoom: config is typed and allows to call all zoom methods
  - Zoom: remove `translateExtent` from zoom props, now availiable via `config.translateExtent`
  - Map: projectionConfig is typed and allows to call all projection methods

## 0.2.0

### Minor Changes

- [#1](https://github.com/souljorje/d3-maps/pull/1) [`0a18170`](https://github.com/souljorje/d3-maps/commit/0a1817080c318275645fce6fd74f1b2e428e20ae) Thanks [@souljorje](https://github.com/souljorje)! - Add TopoJSON mesh helpers to map context
