[@d3-maps/core](index.md) / mapObject

# mapObject

## Table of contents

* [Functions](#functions)
  * [getObjectStateUpdate()](#getobjectstateupdate)
  * [resolveObjectStyle()](#resolveobjectstyle)
* [Variables](#variables)
  * [mapObjectState](#mapobjectstate)
* [Type Aliases](#type-aliases)
  * [MapObject](#mapobject-1)
  * [MapObjectEventType](#mapobjecteventtype)
  * [MapObjectState](#mapobjectstate-1)
  * [MapObjectStyles](#mapobjectstyles)

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

## Variables

### mapObjectState

```ts
const mapObjectState: readonly ["default", "hover", "active"];
```

Supported interaction states for map objects.

## Type Aliases

### MapObject

```ts
type MapObject = GeoGeometryObjects | ExtendedFeature;
```

***

### MapObjectEventType

```ts
type MapObjectEventType = "mouseenter" | "mouseleave" | "mousedown" | "mouseup";
```

***

### MapObjectState

```ts
type MapObjectState = typeof mapObjectState[number];
```

***

### MapObjectStyles

```ts
type MapObjectStyles<TStyle> = Partial<Record<MapObjectState, TStyle>>;
```

#### Type Parameters

| Type Parameter |
| ------ |
| `TStyle` |
