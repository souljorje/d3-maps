[@d3-maps/core](index.md) / line

# line

## Table of contents

* [Functions](#functions)
  * [getLinePath()](#getlinepath)
* [Interfaces](#interfaces)
  * [MapLineProps](#maplineprops)
* [Type Aliases](#type-aliases)
  * [MapLineCoordinates](#maplinecoordinates)
  * [MapLineCurve](#maplinecurve)

## Functions

### getLinePath()

```ts
function getLinePath(
   context: MapContext | undefined, 
   coordinates: MapLineCoordinates[], 
   curve?: MapLineCurve): string | undefined;
```

Computes an SVG path for a straight projected line between geographic coordinates.

Coordinates must be `[longitude, latitude]`.

#### Parameters

| Parameter | Type | Default value |
| ------ | ------ | ------ |
| `context` | [`MapContext`](map.md#mapcontext) | `undefined` | `undefined` |
| `coordinates` | [`MapLineCoordinates`](#maplinecoordinates)\[] | `undefined` |
| `curve` | [`MapLineCurve`](#maplinecurve) | `false` |

#### Returns

`string` | `undefined`

## Interfaces

### MapLineProps

Shared props contract for straight line layers.

#### Extends

* [`MapObject`](mapObject.md#mapobject)<`TStyle`>

#### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `TStyle` | `unknown` |

#### Properties

| Property | Type | Inherited from |
| ------ | ------ | ------ |
| <a id="property-coordinates"></a> `coordinates?` | [`MapLineCoordinates`](#maplinecoordinates)\[] | - |
| <a id="property-curve"></a> `curve?` | [`MapLineCurve`](#maplinecurve) | - |
| <a id="property-styles"></a> `styles?` | `Partial`<`Record`<`"default"` | `"hover"` | `"active"`, `TStyle`>> | [`MapObject`](mapObject.md#mapobject).[`styles`](mapObject.md#property-styles) |

## Type Aliases

### MapLineCoordinates

```ts
type MapLineCoordinates = [number, number];
```

***

### MapLineCurve

```ts
type MapLineCurve = boolean | CurveFactory | CurveFactoryLineOnly;
```
