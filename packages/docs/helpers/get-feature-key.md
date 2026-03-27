---
description: Helper for stable GeoJSON feature IDs in D3 SVG maps
---

# getFeatureKey

Resolves a feature key from a GeoJSON feature

Use it when you need a stable identifier for rendering or DOM targeting

## Parameters

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `feature` | [MapFeature](/api/core/feature#mapfeature) | `—` | Feature to inspect |
| `idKey?` | `string` | `'id'` | Key checked on the feature and then on `feature.properties` |
| `fallback?` | `string \| number` | `—` | Optional fallback value returned when no key is found |

## Behavior

Checks in order:

1. `feature[idKey]`
2. `feature.properties?.[idKey]`
3. `fallback`

If no value is found and no fallback is provided, it returns `undefined`

## Usage

```ts
import { getFeatureKey } from '@d3-maps/core'

const key = getFeatureKey(feature)
const keyedBySlug = getFeatureKey(feature, 'slug')
const keyedWithFallback = getFeatureKey(feature, 'id', index)
```

See [feature API](/api/core/feature#getfeaturekey)
