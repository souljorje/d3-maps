---
'@d3-maps/react': patch
---

- Fixed `MapZoom` callback wiring to use stable handler refs with D3 zoom behaviors
- Fixed map object components inside `MapZoom` to avoid rerendering on controlled zoom state updates when they only need zoom presence
