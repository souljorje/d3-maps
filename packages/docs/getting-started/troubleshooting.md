# Troubleshooting

## Blank map

- Ensure the map container has a height (see [Responsiveness guide](/getting-started/responsiveness)).
- Ensure `data` is loaded before rendering [Map](/components/map) (use `v-if`).

## Markers appear in the wrong place

Coordinates are `[longitude, latitude]`.

## Fetch errors

If you fetch TopoJSON/GeoJSON from a third-party source, make sure:

- the URL is accessible from the browser (CORS)
- you use HTTPS in production
