[@d3-maps/core](index.md) / annotation

# annotation

## Table of contents

* [Functions](#functions)
  * [getAnnotationGeometry()](#getannotationgeometry)
* [Variables](#variables)
  * [MAP\_ANNOTATION\_DEFAULTS](#map_annotation_defaults)
* [Interfaces](#interfaces)
  * [MapAnnotationGeometry](#mapannotationgeometry)
  * [MapAnnotationGeometryOptions](#mapannotationgeometryoptions)
  * [MapAnnotationProps](#mapannotationprops)
* [Type Aliases](#type-aliases)
  * [MapAnnotationCoordinates](#mapannotationcoordinates)

## Functions

### getAnnotationGeometry()

```ts
function getAnnotationGeometry(__namedParameters?: MapAnnotationGeometryOptions): MapAnnotationGeometry;
```

Returns local connector geometry for an annotation before it is anchored to the map

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `__namedParameters` | [`MapAnnotationGeometryOptions`](#mapannotationgeometryoptions) |

#### Returns

[`MapAnnotationGeometry`](#mapannotationgeometry)

## Variables

### MAP\_ANNOTATION\_DEFAULTS

```ts
const MAP_ANNOTATION_DEFAULTS: {
  angle: -90;
  length: 30;
  margin: 0;
};
```

Default local layout values for annotation connectors

#### Type Declaration

##### angle

```ts
readonly angle: -90 = -90;
```

##### length

```ts
readonly length: 30 = 30;
```

##### margin

```ts
readonly margin: 0 = 0;
```

## Interfaces

### MapAnnotationGeometry

Local SVG geometry derived from an annotation anchor and layout options

#### Properties

| Property | Type |
| ------ | ------ |
| <a id="property-contenttransform"></a> `contentTransform` | `string` |
| <a id="property-linecoordinates"></a> `lineCoordinates` | [`MapAnnotationCoordinates`](#mapannotationcoordinates)\[] |
| <a id="property-linetransform"></a> `lineTransform` | `string` |

***

### MapAnnotationGeometryOptions

Layout options used to derive local annotation connector geometry

#### Properties

| Property | Type |
| ------ | ------ |
| <a id="property-angle"></a> `angle?` | `number` |
| <a id="property-length"></a> `length?` | `number` |
| <a id="property-margin"></a> `margin?` | `number` |

***

### MapAnnotationProps

Public annotation props shared across adapters

#### Extends

* [`MapObjectProps`](mapObject.md#mapobjectprops)<`TStyle`>

#### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `TStyle` | `unknown` |

#### Properties

| Property | Type | Inherited from |
| ------ | ------ | ------ |
| <a id="property-angle-1"></a> `angle?` | `number` | - |
| <a id="property-coordinates"></a> `coordinates` | [`MapAnnotationCoordinates`](#mapannotationcoordinates) | - |
| <a id="property-curve"></a> `curve?` | [`MapLineCurve`](line.md#maplinecurve) | - |
| <a id="property-length-1"></a> `length?` | `number` | - |
| <a id="property-margin-1"></a> `margin?` | `number` | - |
| <a id="property-midpoint"></a> `midpoint?` | [`MapLineMidpoint`](line.md#maplinemidpoint) | - |
| <a id="property-styles"></a> `styles?` | `Partial`<`Record`<`"default"` | `"hover"` | `"active"` | `"focus"`, `TStyle`>> | [`MapObjectProps`](mapObject.md#mapobjectprops).[`styles`](mapObject.md#property-styles) |

## Type Aliases

### MapAnnotationCoordinates

```ts
type MapAnnotationCoordinates = [number, number];
```

Geographic anchor coordinate for an annotation
