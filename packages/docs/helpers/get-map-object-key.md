---
description: Helper for stable map object keys in D3 SVG maps
---

# getMapObjectKey

Resolves a key from a normalized map object

Use it when you need a stable identifier for rendering or DOM targeting

## Parameters

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `item` | `MapDataItem` | `—` | Feature or geometry to inspect |
| `index` | `number` | `—` | Index fallback when no stable key is found |

## Behavior

Checks in order:

1. `item.id`
2. `item.properties?.id`
3. `item.properties?.name`
4. `index`

## Usage

```ts
const key = getMapObjectKey(item, index)
```

See [mapObject API](/api/core/mapObject#getmapobjectkey)
