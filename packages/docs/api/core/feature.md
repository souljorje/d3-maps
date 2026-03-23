[@d3-maps/core](index.md) / feature

# feature

## Table of contents

* [Functions](#functions)
  * [getFeatureKey()](#getfeaturekey)
* [Interfaces](#interfaces)
  * [MapFeatureProps](#mapfeatureprops)
  * [MapFeaturesProps](#mapfeaturesprops)
* [Type Aliases](#type-aliases)
  * [MapFeature](#mapfeature)

## Functions

### getFeatureKey()

```ts
function getFeatureKey(
   feature: MapFeature, 
   idKey?: string, 
   fallback?: string | number): string | number | undefined;
```

Resolves a stable key for a feature.

Checks:

1. `feature[idKey]`
2. `feature.properties[idKey]`
3. optional fallback value supplied by the caller

#### Parameters

| Parameter | Type | Default value |
| ------ | ------ | ------ |
| `feature` | [`MapFeature`](#mapfeature) | `undefined` |
| `idKey` | `string` | `'id'` |
| `fallback?` | `string` | `number` | `undefined` |

#### Returns

`string` | `number` | `undefined`

## Interfaces

### MapFeatureProps

Shared props contract for a single rendered feature.

#### Extends

* [`MapObjectProps`](mapObject.md#mapobjectprops)<`TStyle`>

#### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `TStyle` | `unknown` |

#### Properties

| Property | Type | Inherited from |
| ------ | ------ | ------ |
| <a id="property-data"></a> `data` | [`MapFeature`](#mapfeature) | - |
| <a id="property-styles"></a> `styles?` | `Partial`<`Record`<`"default"` | `"hover"` | `"active"` | `"focus"`, `TStyle`>> | [`MapObjectProps`](mapObject.md#mapobjectprops).[`styles`](mapObject.md#property-styles) |

***

### MapFeaturesProps

Shared props contract for feature collections rendered from the current map context.

#### Extends

* `Omit`<[`MapFeatureProps`](#mapfeatureprops)<`TStyle`>, `"data"`>

#### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `TStyle` | `unknown` |

#### Properties

| Property | Type | Inherited from |
| ------ | ------ | ------ |
| <a id="property-idkey"></a> `idKey?` | `string` | - |
| <a id="property-styles-1"></a> `styles?` | `Partial`<`Record`<`"default"` | `"hover"` | `"active"` | `"focus"`, `TStyle`>> | `Omit.styles` |

## Type Aliases

### MapFeature

```ts
type MapFeature = ExtendedFeature & Record<string, unknown> | ExtendedFeature;
```

A GeoJSON Feature used by d3-maps.

This type allows extra top-level fields to be attached in `dataTransformer` (e.g. choropleth colors).
