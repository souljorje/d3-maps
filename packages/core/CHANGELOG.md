# @d3-maps/core

## 0.5.0

### Minor Changes

- [#14](https://github.com/souljorje/d3-maps/pull/14) [`3b34758`](https://github.com/souljorje/d3-maps/commit/3b34758edcee9536756c819a35f7b18d373d8d7f) Thanks [@souljorje](https://github.com/souljorje)! - - Added `MapGraticule` component
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
