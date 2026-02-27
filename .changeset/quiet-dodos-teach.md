---
'@d3-maps/vue': patch
---

- Fixed `MapGraticule` fallthrough attrs/listener merging so forwarded handlers and attrs stay current across parent re-renders
- Added Vue parity/regression tests for `MapGraticule` attrs/listener refresh behavior
