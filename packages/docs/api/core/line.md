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
  * [MapLineCurveOffset](#maplinecurveoffset)

## Functions

### createMidPoint()

```ts
function createMidPoint(pointsPair: [[number, number], [number, number]], curveOffset?: MapLineCurveOffset): [number, number];
```

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `pointsPair` | \[\[`number`, `number`], \[`number`, `number`]] |
| `curveOffset` | [`MapLineCurveOffset`](#maplinecurveoffset) |

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
   curveOffset?: MapLineCurveOffset): string | undefined;
```

#### Parameters

| Parameter | Type | Default value |
| ------ | ------ | ------ |
| `points` | [`MapLineCoordinates`](#maplinecoordinates) | `undefined` |
| `curve` | [`MapLineCurve`](#maplinecurve) | `0.5` |
| `curveOffset?` | [`MapLineCurveOffset`](#maplinecurveoffset) | `undefined` |

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
| <a id="property-curveoffset"></a> `curveOffset?` | [`MapLineCurveOffset`](#maplinecurveoffset) |
| <a id="property-custom"></a> `custom?` | `boolean` |

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
| <a id="property-curveoffset-1"></a> `curveOffset?` | [`MapLineCurveOffset`](#maplinecurveoffset) | [`MapLineOptions`](#maplineoptions).[`curveOffset`](#property-curveoffset) |
| <a id="property-custom-1"></a> `custom?` | `boolean` | [`MapLineOptions`](#maplineoptions).[`custom`](#property-custom) |
| <a id="property-styles"></a> `styles?` | `Partial`<`Record`<`"default"` | `"hover"` | `"active"`, `TStyle`>> | [`MapObjectProps`](mapObject.md#mapobjectprops).[`styles`](mapObject.md#property-styles) |

## Type Aliases

### MapLineCoordinates

```ts
type MapLineCoordinates = [number, number][];
```

***

### MapLineCurve

```ts
type MapLineCurve = CurveFactory | CurveFactoryLineOnly | number;
```

***

### MapLineCurveOffset

```ts
type MapLineCurveOffset = [number, number];
```
