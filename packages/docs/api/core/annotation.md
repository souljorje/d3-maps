[@d3-maps/core](index.md) / annotation

# annotation

## Table of contents

* [Functions](#functions)
  * [getAnnotationGeometry()](#getannotationgeometry)
* [Variables](#variables)
  * [MAP\_ANNOTATION\_DEFAULTS](#map_annotation_defaults)
* [Interfaces](#interfaces)
  * [MapAnnotationGeometry](#mapannotationgeometry)
  * [MapAnnotationProps](#mapannotationprops)
* [Type Aliases](#type-aliases)
  * [MapAnnotationCoordinates](#mapannotationcoordinates)

## Functions

### getAnnotationGeometry()

```ts
function getAnnotationGeometry(
   context: MapContext | undefined, 
   coordinates: MapAnnotationCoordinates, 
   __namedParameters?: Omit<MapAnnotationProps, "coordinates" | "styles">): MapAnnotationGeometry | undefined;
```

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `context` | [`MapContext`](map.md#mapcontext) | `undefined` |
| `coordinates` | [`MapAnnotationCoordinates`](#mapannotationcoordinates) |
| `__namedParameters` | `Omit`<[`MapAnnotationProps`](#mapannotationprops), `"coordinates"` | `"styles"`> |

#### Returns

[`MapAnnotationGeometry`](#mapannotationgeometry) | `undefined`

## Variables

### MAP\_ANNOTATION\_DEFAULTS

```ts
const MAP_ANNOTATION_DEFAULTS: {
  angle: -45;
  length: 30;
  margin: 8;
};
```

#### Type Declaration

##### angle

```ts
readonly angle: -45 = -45;
```

##### length

```ts
readonly length: 30 = 30;
```

##### margin

```ts
readonly margin: 8 = 8;
```

## Interfaces

### MapAnnotationGeometry

#### Properties

| Property | Type |
| ------ | ------ |
| <a id="property-anchortransform"></a> `anchorTransform` | `string` |
| <a id="property-connectorpath"></a> `connectorPath` | `string` |
| <a id="property-connectortransform"></a> `connectorTransform` | `string` |
| <a id="property-contenttransform"></a> `contentTransform` | `string` |

***

### MapAnnotationProps

#### Extends

* [`MapObjectProps`](mapObject.md#mapobjectprops)<`TStyle`>

#### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `TStyle` | `unknown` |

#### Properties

| Property | Type | Inherited from |
| ------ | ------ | ------ |
| <a id="property-angle"></a> `angle?` | `number` | - |
| <a id="property-coordinates"></a> `coordinates` | [`MapAnnotationCoordinates`](#mapannotationcoordinates) | - |
| <a id="property-length"></a> `length?` | `number` | - |
| <a id="property-margin"></a> `margin?` | `number` | - |
| <a id="property-styles"></a> `styles?` | `Partial`<`Record`<`"default"` | `"hover"` | `"active"`, `TStyle`>> | [`MapObjectProps`](mapObject.md#mapobjectprops).[`styles`](mapObject.md#property-styles) |

## Type Aliases

### MapAnnotationCoordinates

```ts
type MapAnnotationCoordinates = [number, number];
```
