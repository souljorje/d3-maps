[@d3-maps/core](index.md) / line

# line

## Table of contents

* [Functions](#functions)
  * [createMidPoint()](#createmidpoint)
  * [getDefaultLine()](#getdefaultline)
  * [getLinePath()](#getlinepath)
  * [getLineWithMidpoints()](#getlinewithmidpoints)
* [Interfaces](#interfaces)
  * [MapLineOptions](#maplineoptions)
  * [MapLineProps](#maplineprops)
* [Type Aliases](#type-aliases)
  * [MapLineCoordinates](#maplinecoordinates)
  * [MapLineCurve](#maplinecurve)
  * [MapLineMidpoint](#maplinemidpoint)

## Functions

### createMidPoint()

```ts
function createMidPoint(pointsPair: [[number, number], [number, number]], midpoint?: MapLineMidpoint): [number, number];
```

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `pointsPair` | \[\[`number`, `number`], \[`number`, `number`]] |
| `midpoint` | [`MapLineMidpoint`](#maplinemidpoint) |

#### Returns

\[`number`, `number`]

***

### getDefaultLine()

```ts
function getDefaultLine(points: MapLineCoordinates, curve?: MapLineCurve): string | undefined;
```

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `points` | [`MapLineCoordinates`](#maplinecoordinates) |
| `curve?` | [`MapLineCurve`](#maplinecurve) |

#### Returns

`string` | `undefined`

***

### getLinePath()

```ts
function getLinePath(context: MapContext | undefined, __namedParameters: MapLineOptions): string | undefined;
```

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `context` | [`MapContext`](map.md#mapcontext) | `undefined` |
| `__namedParameters` | [`MapLineOptions`](#maplineoptions) |

#### Returns

`string` | `undefined`

***

### getLineWithMidpoints()

```ts
function getLineWithMidpoints(
   points: MapLineCoordinates, 
   curve?: MapLineCurve, 
   midpoint?: MapLineMidpoint): string | undefined;
```

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `points` | [`MapLineCoordinates`](#maplinecoordinates) |
| `curve?` | [`MapLineCurve`](#maplinecurve) |
| `midpoint?` | [`MapLineMidpoint`](#maplinemidpoint) |

#### Returns

`string` | `undefined`

## Interfaces

### MapLineOptions

#### Extended by

* [`MapLineProps`](#maplineprops)

#### Properties

| Property | Type |
| ------ | ------ |
| <a id="property-cartesian"></a> `cartesian?` | `boolean` |
| <a id="property-coordinates"></a> `coordinates` | [`MapLineCoordinates`](#maplinecoordinates) |
| <a id="property-curve"></a> `curve?` | [`MapLineCurve`](#maplinecurve) |
| <a id="property-custom"></a> `custom?` | `boolean` |
| <a id="property-midpoint"></a> `midpoint?` | [`MapLineMidpoint`](#maplinemidpoint) |

***

### MapLineProps

#### Extends

* [`MapObjectProps`](mapObject.md#mapobjectprops)<`TStyle`>.[`MapLineOptions`](#maplineoptions)

#### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `TStyle` | `unknown` |

#### Properties

| Property | Type | Inherited from |
| ------ | ------ | ------ |
| <a id="property-cartesian-1"></a> `cartesian?` | `boolean` | [`MapLineOptions`](#maplineoptions).[`cartesian`](#property-cartesian) |
| <a id="property-coordinates-1"></a> `coordinates` | [`MapLineCoordinates`](#maplinecoordinates) | [`MapLineOptions`](#maplineoptions).[`coordinates`](#property-coordinates) |
| <a id="property-curve-1"></a> `curve?` | [`MapLineCurve`](#maplinecurve) | [`MapLineOptions`](#maplineoptions).[`curve`](#property-curve) |
| <a id="property-custom-1"></a> `custom?` | `boolean` | [`MapLineOptions`](#maplineoptions).[`custom`](#property-custom) |
| <a id="property-midpoint-1"></a> `midpoint?` | [`MapLineMidpoint`](#maplinemidpoint) | [`MapLineOptions`](#maplineoptions).[`midpoint`](#property-midpoint) |
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

### MapLineMidpoint

```ts
type MapLineMidpoint = [number, number];
```
