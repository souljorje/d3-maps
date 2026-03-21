[@d3-maps/core](index.md) / line

# line

## Table of contents

* [Functions](#functions)
  * [getConnectorLinePath()](#getconnectorlinepath)
  * [getLinePath()](#getlinepath)
  * [getLineStringPath()](#getlinestringpath)
  * [getPointsLinePath()](#getpointslinepath)
  * [getProjectedConnectorPath()](#getprojectedconnectorpath)
  * [getProjectedLinePath()](#getprojectedlinepath)
* [Interfaces](#interfaces)
  * [MapLineProps](#maplineprops)
* [Type Aliases](#type-aliases)
  * [MapLineCoordinates](#maplinecoordinates)
  * [MapLineCurve](#maplinecurve)
  * [MapLineCustomCurve](#maplinecustomcurve)

## Functions

### getConnectorLinePath()

```ts
function getConnectorLinePath(points: MapLineCoordinates, curve?: number): string | undefined;
```

#### Parameters

| Parameter | Type | Default value |
| ------ | ------ | ------ |
| `points` | [`MapLineCoordinates`](#maplinecoordinates) | `undefined` |
| `curve` | `number` | `0.5` |

#### Returns

`string` | `undefined`

***

### getLinePath()

```ts
function getLinePath(
   context: MapContext | undefined, 
   coordinates: MapLineCoordinates, 
   custom?: boolean, 
   curve?: MapLineCustomCurve): string | undefined;
```

Computes an SVG path for a geographic line between coordinates.

Coordinates must be `[longitude, latitude]`.

#### Parameters

| Parameter | Type | Default value |
| ------ | ------ | ------ |
| `context` | [`MapContext`](map.md#mapcontext) | `undefined` | `undefined` |
| `coordinates` | [`MapLineCoordinates`](#maplinecoordinates) | `undefined` |
| `custom` | `boolean` | `false` |
| `curve?` | [`MapLineCustomCurve`](#maplinecustomcurve) | `undefined` |

#### Returns

`string` | `undefined`

***

### getLineStringPath()

```ts
function getLineStringPath(context: MapContext | undefined, coordinates: MapLineCoordinates): string | undefined;
```

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `context` | [`MapContext`](map.md#mapcontext) | `undefined` |
| `coordinates` | [`MapLineCoordinates`](#maplinecoordinates) |

#### Returns

`string` | `undefined`

***

### getPointsLinePath()

```ts
function getPointsLinePath(points: MapLineCoordinates, curve?: MapLineCurve): string | undefined;
```

#### Parameters

| Parameter | Type | Default value |
| ------ | ------ | ------ |
| `points` | [`MapLineCoordinates`](#maplinecoordinates) | `undefined` |
| `curve` | [`MapLineCurve`](#maplinecurve) | `curveLinear` |

#### Returns

`string` | `undefined`

***

### getProjectedConnectorPath()

```ts
function getProjectedConnectorPath(
   context: MapContext | undefined, 
   coordinates: MapLineCoordinates, 
   curve?: number): string | undefined;
```

#### Parameters

| Parameter | Type | Default value |
| ------ | ------ | ------ |
| `context` | [`MapContext`](map.md#mapcontext) | `undefined` | `undefined` |
| `coordinates` | [`MapLineCoordinates`](#maplinecoordinates) | `undefined` |
| `curve` | `number` | `0.5` |

#### Returns

`string` | `undefined`

***

### getProjectedLinePath()

```ts
function getProjectedLinePath(
   context: MapContext | undefined, 
   coordinates: MapLineCoordinates, 
   curve?: MapLineCurve): string | undefined;
```

#### Parameters

| Parameter | Type | Default value |
| ------ | ------ | ------ |
| `context` | [`MapContext`](map.md#mapcontext) | `undefined` | `undefined` |
| `coordinates` | [`MapLineCoordinates`](#maplinecoordinates) | `undefined` |
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
| <a id="property-curve"></a> `curve?` | [`MapLineCustomCurve`](#maplinecustomcurve) | - |
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

***

### MapLineCustomCurve

```ts
type MapLineCustomCurve = MapLineCurve | number;
```
