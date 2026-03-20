[@d3-maps/core](index.md) / mapObject

# mapObject

## Table of contents

* [Functions](#functions)
  * [getObjectStateUpdate()](#getobjectstateupdate)
  * [resolveObjectStyle()](#resolveobjectstyle)
  * [subscribeWindow()](#subscribewindow)
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
function getObjectStateUpdate(event: MapObjectEventType): "default" | "hover" | "active" | "focus";
```

Maps DOM event names to interaction state updates.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `event` | [`MapObjectEventType`](#mapobjecteventtype) |

#### Returns

`"default"` | `"hover"` | `"active"` | `"focus"`

***

### resolveObjectStyle()

```ts
function resolveObjectStyle<TStyle>(state: "default" | "hover" | "active" | "focus", styles?: Partial<Record<"default" | "hover" | "active" | "focus", TStyle>>): TStyle | undefined;
```

Resolves a style value for the current state (falls back to `default`).

#### Type Parameters

| Type Parameter |
| ------ |
| `TStyle` |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `state` | `"default"` | `"hover"` | `"active"` | `"focus"` |
| `styles?` | `Partial`<`Record`<`"default"` | `"hover"` | `"active"` | `"focus"`, `TStyle`>> |

#### Returns

`TStyle` | `undefined`

***

### subscribeWindow()

```ts
function subscribeWindow(ev: string, listener: MapObjectGlobalMouseupListener): () => void;
```

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `ev` | `string` |
| `listener` | [`MapObjectGlobalMouseupListener`](#mapobjectglobalmouseuplistener) |

#### Returns

```ts
(): void;
```

##### Returns

`void`

***

### useMapObjectEvents()

```ts
function useMapObjectEvents<TTarget>(onStateChange?: (state: "default" | "hover" | "active" | "focus") => void, recoverOnGlobalMouseup?: boolean): MapObjectInteractionController<TTarget>;
```

#### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `TTarget` | `unknown` |

#### Parameters

| Parameter | Type | Default value |
| ------ | ------ | ------ |
| `onStateChange?` | (`state`: `"default"` | `"hover"` | `"active"` | `"focus"`) => `void` | `undefined` |
| `recoverOnGlobalMouseup?` | `boolean` | `false` |

#### Returns

[`MapObjectInteractionController`](#mapobjectinteractioncontroller)<`TTarget`>

## Variables

### mapObjectState

```ts
const mapObjectState: readonly ["default", "hover", "active", "focus"];
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
| <a id="property-onblur"></a> `onBlur` | () => `"default"` | `"hover"` | `"active"` | `"focus"` |
| <a id="property-onfocus"></a> `onFocus` | () => `"default"` | `"hover"` | `"active"` | `"focus"` |
| <a id="property-onmousedown"></a> `onMousedown` | (`source?`: [`MapObjectMouseDownSource`](#mapobjectmousedownsource)<`TTarget`>) => `"default"` | `"hover"` | `"active"` | `"focus"` |
| <a id="property-onmouseenter"></a> `onMouseenter` | () => `"default"` | `"hover"` | `"active"` | `"focus"` |
| <a id="property-onmouseleave"></a> `onMouseleave` | () => `"default"` | `"hover"` | `"active"` | `"focus"` |
| <a id="property-onmouseup"></a> `onMouseup` | () => `"default"` | `"hover"` | `"active"` | `"focus"` |

***

### MapObjectProps

#### Extended by

* [`MapFeatureProps`](feature.md#mapfeatureprops)
* [`MapGraticuleProps`](graticule.md#mapgraticuleprops)
* [`MapMarkerProps`](marker.md#mapmarkerprops)

#### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `TStyle` | `unknown` |

#### Properties

| Property | Type |
| ------ | ------ |
| <a id="property-styles"></a> `styles?` | `Partial`<`Record`<`"default"` | `"hover"` | `"active"` | `"focus"`, `TStyle`>> |

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
type MapObjectEventType = "mouseenter" | "mouseleave" | "mousedown" | "mouseup" | "focus" | "blur";
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
