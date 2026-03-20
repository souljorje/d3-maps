[@d3-maps/core](index.md) / marker

# marker

## Table of contents

* [Functions](#functions)
  * [getMarkerTransform()](#getmarkertransform)
* [Interfaces](#interfaces)
  * [MapMarkerProps](#mapmarkerprops)
* [Type Aliases](#type-aliases)
  * [MapMarkerCoordinates](#mapmarkercoordinates)

## Functions

### getMarkerTransform()

```ts
function getMarkerTransform(
   context: MapContext | undefined, 
   coordinates: MapMarkerCoordinates, 
   fallback?: string): string;
```

Computes an SVG transform (`translate(x, y)`) for the given coordinates using the active projection.

Coordinates must be `[longitude, latitude]`.

#### Parameters

| Parameter | Type | Default value |
| ------ | ------ | ------ |
| `context` | [`MapContext`](map.md#mapcontext) | `undefined` | `undefined` |
| `coordinates` | [`MapMarkerCoordinates`](#mapmarkercoordinates) | `undefined` |
| `fallback` | `string` | `'translate(0, 0)'` |

#### Returns

`string`

## Interfaces

### MapMarkerProps

Shared props contract for marker layers.

#### Extends

* [`MapObjectProps`](mapObject.md#mapobjectprops)<`TStyle`>

#### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `TStyle` | `unknown` |

#### Properties

| Property | Type | Inherited from |
| ------ | ------ | ------ |
| <a id="property-coordinates"></a> `coordinates?` | [`MapMarkerCoordinates`](#mapmarkercoordinates) | - |
| <a id="property-styles"></a> `styles?` | `Partial`<`Record`<`"default"` | `"hover"` | `"active"`, `TStyle`>> | [`MapObjectProps`](mapObject.md#mapobjectprops).[`styles`](mapObject.md#property-styles) |

## Type Aliases

### MapMarkerCoordinates

```ts
type MapMarkerCoordinates = [number, number];
```
