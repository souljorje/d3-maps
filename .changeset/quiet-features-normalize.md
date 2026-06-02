---
'@d3-maps/core': minor
'@d3-maps/react': minor
'@d3-maps/vue': minor
---

- Move data prop from MapBase to MapFeatures
- Normalized MapFeatures inputs and transformer output around GeoJSON feature data
- Changed styling prop from `name` to `data-d3m`
- Split sphere rendering from graticule rendering with dedicated MapSphere support
- Replaced MapObject-facing APIs with MapElement and interaction naming
