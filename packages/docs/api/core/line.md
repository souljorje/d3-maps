[@d3-maps/core](index.md) / line

# line

## Table of contents

* [Functions](#functions)
  * [getCustomLinePath()](#getcustomlinepath)
  * [getGeographicLinePath()](#getgeographiclinepath)
  * [getLinePath()](#getlinepath)
* [Interfaces](#interfaces)
  * [MapLineProps](#maplineprops)
* [Type Aliases](#type-aliases)
  * [MapLineCoordinates](#maplinecoordinates)
  * [MapLineCurve](#maplinecurve)

## Functions

### getCustomLinePath()

```ts
function getCustomLinePath(
   context: MapContext | undefined, 
   coordinates: MapLineCoordinates, 
   curve?: MapLineCurve): string | undefined;
```

#### Parameters

| Parameter | Type | Default value |
| ------ | ------ | ------ |
| `context` | [`MapContext`](map.md#mapcontext) | `undefined` | `undefined` |
| `coordinates` | [`MapLineCoordinates`](#maplinecoordinates) | `undefined` |
| `curve` | [`MapLineCurve`](#maplinecurve) | `false` |

#### Returns

`string` | `undefined`

***

### getGeographicLinePath()

```ts
function getGeographicLinePath(context: MapContext | undefined, coordinates: MapLineCoordinates): string | undefined;
```

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `context` | [`MapContext`](map.md#mapcontext) | `undefined` |
| `coordinates` | [`MapLineCoordinates`](#maplinecoordinates) |

#### Returns

`string` | `undefined`

***

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
| <a id="property-curve"></a> `curve?` | [`MapLineCurve`](#maplinecurve) | - |
| <a id="property-custom"></a> `custom?` | `boolean` | - |
| <a id="property-styles"></a> `styles?` | `Partial`<`Record`<`"default"` | `"hover"` | `"active"`, `TStyle`>> | [`MapObject`](mapObject.md#mapobject).[`styles`](mapObject.md#property-styles) |

## Type Aliases

### MapLineCoordinates

```ts
type MapLineCoordinates = [number, number][];
```

***

### MapLineCurve

```ts
type MapLineCurve = boolean | CurveFactory | CurveFactoryLineOnly;
```
