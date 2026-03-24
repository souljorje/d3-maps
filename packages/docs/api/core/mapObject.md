[@d3-maps/core](index.md) / mapObject

# mapObject

## Table of contents

* [Functions](#functions)
  * [getObjectStateUpdate()](#getobjectstateupdate)
  * [resolveObjectStyle()](#resolveobjectstyle)
  * [useMapObjectEvents()](#usemapobjectevents)
* [Variables](#variables)
  * [mapObjectState](#mapobjectstate)
* [Interfaces](#interfaces)
  * [MapObjectInteractionController](#mapobjectinteractioncontroller)
  * [MapObjectProps](#mapobjectprops)
* [Type Aliases](#type-aliases)
  * [ElementMapObjectMouseDownSource](#elementmapobjectmousedownsource)
  * [MapObjectData](#mapobjectdata)
  * [MapObjectEventType](#mapobjecteventtype)
  * [MapObjectGlobalMouseupListener()](#mapobjectglobalmouseuplistener)
  * [MapObjectGlobalMouseupSubscription()](#mapobjectglobalmouseupsubscription)
  * [MapObjectMouseDownSource](#mapobjectmousedownsource)
  * [MapObjectState](#mapobjectstate-1)

## Functions

### getObjectStateUpdate()

```ts
function getObjectStateUpdate(event: MapObjectEventType): "default" | "hover" | "active";
```

Maps DOM event names to interaction state updates.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `event` | [`MapObjectEventType`](#mapobjecteventtype) |

#### Returns

`"default"` | `"hover"` | `"active"`

***

### resolveObjectStyle()

```ts
function resolveObjectStyle<TStyle>(state: "default" | "hover" | "active", styles?: Partial<Record<"default" | "hover" | "active", TStyle>>): TStyle | undefined;
```

Resolves a style value for the current state (falls back to `default`).

#### Type Parameters

| Type Parameter |
| ------ |
| `TStyle` |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `state` | `"default"` | `"hover"` | `"active"` |
| `styles?` | `Partial`<`Record`<`"default"` | `"hover"` | `"active"`, `TStyle`>> |

#### Returns

`TStyle` | `undefined`

***

### useMapObjectEvents()

```ts
function useMapObjectEvents<TTarget>(onStateChange?: (state: "default" | "hover" | "active") => void, recoverOnGlobalMouseup?: boolean): MapObjectInteractionController<TTarget>;
```

#### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `TTarget` | `unknown` |

#### Parameters

| Parameter | Type | Default value |
| ------ | ------ | ------ |
| `onStateChange?` | (`state`: `"default"` | `"hover"` | `"active"`) => `void` | `undefined` |
| `recoverOnGlobalMouseup?` | `boolean` | `false` |

#### Returns

[`MapObjectInteractionController`](#mapobjectinteractioncontroller)<`TTarget`>

## Variables

### mapObjectState

```ts
const mapObjectState: readonly ["default", "hover", "active"];
```

Supported interaction states for map objects.

## Interfaces

### MapObjectInteractionController

#### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `TTarget` | `unknown` |

#### Properties

| Property | Type |
| ------ | ------ |
| <a id="property-dispose"></a> `dispose` | () => `void` |
| <a id="property-onmousedown"></a> `onMousedown` | (`source?`: [`MapObjectMouseDownSource`](#mapobjectmousedownsource)<`TTarget`>) => `"default"` | `"hover"` | `"active"` |
| <a id="property-onmouseenter"></a> `onMouseenter` | () => `"default"` | `"hover"` | `"active"` |
| <a id="property-onmouseleave"></a> `onMouseleave` | () => `"default"` | `"hover"` | `"active"` |
| <a id="property-onmouseup"></a> `onMouseup` | () => `"default"` | `"hover"` | `"active"` |

***

### MapObjectProps

#### Extended by

* [`MapAnnotationProps`](annotation.md#mapannotationprops)
* [`MapFeatureProps`](feature.md#mapfeatureprops)
* [`MapGraticuleProps`](graticule.md#mapgraticuleprops)
* [`MapLineProps`](line.md#maplineprops)
* [`MapMarkerProps`](marker.md#mapmarkerprops)

#### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `TStyle` | `unknown` |

#### Properties

| Property | Type |
| ------ | ------ |
| <a id="property-styles"></a> `styles?` | `Partial`<`Record`<`"default"` | `"hover"` | `"active"`, `TStyle`>> |

## Type Aliases

### ElementMapObjectMouseDownSource

```ts
type ElementMapObjectMouseDownSource = 
  | Element
  | {
  currentTarget: EventTarget | null;
}
  | null
  | undefined;
```

***

### MapObjectData

```ts
type MapObjectData = GeoGeometryObjects | ExtendedFeature;
```

***

### MapObjectEventType

```ts
type MapObjectEventType = "mouseenter" | "mouseleave" | "mousedown" | "mouseup";
```

***

### MapObjectGlobalMouseupListener()

```ts
type MapObjectGlobalMouseupListener = () => void;
```

#### Returns

`void`

***

### MapObjectGlobalMouseupSubscription()

```ts
type MapObjectGlobalMouseupSubscription = (listener: MapObjectGlobalMouseupListener) => () => void;
```

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `listener` | [`MapObjectGlobalMouseupListener`](#mapobjectglobalmouseuplistener) |

#### Returns

```ts
(): void;
```

##### Returns

`void`

***

### MapObjectMouseDownSource

```ts
type MapObjectMouseDownSource<TTarget> = 
  | TTarget
  | ElementMapObjectMouseDownSource;
```

#### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `TTarget` | `unknown` |

***

### MapObjectState

```ts
type MapObjectState = typeof mapObjectState[number];
```
