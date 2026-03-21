[@d3-maps/core](index.md) / line

# line

## Table of contents

* [Functions](#functions)
  * [getCartesianLinePath()](#getcartesianlinepath)
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

### getCartesianLinePath()

```ts
function getCartesianLinePath(coordinates: MapLineCoordinates, curve?: MapLineCustomCurve): string | undefined;
```

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `coordinates` | [`MapLineCoordinates`](#maplinecoordinates) |
| `curve?` | [`MapLineCustomCurve`](#maplinecustomcurve) |

#### Returns

`string` | `undefined`

***

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
   curve?: MapLineCustomCurve, 
   cartesian?: boolean): string | undefined;
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
| `cartesian?` | `boolean` | `false` |

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
| <a id="property-cartesian"></a> `cartesian?` | `boolean` | - |
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
