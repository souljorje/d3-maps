---
description: Helper for stable map feature keys in D3 SVG maps
---

# getFeatureKey

Resolves a key from a normalized map feature

Use it when you need a stable identifier for rendering or DOM targeting

## Parameters

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `item` | `MapFeatureData` | `—` | Feature or geometry to inspect |
| `index` | `number` | `—` | Index fallback when no stable key is found |

## Behavior

Checks in order:

1. `item.id`
2. `item.properties?.id`
3. `item.properties?.name`
4. `index`

## Usage

```ts
const key = getFeatureKey(item, index)
```

See [data API](/api/core/data#getfeaturekey)
