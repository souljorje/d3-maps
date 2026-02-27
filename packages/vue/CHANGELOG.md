# @d3-maps/vue

## 0.5.1

### Patch Changes

- [#17](https://github.com/souljorje/d3-maps/pull/17) [`2798237`](https://github.com/souljorje/d3-maps/commit/2798237d5d1f90db7e61dca93bb84bba288a6be3) Thanks [@souljorje](https://github.com/souljorje)! - - Fixed `MapGraticule` fallthrough attrs/listener merging so forwarded handlers and attrs stay current across parent re-renders
  - Added Vue parity/regression tests for `MapGraticule` attrs/listener refresh behavior

## 0.5.0

### Minor Changes

- [#14](https://github.com/souljorje/d3-maps/pull/14) [`3b34758`](https://github.com/souljorje/d3-maps/commit/3b34758edcee9536756c819a35f7b18d373d8d7f) Thanks [@souljorje](https://github.com/souljorje)!
  - Added `MapGraticule` component
  - Simplified map-object interaction APIs and normalized SVG rendering behavior
  - Removed conditional path rendering in map layers and rendered SVG nodes consistently

### Patch Changes

- Updated dependencies [[`3b34758`](https://github.com/souljorje/d3-maps/commit/3b34758edcee9536756c819a35f7b18d373d8d7f)]:
  - @d3-maps/core@0.5.0

## 0.4.0

### Minor Changes

- [#10](https://github.com/souljorje/d3-maps/pull/10) [`aa5328d`](https://github.com/souljorje/d3-maps/commit/aa5328dfdb899560765f31df1b13af619e241d5b) Thanks [@souljorje](https://github.com/souljorje)!
  - Exported hooks, made map context updates reactive, and refined zoom wiring
  - Reused core shared zoom transform helpers for consistent zoom behavior

### Patch Changes

- Updated dependencies [[`aa5328d`](https://github.com/souljorje/d3-maps/commit/aa5328dfdb899560765f31df1b13af619e241d5b)]:
  - @d3-maps/core@0.4.0

## 0.3.0

### Minor Changes

- [#9](https://github.com/souljorje/d3-maps/pull/9) [`32c02ed`](https://github.com/souljorje/d3-maps/commit/32c02edcb10b3548cfe90a3e3f795cc560a8e281) Thanks [@souljorje](https://github.com/souljorje)!
  - Zoom: rename `modifiers` to `config`
  - Zoom: config is typed and allows to call all zoom methods
  - Zoom: remove `translateExtent` from zoom props, now availiable via `config.translateExtent`
  - Map: projectionConfig is typed and allows to call all projection methods

### Patch Changes

- Updated dependencies [[`32c02ed`](https://github.com/souljorje/d3-maps/commit/32c02edcb10b3548cfe90a3e3f795cc560a8e281)]:
  - @d3-maps/core@0.3.0

## 0.2.0

### Minor Changes

- [#1](https://github.com/souljorje/d3-maps/pull/1) [`0a18170`](https://github.com/souljorje/d3-maps/commit/0a1817080c318275645fce6fd74f1b2e428e20ae) Thanks [@souljorje](https://github.com/souljorje)! - Add a `MapMesh` component for rendering TopoJSON mesh paths

### Patch Changes

- Updated dependencies [[`0a18170`](https://github.com/souljorje/d3-maps/commit/0a1817080c318275645fce6fd74f1b2e428e20ae)]:
  - @d3-maps/core@0.2.0
