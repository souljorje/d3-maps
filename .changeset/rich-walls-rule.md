---
'@d3-maps/react': patch
---

- Migrate from `useContext` to React 19 `use()` API in `useMapContext` and `useInteraction`
- Replace `useEffect` with synchronous callback in `MapFeatures` to avoid extra render
