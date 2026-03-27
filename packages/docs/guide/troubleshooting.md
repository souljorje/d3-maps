---
description: Troubleshooting guide for D3 SVG maps in React and Vue, including blank maps, misplaced markers, broken projections, and layer issues
---

# Troubleshooting

## Blank map

- Ensure the map container has a height (see [Responsiveness](/guide/core-concepts/#responsiveness))
- Ensure `data` is loaded before rendering [MapBase](/components/map-base)

## Markers appear in the wrong place

Coordinates are `[longitude, latitude]`

## Layers overlap unexpectedly

If something overlays incorrectly, render layers top-to-bottom in this order:

- `MapGraticule`
- `MapFeatures`
- `MapMesh`
- `MapMarker`
