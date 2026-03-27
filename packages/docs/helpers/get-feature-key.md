# getFeatureKey

Resolves a feature key from a GeoJSON feature

Use it when you need a stable identifier for rendering or DOM targeting

## Parameters

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `feature` | [MapFeatureData](/api/core/feature#mapfeaturedata) | `—` | Feature to inspect |
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
const key = getFeatureKey(feature)
const keyedBySlug = getFeatureKey(feature, 'slug')
const keyedWithFallback = getFeatureKey(feature, 'id', index)
```

See [feature API](/api/core/feature#getfeaturekey)
