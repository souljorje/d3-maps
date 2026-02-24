[@d3-maps/core](index.md) / map

# map

## Table of contents

* [Functions](#functions)
  * [getTopoObject()](#gettopoobject)
  * [isTopology()](#istopology)
  * [makeFeatures()](#makefeatures)
  * [makeMapContext()](#makemapcontext)
  * [makeMesh()](#makemesh)
  * [makePathFn()](#makepathfn)
  * [makeProjection()](#makeprojection)
* [Interfaces](#interfaces)
  * [MapConfig](#mapconfig)
  * [MapContext](#mapcontext)
  * [ProjectionConfig](#projectionconfig)
* [Type Aliases](#type-aliases)
  * [DataTransformer()](#datatransformer)
  * [MapData](#mapdata)
  * [MapMesh](#mapmesh)

## Functions

### getTopoObject()

```ts
function getTopoObject(geoData: Topology): GeometryObject;
```

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `geoData` | `Topology` |

#### Returns

`GeometryObject`

***

### isTopology()

```ts
function isTopology(data: MapData): data is Topology<Objects<GeoJsonProperties>>;
```

Type guard for TopoJSON topology inputs.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `data` | [`MapData`](#mapdata) |

#### Returns

`data is Topology<Objects<GeoJsonProperties>>`

***

### makeFeatures()

```ts
function makeFeatures(geoData: MapData, dataTransformer?: DataTransformer): [MapFeature[], ExtendedFeatureCollection<ExtendedFeature<GeoGeometryObjects | null, GeoJsonProperties>>];
```

Normalizes input map data to GeoJSON features.

* TopoJSON is converted via `topojson-client`.
* If provided, `dataTransformer` is applied to the feature array.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `geoData` | [`MapData`](#mapdata) |
| `dataTransformer?` | [`DataTransformer`](#datatransformer) |

#### Returns

\[[`MapFeature`](feature.md#mapfeature)\[], `ExtendedFeatureCollection`<`ExtendedFeature`<`GeoGeometryObjects` | `null`, `GeoJsonProperties`>>]

***

### makeMapContext()

```ts
function makeMapContext(__namedParameters: MapConfig): MapContext;
```

Creates a full [MapContext](#mapcontext) from a [MapConfig](#mapconfig).

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `__namedParameters` | [`MapConfig`](#mapconfig) |

#### Returns

[`MapContext`](#mapcontext)

***

### makeMesh()

```ts
function makeMesh(geoData: MapData): MultiLineString | undefined;
```

Returns a TopoJSON mesh when topology data is provided.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `geoData` | [`MapData`](#mapdata) |

#### Returns

`MultiLineString` | `undefined`

***

### makePathFn()

```ts
function makePathFn(mapProjection: GeoProjection): GeoPath;
```

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `mapProjection` | `GeoProjection` |

#### Returns

`GeoPath`

***

### makeProjection()

```ts
function makeProjection(__namedParameters: {
  config?: ProjectionConfig;
  geoJson?: GeoPermissibleObjects;
  height: number;
  projection: () => GeoProjection;
  width: number;
}): GeoProjection;
```

Creates a configured projection and fits it to the provided GeoJSON (if present).

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `__namedParameters` | { `config?`: [`ProjectionConfig`](#projectionconfig); `geoJson?`: `GeoPermissibleObjects`; `height`: `number`; `projection`: () => `GeoProjection`; `width`: `number`; } |
| `__namedParameters.config?` | [`ProjectionConfig`](#projectionconfig) |
| `__namedParameters.geoJson?` | `GeoPermissibleObjects` |
| `__namedParameters.height` | `number` |
| `__namedParameters.projection` | () => `GeoProjection` |
| `__namedParameters.width` | `number` |

#### Returns

`GeoProjection`

## Interfaces

### MapConfig

Input configuration for creating a map context.

In adapters, this is usually passed as component props.

#### Properties

| Property | Type | Description |
| ------ | ------ | ------ |
| <a id="property-aspectratio"></a> `aspectRatio?` | `number` | - |
| <a id="property-data"></a> `data` | [`MapData`](#mapdata) | TopoJSON or GeoJSON input. TopoJSON is automatically converted to GeoJSON features. |
| <a id="property-datatransformer"></a> `dataTransformer?` | [`DataTransformer`](#datatransformer) | Optional feature transformer (filter/augment/normalize features). |
| <a id="property-height"></a> `height?` | `number` | - |
| <a id="property-projection"></a> `projection?` | () => `GeoProjection` | Projection factory from d3-geo (or a compatible implementation). Example: `geoNaturalEarth1`. |
| <a id="property-projectionconfig"></a> `projectionConfig?` | [`ProjectionConfig`](#projectionconfig) | Projection method arguments passed to the created projection |
| <a id="property-width"></a> `width?` | `number` | - |

***

### MapContext

Fully computed, framework-agnostic map context.

Adapters provide this context to child layers (features, markers, custom SVG).

#### Properties

| Property | Type |
| ------ | ------ |
| <a id="property-features"></a> `features` | [`MapFeature`](feature.md#mapfeature)\[] |
| <a id="property-height-1"></a> `height` | `number` |
| <a id="property-mesh"></a> `mesh?` | `MultiLineString` |
| <a id="property-path"></a> `path` | `GeoPath` |
| <a id="property-projection-1"></a> `projection?` | `GeoProjection` |
| <a id="property-rendermesh"></a> `renderMesh` | () => `void` |
| <a id="property-renderpath"></a> `renderPath` | (`feature`: [`MapFeature`](feature.md#mapfeature)) => `void` |
| <a id="property-width-1"></a> `width` | `number` |

***

### ProjectionConfig

Extra projection method calls to apply before rendering.

Use projection method names as keys and method arguments as values.
Example: `{ center: [[0, 20]], rotate: [[0, 0, 0]], scale: 160 }`

#### See

https://d3js.org/d3-geo/projection

#### Extends

* `Omit`<[`MethodsToModifiers`](utils.md#methodstomodifiers)<`GeoProjection`>, `"invert"` | `"stream"`>

#### Properties

| Property | Type | Inherited from |
| ------ | ------ | ------ |
| <a id="property-angle"></a> `angle?` | `number` | \[`number`] | [`ProjectionConfig`](#projectionconfig).[`angle`](#property-angle) |
| <a id="property-center"></a> `center?` | \[\[`number`, `number`]] | [`ProjectionConfig`](#projectionconfig).[`center`](#property-center) |
| <a id="property-clipangle"></a> `clipAngle?` | `number` | \[`null`] | \[`number`] | `null` | [`ProjectionConfig`](#projectionconfig).[`clipAngle`](#property-clipangle) |
| <a id="property-clipextent"></a> `clipExtent?` | \[`null`] | \[\[\[`number`, `number`], \[`number`, `number`]]] | `null` | [`ProjectionConfig`](#projectionconfig).[`clipExtent`](#property-clipextent) |
| <a id="property-fitextent"></a> `fitExtent?` | \[\[\[`number`, `number`], \[`number`, `number`]], | `GeoGeometryObjects` | `ExtendedFeature`\<GeoGeometryObjects | null, `GeoJsonProperties`> | `ExtendedFeatureCollection`<`ExtendedFeature`\<GeoGeometryObjects | null, `GeoJsonProperties`>> | `ExtendedGeometryCollection`<`GeoGeometryObjects`>] | [`ProjectionConfig`](#projectionconfig).[`fitExtent`](#property-fitextent) |
| <a id="property-fitheight"></a> `fitHeight?` | \[`number`, | `GeoGeometryObjects` | `ExtendedFeature`\<GeoGeometryObjects | null, `GeoJsonProperties`> | `ExtendedFeatureCollection`<`ExtendedFeature`\<GeoGeometryObjects | null, `GeoJsonProperties`>> | `ExtendedGeometryCollection`<`GeoGeometryObjects`>] | [`ProjectionConfig`](#projectionconfig).[`fitHeight`](#property-fitheight) |
| <a id="property-fitsize"></a> `fitSize?` | \[\[`number`, `number`], | `GeoGeometryObjects` | `ExtendedFeature`\<GeoGeometryObjects | null, `GeoJsonProperties`> | `ExtendedFeatureCollection`<`ExtendedFeature`\<GeoGeometryObjects | null, `GeoJsonProperties`>> | `ExtendedGeometryCollection`<`GeoGeometryObjects`>] | [`ProjectionConfig`](#projectionconfig).[`fitSize`](#property-fitsize) |
| <a id="property-fitwidth"></a> `fitWidth?` | \[`number`, | `GeoGeometryObjects` | `ExtendedFeature`\<GeoGeometryObjects | null, `GeoJsonProperties`> | `ExtendedFeatureCollection`<`ExtendedFeature`\<GeoGeometryObjects | null, `GeoJsonProperties`>> | `ExtendedGeometryCollection`<`GeoGeometryObjects`>] | [`ProjectionConfig`](#projectionconfig).[`fitWidth`](#property-fitwidth) |
| <a id="property-postclip"></a> `postclip?` | | (`stream`: `GeoStream`) => `GeoStream` | \[(`stream`: `GeoStream`) => `GeoStream`] | [`ProjectionConfig`](#projectionconfig).[`postclip`](#property-postclip) |
| <a id="property-precision"></a> `precision?` | `number` | \[`number`] | [`ProjectionConfig`](#projectionconfig).[`precision`](#property-precision) |
| <a id="property-preclip"></a> `preclip?` | | (`stream`: `GeoStream`) => `GeoStream` | \[(`stream`: `GeoStream`) => `GeoStream`] | [`ProjectionConfig`](#projectionconfig).[`preclip`](#property-preclip) |
| <a id="property-reflectx"></a> `reflectX?` | `boolean` | \[`false`] | \[`true`] | [`ProjectionConfig`](#projectionconfig).[`reflectX`](#property-reflectx) |
| <a id="property-reflecty"></a> `reflectY?` | `boolean` | \[`false`] | \[`true`] | [`ProjectionConfig`](#projectionconfig).[`reflectY`](#property-reflecty) |
| <a id="property-rotate"></a> `rotate?` | \[\[`number`, `number`]] | \[\[`number`, `number`, `number`]] | [`ProjectionConfig`](#projectionconfig).[`rotate`](#property-rotate) |
| <a id="property-scale"></a> `scale?` | `number` | \[`number`] | [`ProjectionConfig`](#projectionconfig).[`scale`](#property-scale) |
| <a id="property-translate"></a> `translate?` | \[\[`number`, `number`]] | [`ProjectionConfig`](#projectionconfig).[`translate`](#property-translate) |

## Type Aliases

### DataTransformer()

```ts
type DataTransformer = (features: MapFeature[]) => MapFeature[];
```

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `features` | [`MapFeature`](feature.md#mapfeature)\[] |

#### Returns

[`MapFeature`](feature.md#mapfeature)\[]

***

### MapData

```ts
type MapData = ExtendedFeatureCollection | Topology;
```

***

### MapMesh

```ts
type MapMesh = ReturnType<typeof mesh>;
```
