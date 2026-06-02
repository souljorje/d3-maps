---
description: Helper for stable map feature keys in D3 SVG maps
---

# getFeatureKey

Resolves a key from a normalized map feature.

Use it when you need a stable identifier for rendering or DOM targeting

## Parameters

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `item` | [MapFeatureData](/api/core/data#mapfeaturedata) | `—` | Feature or geometry to inspect |
| `fallback` | `string \| number` | `—` | Fallback when no stable key is found |

## Behavior

Checks in order:

1. `item.id`
2. `item.properties?.id`
3. `item.properties?.name`
4. `fallback`

## Usage

```ts
const key = getFeatureKey(item, fallback)
```

See [feature API](/api/core/feature#getfeaturekey)
