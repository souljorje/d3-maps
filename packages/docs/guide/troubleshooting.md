# Troubleshooting

## Blank map

- Ensure the map container has a height (see [Responsiveness](/guide/core-concepts/#responsiveness))
- Ensure `data` is loaded before rendering [Map](/components/map)

## Markers appear in the wrong place

Coordinates are `[longitude, latitude]`

## Fetch errors

If you fetch TopoJSON/GeoJSON from a third-party source, make sure:

- the URL is accessible from the browser (CORS)
- you use HTTPS in production
