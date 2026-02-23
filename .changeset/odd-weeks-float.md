---
'@d3-maps/core': minor
'@d3-maps/vue': minor
---

Rename zoom `modifiers` to `config` and move zoom extent overrides to `config.translateExtent`

Remove direct `translateExtent` from zoom props and keep projection/zoom config application consistent across core and Vue APIs
