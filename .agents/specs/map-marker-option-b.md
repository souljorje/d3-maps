# MapMarker Option B Spec

## Status

Deferred. Current implementation stays on Option A.

## Context`

Option A keeps marker input explicit and declarative:

- `coordinates: [number, number]`

Option B is a future extension where marker position can be derived from GeoJSON-like inputs.

## Goal (Option B)

Allow `MapMarker` to accept richer geospatial inputs while still rendering one marker transform.

## Proposed Input Model

- Keep `coordinates` support.
- Add one derived-input prop:
  - `data`: `GeometryObject | Feature`

Priority if both are provided:

1. `coordinates`
2. `data`

## Resolution Rules

1. If `data` is `Point`, use `coordinates` from the geometry.
2. If `data` is `Feature<Point>`, use `geometry.coordinates`.
3. If `data` is any non-point geometry, derive a representative point (centroid strategy).
4. If point resolution fails, use fallback transform (`translate(0, 0)`).

## Core Responsibilities

Add pure helpers in core:

- Type guards for Geometry vs Feature.
- Point extraction from supported inputs.
- Representative-point resolver for non-point geometries.
- Marker transform formatter from resolved point + projection.

Vue adapter responsibilities:

- Pass props to core helpers.
- Bind returned transform and shared interaction handlers.

## Open Design Choices

- Representative point strategy for non-point geometries:
  - geometric centroid
  - bounds center
  - first coordinate fallback
- Whether non-point support is enabled by default or behind explicit config.

## Risks

- Extra complexity vs Option A simplicity.
- Ambiguous semantics for non-point geometries.
- Potential performance cost for centroid calculations on large geometries.

## Suggested File Targets (Future)

```text
.agents/
  specs/
    map-marker-option-b.md
packages/
  core/
    src/lib/
      marker.ts
      mapObject.ts
    tests/
      marker.spec.ts
      mapObject.spec.ts
  vue/
    src/components/
      MapMarker.vue
```

## Related Files

- [./packages/core/src/lib/marker.ts](./packages/core/src/lib/marker.ts)
- [./packages/vue/src/components/MapMarker.vue](./packages/vue/src/components/MapMarker.vue)
- [./packages/vue/src/components/MapFeature.vue](./packages/vue/src/components/MapFeature.vue)
