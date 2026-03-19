[@d3-maps/core](index.md) / line

# line

## Table of contents

* [Functions](#functions)
  * [getLinePath()](#getlinepath)
* [Interfaces](#interfaces)
  * [MapLineProps](#maplineprops)
* [Type Aliases](#type-aliases)
  * [MapLineCoordinates](#maplinecoordinates)

## Functions

### getLinePath()

```ts
function getLinePath(context: MapContext | undefined, coordinates: MapLineCoordinates): string | undefined;
```

Computes an SVG path for a geographic line between coordinates.

Coordinates must be `[longitude, latitude]`.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `context` | [`MapContext`](map.md#mapcontext) | `undefined` |
| `coordinates` | [`MapLineCoordinates`](#maplinecoordinates) |

#### Returns

`string` | `undefined`

## Interfaces

### MapLineProps

Shared props contract for geographic line layers.

#### Extends

* [`MapObject`](mapObject.md#mapobject)<`TStyle`>

#### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `TStyle` | `unknown` |

#### Properties

| Property | Type | Inherited from |
| ------ | ------ | ------ |
| <a id="property-coordinates"></a> `coordinates` | [`MapLineCoordinates`](#maplinecoordinates) | - |
| <a id="property-styles"></a> `styles?` | `Partial`<`Record`<`"default"` | `"hover"` | `"active"`, `TStyle`>> | [`MapObject`](mapObject.md#mapobject).[`styles`](mapObject.md#property-styles) |

## Type Aliases

### MapLineCoordinates

```ts
type MapLineCoordinates = [number, number][];
```
