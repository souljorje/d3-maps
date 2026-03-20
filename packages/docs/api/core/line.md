[@d3-maps/core](index.md) / line

# line

## Table of contents

* [Functions](#functions)
  * [getLinePath()](#getlinepath)
  * [getPointsLinePath()](#getpointslinepath)
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
   coordinates: MapLineCoordinates, 
   custom?: boolean, 
   curve?: MapLineCurve): string | undefined;
```

Computes an SVG path for a geographic line between coordinates.

Coordinates must be `[longitude, latitude]`.

#### Parameters

| Parameter | Type | Default value |
| ------ | ------ | ------ |
| `context` | [`MapContext`](map.md#mapcontext) | `undefined` | `undefined` |
| `coordinates` | [`MapLineCoordinates`](#maplinecoordinates) | `undefined` |
| `custom` | `boolean` | `false` |
| `curve?` | [`MapLineCurve`](#maplinecurve) | `undefined` |

#### Returns

`string` | `undefined`

***

### getPointsLinePath()

```ts
function getPointsLinePath(points: [number, number][], curve?: MapLineCurve): string | undefined;
```

#### Parameters

| Parameter | Type | Default value |
| ------ | ------ | ------ |
| `points` | \[`number`, `number`]\[] | `undefined` |
| `curve` | [`MapLineCurve`](#maplinecurve) | `curveLinear` |

#### Returns

`string` | `undefined`

## Interfaces

### MapLineProps

Shared props contract for geographic line layers.

#### Extends

* [`MapObjectProps`](mapObject.md#mapobjectprops)<`TStyle`>

#### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `TStyle` | `unknown` |

#### Properties

| Property | Type | Inherited from |
| ------ | ------ | ------ |
| <a id="property-coordinates"></a> `coordinates` | [`MapLineCoordinates`](#maplinecoordinates) | - |
| <a id="property-curve"></a> `curve?` | [`MapLineCurve`](#maplinecurve) | - |
| <a id="property-custom"></a> `custom?` | `boolean` | - |
| <a id="property-styles"></a> `styles?` | `Partial`<`Record`<`"default"` | `"hover"` | `"active"`, `TStyle`>> | [`MapObjectProps`](mapObject.md#mapobjectprops).[`styles`](mapObject.md#property-styles) |

## Type Aliases

### MapLineCoordinates

```ts
type MapLineCoordinates = [number, number][];
```

***

### MapLineCurve

```ts
type MapLineCurve = CurveFactory | CurveFactoryLineOnly;
```
