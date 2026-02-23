[@d3-maps/core](index.md) / feature

# feature

## Table of contents

* [Functions](#functions)
  * [getFeatureKey()](#getfeaturekey)
* [Interfaces](#interfaces)
  * [MapFeatureProps](#mapfeatureprops)
* [Type Aliases](#type-aliases)
  * [MapFeature](#mapfeature)

## Functions

### getFeatureKey()

```ts
function getFeatureKey(
   feature: MapFeature, 
   idKey?: string, 
   index: number): string | number;
```

Resolves a stable key for a feature.

Checks:

1. `feature[idKey]`
2. `feature.properties[idKey]`
3. fallback to the list index

#### Parameters

| Parameter | Type | Default value |
| ------ | ------ | ------ |
| `feature` | [`MapFeature`](#mapfeature) | `undefined` |
| `idKey` | `string` | `'id'` |
| `index` | `number` | `undefined` |

#### Returns

`string` | `number`

## Interfaces

### MapFeatureProps

Shared props contract for a single rendered feature.

#### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `TStyle` | `unknown` |

#### Properties

| Property | Type |
| ------ | ------ |
| <a id="property-data"></a> `data` | [`MapFeature`](#mapfeature) |
| <a id="property-fill"></a> `fill?` | `string` |
| <a id="property-stroke"></a> `stroke?` | `string` |
| <a id="property-styles"></a> `styles?` | `Partial`<`Record`<`"default"` | `"hover"` | `"active"`, `TStyle`>> |

## Type Aliases

### MapFeature

```ts
type MapFeature = ExtendedFeature & Record<string, unknown> | ExtendedFeature;
```

A GeoJSON Feature used by d3-maps.

This type allows extra top-level fields to be attached in `dataTransformer` (e.g. choropleth colors).
