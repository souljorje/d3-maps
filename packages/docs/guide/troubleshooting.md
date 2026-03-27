# Troubleshooting

## Blank map

- Ensure the map container has a height (see [Responsiveness](/guide/core-concepts/#responsiveness))
- Ensure `data` is loaded before rendering [MapBase](/components/map-base)
- Ensure you imported [default stylesheet](/guide/core-concepts/#css) or defined width and height for the map

## Markers appear in the wrong place

Coordinates are `[longitude, latitude]`

## Layers overlap unexpectedly

If something overlays incorrectly, render layers top-to-bottom in this order:

- `MapGraticule`
- `MapFeatures`
- `MapMesh`
- `MapMarker`
