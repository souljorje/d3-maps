---
'@d3-maps/core': minor
'@d3-maps/react': minor
'@d3-maps/vue': minor
---

- Added programmatic methods for zoom: `transform`, `translateBy`, `translateTo`, `scaleBy`, `scaleTo`, `scaleWith`, `zoomToFeature`, and `reset`
- Fixed map object components inside `MapZoom` to avoid rerendering on controlled zoom state updates when they only need zoom presence
- Added feature change event/callback to MapFeature
