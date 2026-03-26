# @d3-maps/core

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
