[@d3-maps/core](index.md) / zoom

# zoom

## Table of contents

* [Functions](#functions)
  * [applyZoomBehaviorTransform()](#applyzoombehaviortransform)
  * [applyZoomGroupTransform()](#applyzoomgrouptransform)
  * [applyZoomTransform()](#applyzoomtransform)
  * [attachZoomBehavior()](#attachzoombehavior)
  * [createZoomBehavior()](#createzoombehavior)
  * [getInverseZoomScale()](#getinversezoomscale)
  * [getZoomScale()](#getzoomscale)
  * [setupZoom()](#setupzoom)
* [Variables](#variables)
  * [ZOOM\_DEFAULTS](#zoom_defaults)
* [Interfaces](#interfaces)
  * [ApplyZoomOptions](#applyzoomoptions)
  * [D3ZoomEvent](#d3zoomevent)
  * [DefaultZoomBehavior()](#defaultzoombehavior)
  * [SetupZoomOptions](#setupzoomoptions)
  * [ZoomBehavior()](#zoombehavior)
  * [ZoomBehaviorOptions](#zoombehavioroptions)
  * [ZoomEvent](#zoomevent)
  * [ZoomEvents](#zoomevents)
  * [ZoomModifiers](#zoommodifiers)
  * [ZoomProps](#zoomprops)
  * [ZoomTransform](#zoomtransform)
* [Type Aliases](#type-aliases)
  * [Extent](#extent-2)
  * [ZoomScaleSource](#zoomscalesource)
  * [ZoomTargetElement](#zoomtargetelement)

## Functions

### applyZoomBehaviorTransform()

```ts
function applyZoomBehaviorTransform(
   element: ZoomTargetElement | null | undefined, 
   behavior: DefaultZoomBehavior, 
   transform: ZoomTransform): void;
```

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `element` | [`ZoomTargetElement`](#zoomtargetelement) | `null` | `undefined` |
| `behavior` | [`DefaultZoomBehavior`](#defaultzoombehavior) |
| `transform` | [`ZoomTransform`](#zoomtransform) |

#### Returns

`void`

***

### applyZoomGroupTransform()

```ts
function applyZoomGroupTransform(element: Element | null | undefined, transform: 
  | Pick<ZoomTransform, "toString">
  | null
  | undefined): void;
```

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `element` | `Element` | `null` | `undefined` |
| `transform` | | `Pick`<[`ZoomTransform`](#zoomtransform), `"toString"`> | `null` | `undefined` |

#### Returns

`void`

***

### applyZoomTransform()

```ts
function applyZoomTransform(options: ApplyZoomOptions): void;
```

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `options` | [`ApplyZoomOptions`](#applyzoomoptions) |

#### Returns

`void`

***

### attachZoomBehavior()

```ts
function attachZoomBehavior(element: ZoomTargetElement | null | undefined, behavior: DefaultZoomBehavior): void;
```

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `element` | [`ZoomTargetElement`](#zoomtargetelement) | `null` | `undefined` |
| `behavior` | [`DefaultZoomBehavior`](#defaultzoombehavior) |

#### Returns

`void`

***

### createZoomBehavior()

```ts
function createZoomBehavior(context?: MapContext, options?: ZoomBehaviorOptions): DefaultZoomBehavior;
```

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `context?` | [`MapContext`](map.md#mapcontext) |
| `options?` | [`ZoomBehaviorOptions`](#zoombehavioroptions) |

#### Returns

[`DefaultZoomBehavior`](#defaultzoombehavior)

***

### getInverseZoomScale()

```ts
function getInverseZoomScale(source: ZoomScaleSource, fallback?: number): number;
```

#### Parameters

| Parameter | Type | Default value |
| ------ | ------ | ------ |
| `source` | [`ZoomScaleSource`](#zoomscalesource) | `undefined` |
| `fallback` | `number` | `1` |

#### Returns

`number`

***

### getZoomScale()

```ts
function getZoomScale(source: ZoomScaleSource): number;
```

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `source` | [`ZoomScaleSource`](#zoomscalesource) |

#### Returns

`number`

***

### setupZoom()

```ts
function setupZoom(options: SetupZoomOptions): void;
```

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `options` | [`SetupZoomOptions`](#setupzoomoptions) |

#### Returns

`void`

## Variables

### ZOOM\_DEFAULTS

```ts
const ZOOM_DEFAULTS: {
  center: [number, number];
  maxZoom: number;
  minZoom: number;
  zoom: number;
};
```

#### Type Declaration

##### center

```ts
center: [number, number];
```

##### maxZoom

```ts
maxZoom: number = 8;
```

##### minZoom

```ts
minZoom: number = 1;
```

##### zoom

```ts
zoom: number = 1;
```

## Interfaces

### ApplyZoomOptions

#### Extended by

* [`SetupZoomOptions`](#setupzoomoptions)

#### Properties

| Property | Type |
| ------ | ------ |
| <a id="property-behavior"></a> `behavior` | [`DefaultZoomBehavior`](#defaultzoombehavior) |
| <a id="property-center"></a> `center?` | \[`number`, `number`] |
| <a id="property-element"></a> `element` | [`ZoomTargetElement`](#zoomtargetelement) | `null` | `undefined` |
| <a id="property-zoom"></a> `zoom?` | `number` |

***

### D3ZoomEvent

A D3 Zoom Event

The first generic refers to the type of reference element to which the zoom behavior is attached.
The second generic refers to the type of the datum of the reference element.

#### Extended by

* [`ZoomEvent`](#zoomevent)

#### Type Parameters

| Type Parameter |
| ------ |
| `ZoomRefElement` *extends* `ZoomedElementBaseType` |
| `Datum` |

#### Properties

| Property | Type | Description |
| ------ | ------ | ------ |
| <a id="property-sourceevent"></a> `sourceEvent` | `any` | The underlying input event, such as mousemove or touchmove. |
| <a id="property-target"></a> `target` | [`ZoomBehavior`](#zoombehavior)<`ZoomRefElement`, `Datum`> | The ZoomBehavior associated with the event |
| <a id="property-transform"></a> `transform` | [`ZoomTransform`](#zoomtransform) | The current zoom transform |
| <a id="property-type"></a> `type` | `string` | The event type for the zoom event |

***

### DefaultZoomBehavior()

A D3 Zoom Behavior

The first generic refers to the type of reference element to which the zoom behavior is attached.
The second generic refers to the type of the datum of the reference element.

#### Extends

* [`ZoomBehavior`](#zoombehavior)<`SVGSVGElement`, `unknown`>

```ts
DefaultZoomBehavior(selection: Selection<SVGSVGElement, unknown, any, any>, ...args: any[]): void;
```

Applies this zoom behavior to the specified selection, binding the necessary event listeners to
allow panning and zooming, and initializing the zoom transform on each selected element to the identity transform if not already defined. This function is typically not invoked directly,
and is instead invoked via selection.call.

For details see: <https://github.com/d3/d3-zoom#_zoom>

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `selection` | `Selection`<`SVGSVGElement`, `unknown`, `any`, `any`> | A D3 selection of elements. |
| ...`args` | `any`\[] | Optional arguments to be passed in. |

#### Returns

`void`

#### Methods

##### \[hasInstance]\()

```ts
hasInstance: boolean;
```

Determines whether the given value inherits from this function if this function was used
as a constructor function.

A constructor function can control which objects are recognized as its instances by
'instanceof' by overriding this method.

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `any` |

###### Returns

`boolean`

###### Inherited from

[`ZoomBehavior`](#zoombehavior).[`[hasInstance]`](#hasinstance-1)

##### apply()

```ts
apply(
   this: Function, 
   thisArg: any, 
   argArray?: any): any;
```

Calls the function, substituting the specified object for the this value of the function, and the specified array for the arguments of the function.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `this` | `Function` | - |
| `thisArg` | `any` | The object to be used as the this object. |
| `argArray?` | `any` | A set of arguments to be passed to the function. |

###### Returns

`any`

###### Inherited from

[`ZoomBehavior`](#zoombehavior).[`apply`](#apply-1)

##### bind()

```ts
bind(
   this: Function, 
   thisArg: any, ...
   argArray: any[]): any;
```

For a given function, creates a bound function that has the same body as the original function.
The this object of the bound function is associated with the specified object, and has the specified initial parameters.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `this` | `Function` | - |
| `thisArg` | `any` | An object to which the this keyword can refer inside the new function. |
| ...`argArray` | `any`\[] | A list of arguments to be passed to the new function. |

###### Returns

`any`

###### Inherited from

[`ZoomBehavior`](#zoombehavior).[`bind`](#bind-1)

##### call()

```ts
call(
   this: Function, 
   thisArg: any, ...
   argArray: any[]): any;
```

Calls a method of an object, substituting another object for the current object.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `this` | `Function` | - |
| `thisArg` | `any` | The object to be used as the current object. |
| ...`argArray` | `any`\[] | A list of arguments to be passed to the method. |

###### Returns

`any`

###### Inherited from

[`ZoomBehavior`](#zoombehavior).[`call`](#call-1)

##### clickDistance()

###### Call Signature

```ts
clickDistance(): number;
```

Return the current click distance threshold, which defaults to zero.

###### Returns

`number`

###### Inherited from

[`ZoomBehavior`](#zoombehavior).[`clickDistance`](#clickdistance-1)

###### Call Signature

```ts
clickDistance(distance: number): this;
```

Set the maximum distance that the mouse can move between mousedown and mouseup that will trigger
a subsequent click event. If at any point between mousedown and mouseup the mouse is greater than or equal to
distance from its position on mousedown, the click event following mouseup will be suppressed.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `distance` | `number` | The distance threshold between mousedown and mouseup measured in client coordinates (event.clientX and event.clientY). The default is zero. |

###### Returns

`this`

###### Inherited from

[`ZoomBehavior`](#zoombehavior).[`clickDistance`](#clickdistance-1)

##### constrain()

###### Call Signature

```ts
constrain(): (transform: ZoomTransform, extent: [[number, number], [number, number]], translateExtent: [[number, number], [number, number]]) => ZoomTransform;
```

Returns the current constraint function.
The default implementation attempts to ensure that the viewport extent does not go outside the translate extent.

###### Returns

```ts
(
   transform: ZoomTransform, 
   extent: [[number, number], [number, number]], 
   translateExtent: [[number, number], [number, number]]): ZoomTransform;
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `transform` | [`ZoomTransform`](#zoomtransform) |
| `extent` | \[\[`number`, `number`], \[`number`, `number`]] |
| `translateExtent` | \[\[`number`, `number`], \[`number`, `number`]] |

###### Returns

[`ZoomTransform`](#zoomtransform)

###### Inherited from

[`ZoomBehavior`](#zoombehavior).[`constrain`](#constrain-1)

###### Call Signature

```ts
constrain(constraint: (transform: ZoomTransform, extent: [[number, number], [number, number]], translateExtent: [[number, number], [number, number]]) => ZoomTransform): this;
```

Sets the transform constraint function to the specified function and returns the zoom behavior.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `constraint` | (`transform`: [`ZoomTransform`](#zoomtransform), `extent`: \[\[`number`, `number`], \[`number`, `number`]], `translateExtent`: \[\[`number`, `number`], \[`number`, `number`]]) => [`ZoomTransform`](#zoomtransform) | A constraint function which returns a transform given the current transform, viewport extent and translate extent. The default implementation attempts to ensure that the viewport extent does not go outside the translate extent. |

###### Returns

`this`

###### Inherited from

[`ZoomBehavior`](#zoombehavior).[`constrain`](#constrain-1)

##### duration()

###### Call Signature

```ts
duration(): number;
```

Get the duration for zoom transitions on double-click and double-tap in milliseconds.

###### Returns

`number`

###### Inherited from

[`ZoomBehavior`](#zoombehavior).[`duration`](#duration-1)

###### Call Signature

```ts
duration(duration: number): this;
```

Set the duration for zoom transitions on double-click and double-tap to the specified number of milliseconds and returns the zoom behavior.

To disable double-click and double-tap transitions, you can remove the zoom behavior’s dblclick event listener after applying the zoom behavior to the selection.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `duration` | `number` | in milliseconds. |

###### Returns

`this`

###### Inherited from

[`ZoomBehavior`](#zoombehavior).[`duration`](#duration-1)

##### extent()

###### Call Signature

```ts
extent(): (this: SVGSVGElement, datum: unknown) => [[number, number], [number, number]];
```

Return the current extent accessor, which defaults to \[\[0, 0], \[width, height]] where width is the client width of the element and height is its client height;
for SVG elements, the nearest ancestor SVG element’s width and height is used. In this case,
the owner SVG element must have defined width and height attributes rather than (for example) relying on CSS properties or the viewBox attribute;
SVG provides no programmatic method for retrieving the initial viewport size. Alternatively, consider using element.getBoundingClientRect.
(In Firefox, element.clientWidth and element.clientHeight is zero for SVG elements!)

###### Returns

```ts
(this: SVGSVGElement, datum: unknown): [[number, number], [number, number]];
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `this` | `SVGSVGElement` |
| `datum` | `unknown` |

###### Returns

\[\[`number`, `number`], \[`number`, `number`]]

###### Inherited from

[`ZoomBehavior`](#zoombehavior).[`extent`](#extent-1)

###### Call Signature

```ts
extent(extent: [[number, number], [number, number]]): this;
```

Set the viewport extent to the specified array of points \[\[x0, y0], \[x1, y1]],
where \[x0, y0] is the top-left corner of the viewport and \[x1, y1] is the bottom-right corner of the viewport,
and return this zoom behavior.

The viewport extent affects several functions: the center of the viewport remains fixed during changes by zoom.scaleBy and zoom.scaleTo;
the viewport center and dimensions affect the path chosen by d3.interpolateZoom; and the viewport extent is needed to enforce the optional translate extent.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `extent` | \[\[`number`, `number`], \[`number`, `number`]] | An extent specified as an array of two coordinates. |

###### Returns

`this`

###### Inherited from

[`ZoomBehavior`](#zoombehavior).[`extent`](#extent-1)

###### Call Signature

```ts
extent(extent: (this: SVGSVGElement, datum: unknown) => [[number, number], [number, number]]): this;
```

Set the viewport extent to the array of points \[\[x0, y0], \[x1, y1]] returned by the
extent accessor function, and return this zoom behavior.
The extent accessor function is evaluated for each element.

\[x0, y0] is the top-left corner of the viewport and \[x1, y1] is the bottom-right corner of the viewport.

The viewport extent affects several functions: the center of the viewport remains fixed during changes by zoom.scaleBy and zoom.scaleTo;
the viewport center and dimensions affect the path chosen by d3.interpolateZoom; and the viewport extent is needed to enforce the optional translate extent.

The default is \[\[0, 0], \[width, height]] where width is the client width of the element and height is its client height;
for SVG elements, the nearest ancestor SVG element’s width and height is used.
In this case, the owner SVG element must have defined width and height attributes rather than (for example) relying on CSS properties or the viewBox attribute;
SVG provides no programmatic method for retrieving the initial viewport size. Alternatively, consider using element.getBoundingClientRect.
(In Firefox, element.clientWidth and element.clientHeight is zero for SVG elements!)

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `extent` | (`this`: `SVGSVGElement`, `datum`: `unknown`) => \[\[`number`, `number`], \[`number`, `number`]] | An extent accessor function which is evaluated for each selected element, being passed the current datum d, with the this context as the current DOM element. The function returns the extent array. |

###### Returns

`this`

###### Inherited from

[`ZoomBehavior`](#zoombehavior).[`extent`](#extent-1)

##### filter()

###### Call Signature

```ts
filter(): (this: SVGSVGElement, event: any, datum: unknown) => boolean;
```

Returns the current filter function.

###### Returns

```ts
(
   this: SVGSVGElement, 
   event: any, 
   datum: unknown): boolean;
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `this` | `SVGSVGElement` |
| `event` | `any` |
| `datum` | `unknown` |

###### Returns

`boolean`

###### Inherited from

[`ZoomBehavior`](#zoombehavior).[`filter`](#filter-1)

###### Call Signature

```ts
filter(filter: (this: SVGSVGElement, event: any, datum: unknown) => boolean): this;
```

Sets the filter to the specified filter function and returns the zoom behavior.
The filter function is invoked in the zoom initiating event handlers of each element to which the zoom behavior was applied.

If the filter returns falsey, the initiating event is ignored and no zoom gesture is started.
Thus, the filter determines which input events are ignored. The default filter ignores mousedown events on secondary buttons,
since those buttons are typically intended for other purposes, such as the context menu.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `filter` | (`this`: `SVGSVGElement`, `event`: `any`, `datum`: `unknown`) => `boolean` | A filter function which is invoked in the zoom initiating event handlers of each element to which the zoom behavior was applied, in order, being passed the current event (event) and datum d, with the this context as the current DOM element. The function returns a boolean value. |

###### Returns

`this`

###### Inherited from

[`ZoomBehavior`](#zoombehavior).[`filter`](#filter-1)

##### interpolate()

###### Call Signature

```ts
interpolate<InterpolationFactory>(): InterpolationFactory;
```

Returns the current interpolation factory, which defaults to d3.interpolateZoom to implement smooth zooming.

###### Type Parameters

| Type Parameter |
| ------ |
| `InterpolationFactory` *extends* (`a`: `ZoomView`, `b`: `ZoomView`) => (`t`: `number`) => `ZoomView` |

###### Returns

`InterpolationFactory`

###### Inherited from

[`ZoomBehavior`](#zoombehavior).[`interpolate`](#interpolate-1)

###### Call Signature

```ts
interpolate(interpolatorFactory: (a: ZoomView, b: ZoomView) => (t: number) => ZoomView): this;
```

Sets the interpolation factory for zoom transitions to the specified function.
Use the default d3.interpolateZoom to implement smooth zooming.
To apply direct interpolation between two views, try d3.interpolate instead.

Each view is defined as an array of three numbers: cx, cy and width. The first two coordinates cx, cy represent the center of the viewport;
the last coordinate width represents the size of the viewport.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `interpolatorFactory` | (`a`: `ZoomView`, `b`: `ZoomView`) => (`t`: `number`) => `ZoomView` | An interpolator factory to be used to generate interpolators between zooms for transitions. |

###### Returns

`this`

###### Inherited from

[`ZoomBehavior`](#zoombehavior).[`interpolate`](#interpolate-1)

##### on()

###### Call Signature

```ts
on(typenames: string): 
  | (this: SVGSVGElement, event: any, d: unknown) => void
  | undefined;
```

Return the first currently-assigned listener matching the specified typenames, if any.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `typenames` | `string` | The typenames is a string containing one or more typename separated by whitespace. Each typename is a type, optionally followed by a period (.) and a name, such as "drag.foo"" and "drag.bar"; the name allows multiple listeners to be registered for the same type. The type must be one of the following: start (after zooming begins \[such as mousedown]), zoom (after a change to the zoom transform \[such as mousemove], or end (after an active pointer becomes inactive \[such as on mouseup].) |

###### Returns

| (`this`: `SVGSVGElement`, `event`: `any`, `d`: `unknown`) => `void`
| `undefined`

###### Inherited from

[`ZoomBehavior`](#zoombehavior).[`on`](#on-1)

###### Call Signature

```ts
on(typenames: string, listener: null): this;
```

Remove the current event listeners for the specified typenames, if any, return the drag behavior.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `typenames` | `string` | The typenames is a string containing one or more typename separated by whitespace. Each typename is a type, optionally followed by a period (.) and a name, such as "drag.foo"" and "drag.bar"; the name allows multiple listeners to be registered for the same type. The type must be one of the following: start (after zooming begins \[such as mousedown]), zoom (after a change to the zoom transform \[such as mousemove], or end (after an active pointer becomes inactive \[such as on mouseup].) |
| `listener` | `null` | Use null to remove the listener. |

###### Returns

`this`

###### Inherited from

[`ZoomBehavior`](#zoombehavior).[`on`](#on-1)

###### Call Signature

```ts
on(typenames: string, listener: (this: SVGSVGElement, event: any, d: unknown) => void): this;
```

Set the event listener for the specified typenames and return the zoom behavior.
If an event listener was already registered for the same type and name,
the existing listener is removed before the new listener is added.
When a specified event is dispatched, each listener will be invoked with the same context and arguments as selection.on listeners.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `typenames` | `string` | The typenames is a string containing one or more typename separated by whitespace. Each typename is a type, optionally followed by a period (.) and a name, such as "drag.foo"" and "drag.bar"; the name allows multiple listeners to be registered for the same type. The type must be one of the following: start (after zooming begins \[such as mousedown]), zoom (after a change to the zoom transform \[such as mousemove], or end (after an active pointer becomes inactive \[such as on mouseup].) |
| `listener` | (`this`: `SVGSVGElement`, `event`: `any`, `d`: `unknown`) => `void` | An event listener function which is evaluated for each selected element, in order, being passed the current event (event) and datum d, with the this context as the current DOM element. |

###### Returns

`this`

###### Inherited from

[`ZoomBehavior`](#zoombehavior).[`on`](#on-1)

##### scaleBy()

```ts
scaleBy(
   selection: 
  | Selection<SVGSVGElement, unknown, any, any>
  | TransitionLike<SVGSVGElement, unknown>, 
   k: number | ValueFn<SVGSVGElement, unknown, number>, 
   p?: 
  | [number, number]
  | ValueFn<SVGSVGElement, unknown, [number, number]>): void;
```

If selection is a selection, scales the current zoom transform of the selected elements by k, such that the new k₁ = k₀k.
The reference point p does move.
If p is not specified, it defaults to the center of the viewport extent.
If selection is a transition, defines a “zoom” tween translating the current transform.
This method is a convenience method for zoom.transform.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `selection` | | `Selection`<`SVGSVGElement`, `unknown`, `any`, `any`> | `TransitionLike`<`SVGSVGElement`, `unknown`> | A selection or a transition. |
| `k` | `number` | `ValueFn`<`SVGSVGElement`, `unknown`, `number`> | Scale factor. A number or a function that returns a number. If a function, it is invoked for each selected element, being passed the current datum d and index i, with the this context as the current DOM element. |
| `p?` | | \[`number`, `number`] | `ValueFn`<`SVGSVGElement`, `unknown`, \[`number`, `number`]> | A two-element array \[px,py] or a function. If a function, it is invoked for each selected element, being passed the current datum d and index i, with the this context as the current DOM element. |

###### Returns

`void`

###### Inherited from

[`ZoomBehavior`](#zoombehavior).[`scaleBy`](#scaleby-1)

##### scaleExtent()

###### Call Signature

```ts
scaleExtent(): [number, number];
```

Return the current scale extent.

###### Returns

\[`number`, `number`]

###### Inherited from

[`ZoomBehavior`](#zoombehavior).[`scaleExtent`](#scaleextent-1)

###### Call Signature

```ts
scaleExtent(extent: [number, number]): this;
```

Set the scale extent to the specified array of numbers \[k0, k1] where k0 is the minimum allowed scale factor and k1 is the maximum allowed scale factor,
and return this zoom behavior.

The scale extent restricts zooming in and out. It is enforced on interaction and when using zoom.scaleBy, zoom.scaleTo and zoom.translateBy;
however, it is not enforced when using zoom.transform to set the transform explicitly.

The default scale extent is \[0, infinity].

If the user tries to zoom by wheeling when already at the corresponding limit of the scale extent, the wheel events will be ignored and not initiate a zoom gesture.
This allows the user to scroll down past a zoomable area after zooming in, or to scroll up after zooming out.
If you would prefer to always prevent scrolling on wheel input regardless of the scale extent, register a wheel event listener to prevent the browser default behavior

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `extent` | \[`number`, `number`] | A scale extent array of two numbers representing the scale boundaries. |

###### Returns

`this`

###### Inherited from

[`ZoomBehavior`](#zoombehavior).[`scaleExtent`](#scaleextent-1)

##### scaleTo()

```ts
scaleTo(
   selection: 
  | Selection<SVGSVGElement, unknown, any, any>
  | TransitionLike<SVGSVGElement, unknown>, 
   k: number | ValueFn<SVGSVGElement, unknown, number>, 
   p?: [number, number]): void;
```

If selection is a selection, scales the current zoom transform of the selected elements to k, such that the new k₁ = k.
The reference point p does move.
If p is not specified, it defaults to the center of the viewport extent.
If selection is a transition, defines a “zoom” tween translating the current transform.
This method is a convenience method for zoom.transform.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `selection` | | `Selection`<`SVGSVGElement`, `unknown`, `any`, `any`> | `TransitionLike`<`SVGSVGElement`, `unknown`> | - |
| `k` | `number` | `ValueFn`<`SVGSVGElement`, `unknown`, `number`> | Scale factor. A number or a function that returns a number. If a function, it is invoked for each selected element, being passed the current datum d and index i, with the this context as the current DOM element. |
| `p?` | \[`number`, `number`] | A two-element array \[px,py] or a function. If a function, it is invoked for each selected element, being passed the current datum d and index i, with the this context as the current DOM element. |

###### Returns

`void`

###### Inherited from

[`ZoomBehavior`](#zoombehavior).[`scaleTo`](#scaleto-1)

##### tapDistance()

###### Call Signature

```ts
tapDistance(): number;
```

Return the current tap distance threshold, which defaults to 10.

###### Returns

`number`

###### Inherited from

[`ZoomBehavior`](#zoombehavior).[`tapDistance`](#tapdistance-1)

###### Call Signature

```ts
tapDistance(distance: number): this;
```

Sets the maximum distance that a double-tap gesture can move between first touchstart and second touchend that will trigger a subsequent double-click event.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `distance` | `number` | The distance threshold between mousedown and mouseup measured in client coordinates (event.clientX and event.clientY). The default is 10. |

###### Returns

`this`

###### Inherited from

[`ZoomBehavior`](#zoombehavior).[`tapDistance`](#tapdistance-1)

##### toString()

```ts
toString(): string;
```

Returns a string representation of a function.

###### Returns

`string`

###### Inherited from

[`ZoomBehavior`](#zoombehavior).[`toString`](#tostring-1)

##### touchable()

###### Call Signature

```ts
touchable(): ValueFn<SVGSVGElement, unknown, boolean>;
```

Returns the current touch support detector, which defaults to a function returning true,
if the "ontouchstart" event is supported on the current element.

###### Returns

`ValueFn`<`SVGSVGElement`, `unknown`, `boolean`>

###### Inherited from

[`ZoomBehavior`](#zoombehavior).[`touchable`](#touchable-1)

###### Call Signature

```ts
touchable(touchable: boolean): this;
```

Sets the touch support detector to the specified boolean value and returns the zoom behavior.

Touch event listeners are only registered if the detector returns truthy for the corresponding element when the zoom behavior is applied.
The default detector works well for most browsers that are capable of touch input, but not all; Chrome’s mobile device emulator, for example,
fails detection.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `touchable` | `boolean` | A boolean value. true when touch event listeners should be applied to the corresponding element, otherwise false. |

###### Returns

`this`

###### Inherited from

[`ZoomBehavior`](#zoombehavior).[`touchable`](#touchable-1)

###### Call Signature

```ts
touchable(touchable: ValueFn<SVGSVGElement, unknown, boolean>): this;
```

Sets the touch support detector to the specified function and returns the zoom behavior.

Touch event listeners are only registered if the detector returns truthy for the corresponding element when the zoom behavior is applied.
The default detector works well for most browsers that are capable of touch input, but not all; Chrome’s mobile device emulator, for example,
fails detection.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `touchable` | `ValueFn`<`SVGSVGElement`, `unknown`, `boolean`> | A touch support detector function, which returns true when touch event listeners should be applied to the corresponding element. The function is evaluated for each selected element to which the zoom behavior was applied, in order, being passed the current datum (d), the current index (i), and the current group (nodes), with this as the current DOM element. The function returns a boolean value. |

###### Returns

`this`

###### Inherited from

[`ZoomBehavior`](#zoombehavior).[`touchable`](#touchable-1)

##### transform()

```ts
transform(
   selection: 
  | Selection<SVGSVGElement, unknown, any, any>
  | TransitionLike<SVGSVGElement, unknown>, 
   transform: 
  | ZoomTransform
  | (this: SVGSVGElement, event: any, d: unknown) => ZoomTransform, 
   point?: 
  | [number, number]
  | (this: SVGSVGElement, event: any, d: unknown) => [number, number]): void;
```

If selection is a selection, sets the current zoom transform of the selected elements to the specified transform, instantaneously emitting start, zoom and end events.
If selection is a transition, defines a “zoom” tween to the specified transform using d3.interpolateZoom, emitting a start event when the transition starts,
zoom events for each tick of the transition, and then an end event when the transition ends (or is interrupted).
The transition will attempt to minimize the visual movement around the specified point; if the point is not specified, it defaults to the center of the viewport extent.

This function is typically not invoked directly, and is instead invoked via selection.call or transition.call.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `selection` | | `Selection`<`SVGSVGElement`, `unknown`, `any`, `any`> | `TransitionLike`<`SVGSVGElement`, `unknown`> | A selection or a transition. |
| `transform` | | [`ZoomTransform`](#zoomtransform) | (`this`: `SVGSVGElement`, `event`: `any`, `d`: `unknown`) => [`ZoomTransform`](#zoomtransform) | A zoom transform or a function that returns a zoom transform. If a function, it is invoked for each selected element, being passed the current event (event) and datum d, with the this context as the current DOM element. |
| `point?` | | \[`number`, `number`] | (`this`: `SVGSVGElement`, `event`: `any`, `d`: `unknown`) => \[`number`, `number`] | A two-element array \[x, y] or a function that returns such an array. If a function, it is invoked for each selected element, being passed the current event (event) and datum d, with the this context as the current DOM element. |

###### Returns

`void`

###### Inherited from

[`ZoomBehavior`](#zoombehavior).[`transform`](#transform-1)

##### translateBy()

```ts
translateBy(
   selection: 
  | Selection<SVGSVGElement, unknown, any, any>
  | TransitionLike<SVGSVGElement, unknown>, 
   x: number | ValueFn<SVGSVGElement, unknown, number>, 
   y: number | ValueFn<SVGSVGElement, unknown, number>): void;
```

If selection is a selection, translates the current zoom transform of the selected elements by x and y, such that the new tx1 = tx0 + kx and ty1 = ty0 + ky.
If selection is a transition, defines a “zoom” tween translating the current transform.
This method is a convenience method for zoom.transform.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `selection` | | `Selection`<`SVGSVGElement`, `unknown`, `any`, `any`> | `TransitionLike`<`SVGSVGElement`, `unknown`> | A selection or a transition. |
| `x` | `number` | `ValueFn`<`SVGSVGElement`, `unknown`, `number`> | A number or a function that returns a number. If a function, it is invoked for each selected element, being passed the current datum d and index i, with the this context as the current DOM element. |
| `y` | `number` | `ValueFn`<`SVGSVGElement`, `unknown`, `number`> | A number or a function that returns a number. If a function, it is invoked for each selected element, being passed the current datum d and index i, with the this context as the current DOM element. |

###### Returns

`void`

###### Inherited from

[`ZoomBehavior`](#zoombehavior).[`translateBy`](#translateby-1)

##### translateExtent()

###### Call Signature

```ts
translateExtent(): [[number, number], [number, number]];
```

Return the current translate extent.

###### Returns

\[\[`number`, `number`], \[`number`, `number`]]

###### Inherited from

[`ZoomBehavior`](#zoombehavior).[`translateExtent`](#translateextent-1)

###### Call Signature

```ts
translateExtent(extent: [[number, number], [number, number]]): this;
```

Set the translate extent to the specified array of points \[\[x0, y0], \[x1, y1]], where \[x0, y0] is the top-left corner of the world and \[x1, y1]
is the bottom-right corner of the world, and return this zoom behavior.

The translate extent restricts panning, and may cause translation on zoom out. It is enforced on interaction and when using zoom.scaleBy, zoom.scaleTo and zoom.translateBy;
however, it is not enforced when using zoom.transform to set the transform explicitly.

The default scale extent is \[\[-infinity, infinity], \[-infinity, infinity]].

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `extent` | \[\[`number`, `number`], \[`number`, `number`]] | A translate extent array, i.e. an array of two arrays, each representing a point. |

###### Returns

`this`

###### Inherited from

[`ZoomBehavior`](#zoombehavior).[`translateExtent`](#translateextent-1)

##### translateTo()

```ts
translateTo(
   selection: 
  | Selection<SVGSVGElement, unknown, any, any>
  | TransitionLike<SVGSVGElement, unknown>, 
   x: number | ValueFn<SVGSVGElement, unknown, number>, 
   y: number | ValueFn<SVGSVGElement, unknown, number>, 
   p?: 
  | [number, number]
  | ValueFn<SVGSVGElement, unknown, [number, number]>): void;
```

If selection is a selection, translates the current zoom transform of the selected elements such that the given position ⟨x,y⟩ appears at given point p.
The new tx = px - kx and ty = py - ky. If p is not specified, it defaults to the center of the viewport extent.
If selection is a transition, defines a “zoom” tween translating the current transform. This method is a convenience method for zoom.transform.

Translates the current zoom transform of the selected elements such that the specified position ⟨x,y⟩ appears at the center of the viewport extent.
The new tx = cx - kx and ty = cy - ky, where ⟨cx,cy⟩ is the center.

x is provided as a constant for all elements.
y is provided as a constant for all elements.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `selection` | | `Selection`<`SVGSVGElement`, `unknown`, `any`, `any`> | `TransitionLike`<`SVGSVGElement`, `unknown`> | A selection or a transition. |
| `x` | `number` | `ValueFn`<`SVGSVGElement`, `unknown`, `number`> | A number or a function that returns a number. If a function, it is invoked for each selected element, being passed the current datum d and index i, with the this context as the current DOM element. |
| `y` | `number` | `ValueFn`<`SVGSVGElement`, `unknown`, `number`> | A number or a function that returns a number. If a function, it is invoked for each selected element, being passed the current datum d and index i, with the this context as the current DOM element. |
| `p?` | | \[`number`, `number`] | `ValueFn`<`SVGSVGElement`, `unknown`, \[`number`, `number`]> | A two-element array \[px,py] or a function If a function, it is invoked for each selected element, being passed the current datum d and index i, with the this context as the current DOM element. |

###### Returns

`void`

###### Inherited from

[`ZoomBehavior`](#zoombehavior).[`translateTo`](#translateto-1)

##### wheelDelta()

###### Call Signature

```ts
wheelDelta(): ValueFn<SVGSVGElement, unknown, number>;
```

Returns the current wheelDelta function.

###### Returns

`ValueFn`<`SVGSVGElement`, `unknown`, `number`>

###### Inherited from

[`ZoomBehavior`](#zoombehavior).[`wheelDelta`](#wheeldelta-1)

###### Call Signature

```ts
wheelDelta(delta: number | (event: WheelEvent) => number): this;
```

Sets the wheel delta function to the specified function and returns the zoom behavior. The wheel delta function which is invoked in the wheel event handler
of each element to which the zoom behavior was applied.
The value Δ returned by the wheel delta function determines the amount of scaling applied in response to a WheelEvent.
The scale factor transform.k is multiplied by 2Δ; for example, a Δ of +1 doubles the scale factor, Δ of -1 halves the scale factor.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `delta` | `number` | (`event`: `WheelEvent`) => `number` | Wheel delta function which is invoked in the wheel event handler of each element to which the zoom behavior was applied, in order, being passed the wheel event that triggered the handler, with this as the current DOM element. The function returns a numeric value. |

###### Returns

`this`

###### Inherited from

[`ZoomBehavior`](#zoombehavior).[`wheelDelta`](#wheeldelta-1)

#### Properties

| Property | Modifier | Type | Description | Inherited from |
| ------ | ------ | ------ | ------ | ------ |
| <a id="property-metadata"></a> `[metadata]` | `public` | `DecoratorMetadataObject` | `null` | - | [`ZoomBehavior`](#zoombehavior).[`[metadata]`](#property-metadata-1) |
| <a id="property-arguments"></a> `arguments` | `public` | `any` | - | [`ZoomBehavior`](#zoombehavior).[`arguments`](#property-arguments-1) |
| <a id="property-caller"></a> `caller` | `public` | `Function` | - | [`ZoomBehavior`](#zoombehavior).[`caller`](#property-caller-1) |
| <a id="property-length"></a> `length` | `readonly` | `number` | - | [`ZoomBehavior`](#zoombehavior).[`length`](#property-length-1) |
| <a id="property-name"></a> `name` | `readonly` | `string` | Returns the name of the function. Function names are read-only and can not be changed. | [`ZoomBehavior`](#zoombehavior).[`name`](#property-name-1) |
| <a id="property-prototype"></a> `prototype` | `public` | `any` | - | [`ZoomBehavior`](#zoombehavior).[`prototype`](#property-prototype-1) |

***

### SetupZoomOptions

#### Extends

* [`ApplyZoomOptions`](#applyzoomoptions)

#### Properties

| Property | Type | Inherited from |
| ------ | ------ | ------ |
| <a id="property-behavior-1"></a> `behavior` | [`DefaultZoomBehavior`](#defaultzoombehavior) | [`ApplyZoomOptions`](#applyzoomoptions).[`behavior`](#property-behavior) |
| <a id="property-center-1"></a> `center?` | \[`number`, `number`] | [`ApplyZoomOptions`](#applyzoomoptions).[`center`](#property-center) |
| <a id="property-element-1"></a> `element` | [`ZoomTargetElement`](#zoomtargetelement) | `null` | `undefined` | [`ApplyZoomOptions`](#applyzoomoptions).[`element`](#property-element) |
| <a id="property-zoom-1"></a> `zoom?` | `number` | [`ApplyZoomOptions`](#applyzoomoptions).[`zoom`](#property-zoom) |

***

### ZoomBehavior()

A D3 Zoom Behavior

The first generic refers to the type of reference element to which the zoom behavior is attached.
The second generic refers to the type of the datum of the reference element.

#### Extends

* `Function`

#### Extended by

* [`DefaultZoomBehavior`](#defaultzoombehavior)

#### Type Parameters

| Type Parameter |
| ------ |
| `ZoomRefElement` *extends* `ZoomedElementBaseType` |
| `Datum` |

```ts
ZoomBehavior(selection: Selection<ZoomRefElement, Datum, any, any>, ...args: any[]): void;
```

Applies this zoom behavior to the specified selection, binding the necessary event listeners to
allow panning and zooming, and initializing the zoom transform on each selected element to the identity transform if not already defined. This function is typically not invoked directly,
and is instead invoked via selection.call.

For details see: <https://github.com/d3/d3-zoom#_zoom>

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `selection` | `Selection`<`ZoomRefElement`, `Datum`, `any`, `any`> | A D3 selection of elements. |
| ...`args` | `any`\[] | Optional arguments to be passed in. |

#### Returns

`void`

#### Methods

##### \[hasInstance]\()

```ts
hasInstance: boolean;
```

Determines whether the given value inherits from this function if this function was used
as a constructor function.

A constructor function can control which objects are recognized as its instances by
'instanceof' by overriding this method.

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `any` |

###### Returns

`boolean`

###### Inherited from

```ts
Function.[hasInstance]
```

##### apply()

```ts
apply(
   this: Function, 
   thisArg: any, 
   argArray?: any): any;
```

Calls the function, substituting the specified object for the this value of the function, and the specified array for the arguments of the function.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `this` | `Function` | - |
| `thisArg` | `any` | The object to be used as the this object. |
| `argArray?` | `any` | A set of arguments to be passed to the function. |

###### Returns

`any`

###### Inherited from

```ts
Function.apply
```

##### bind()

```ts
bind(
   this: Function, 
   thisArg: any, ...
   argArray: any[]): any;
```

For a given function, creates a bound function that has the same body as the original function.
The this object of the bound function is associated with the specified object, and has the specified initial parameters.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `this` | `Function` | - |
| `thisArg` | `any` | An object to which the this keyword can refer inside the new function. |
| ...`argArray` | `any`\[] | A list of arguments to be passed to the new function. |

###### Returns

`any`

###### Inherited from

```ts
Function.bind
```

##### call()

```ts
call(
   this: Function, 
   thisArg: any, ...
   argArray: any[]): any;
```

Calls a method of an object, substituting another object for the current object.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `this` | `Function` | - |
| `thisArg` | `any` | The object to be used as the current object. |
| ...`argArray` | `any`\[] | A list of arguments to be passed to the method. |

###### Returns

`any`

###### Inherited from

```ts
Function.call
```

##### clickDistance()

###### Call Signature

```ts
clickDistance(): number;
```

Return the current click distance threshold, which defaults to zero.

###### Returns

`number`

###### Call Signature

```ts
clickDistance(distance: number): this;
```

Set the maximum distance that the mouse can move between mousedown and mouseup that will trigger
a subsequent click event. If at any point between mousedown and mouseup the mouse is greater than or equal to
distance from its position on mousedown, the click event following mouseup will be suppressed.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `distance` | `number` | The distance threshold between mousedown and mouseup measured in client coordinates (event.clientX and event.clientY). The default is zero. |

###### Returns

`this`

##### constrain()

###### Call Signature

```ts
constrain(): (transform: ZoomTransform, extent: [[number, number], [number, number]], translateExtent: [[number, number], [number, number]]) => ZoomTransform;
```

Returns the current constraint function.
The default implementation attempts to ensure that the viewport extent does not go outside the translate extent.

###### Returns

```ts
(
   transform: ZoomTransform, 
   extent: [[number, number], [number, number]], 
   translateExtent: [[number, number], [number, number]]): ZoomTransform;
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `transform` | [`ZoomTransform`](#zoomtransform) |
| `extent` | \[\[`number`, `number`], \[`number`, `number`]] |
| `translateExtent` | \[\[`number`, `number`], \[`number`, `number`]] |

###### Returns

[`ZoomTransform`](#zoomtransform)

###### Call Signature

```ts
constrain(constraint: (transform: ZoomTransform, extent: [[number, number], [number, number]], translateExtent: [[number, number], [number, number]]) => ZoomTransform): this;
```

Sets the transform constraint function to the specified function and returns the zoom behavior.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `constraint` | (`transform`: [`ZoomTransform`](#zoomtransform), `extent`: \[\[`number`, `number`], \[`number`, `number`]], `translateExtent`: \[\[`number`, `number`], \[`number`, `number`]]) => [`ZoomTransform`](#zoomtransform) | A constraint function which returns a transform given the current transform, viewport extent and translate extent. The default implementation attempts to ensure that the viewport extent does not go outside the translate extent. |

###### Returns

`this`

##### duration()

###### Call Signature

```ts
duration(): number;
```

Get the duration for zoom transitions on double-click and double-tap in milliseconds.

###### Returns

`number`

###### Call Signature

```ts
duration(duration: number): this;
```

Set the duration for zoom transitions on double-click and double-tap to the specified number of milliseconds and returns the zoom behavior.

To disable double-click and double-tap transitions, you can remove the zoom behavior’s dblclick event listener after applying the zoom behavior to the selection.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `duration` | `number` | in milliseconds. |

###### Returns

`this`

##### extent()

###### Call Signature

```ts
extent(): (this: ZoomRefElement, datum: Datum) => [[number, number], [number, number]];
```

Return the current extent accessor, which defaults to \[\[0, 0], \[width, height]] where width is the client width of the element and height is its client height;
for SVG elements, the nearest ancestor SVG element’s width and height is used. In this case,
the owner SVG element must have defined width and height attributes rather than (for example) relying on CSS properties or the viewBox attribute;
SVG provides no programmatic method for retrieving the initial viewport size. Alternatively, consider using element.getBoundingClientRect.
(In Firefox, element.clientWidth and element.clientHeight is zero for SVG elements!)

###### Returns

```ts
(this: ZoomRefElement, datum: Datum): [[number, number], [number, number]];
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `this` | `ZoomRefElement` |
| `datum` | `Datum` |

###### Returns

\[\[`number`, `number`], \[`number`, `number`]]

###### Call Signature

```ts
extent(extent: [[number, number], [number, number]]): this;
```

Set the viewport extent to the specified array of points \[\[x0, y0], \[x1, y1]],
where \[x0, y0] is the top-left corner of the viewport and \[x1, y1] is the bottom-right corner of the viewport,
and return this zoom behavior.

The viewport extent affects several functions: the center of the viewport remains fixed during changes by zoom.scaleBy and zoom.scaleTo;
the viewport center and dimensions affect the path chosen by d3.interpolateZoom; and the viewport extent is needed to enforce the optional translate extent.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `extent` | \[\[`number`, `number`], \[`number`, `number`]] | An extent specified as an array of two coordinates. |

###### Returns

`this`

###### Call Signature

```ts
extent(extent: (this: ZoomRefElement, datum: Datum) => [[number, number], [number, number]]): this;
```

Set the viewport extent to the array of points \[\[x0, y0], \[x1, y1]] returned by the
extent accessor function, and return this zoom behavior.
The extent accessor function is evaluated for each element.

\[x0, y0] is the top-left corner of the viewport and \[x1, y1] is the bottom-right corner of the viewport.

The viewport extent affects several functions: the center of the viewport remains fixed during changes by zoom.scaleBy and zoom.scaleTo;
the viewport center and dimensions affect the path chosen by d3.interpolateZoom; and the viewport extent is needed to enforce the optional translate extent.

The default is \[\[0, 0], \[width, height]] where width is the client width of the element and height is its client height;
for SVG elements, the nearest ancestor SVG element’s width and height is used.
In this case, the owner SVG element must have defined width and height attributes rather than (for example) relying on CSS properties or the viewBox attribute;
SVG provides no programmatic method for retrieving the initial viewport size. Alternatively, consider using element.getBoundingClientRect.
(In Firefox, element.clientWidth and element.clientHeight is zero for SVG elements!)

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `extent` | (`this`: `ZoomRefElement`, `datum`: `Datum`) => \[\[`number`, `number`], \[`number`, `number`]] | An extent accessor function which is evaluated for each selected element, being passed the current datum d, with the this context as the current DOM element. The function returns the extent array. |

###### Returns

`this`

##### filter()

###### Call Signature

```ts
filter(): (this: ZoomRefElement, event: any, datum: Datum) => boolean;
```

Returns the current filter function.

###### Returns

```ts
(
   this: ZoomRefElement, 
   event: any, 
   datum: Datum): boolean;
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `this` | `ZoomRefElement` |
| `event` | `any` |
| `datum` | `Datum` |

###### Returns

`boolean`

###### Call Signature

```ts
filter(filter: (this: ZoomRefElement, event: any, datum: Datum) => boolean): this;
```

Sets the filter to the specified filter function and returns the zoom behavior.
The filter function is invoked in the zoom initiating event handlers of each element to which the zoom behavior was applied.

If the filter returns falsey, the initiating event is ignored and no zoom gesture is started.
Thus, the filter determines which input events are ignored. The default filter ignores mousedown events on secondary buttons,
since those buttons are typically intended for other purposes, such as the context menu.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `filter` | (`this`: `ZoomRefElement`, `event`: `any`, `datum`: `Datum`) => `boolean` | A filter function which is invoked in the zoom initiating event handlers of each element to which the zoom behavior was applied, in order, being passed the current event (event) and datum d, with the this context as the current DOM element. The function returns a boolean value. |

###### Returns

`this`

##### interpolate()

###### Call Signature

```ts
interpolate<InterpolationFactory>(): InterpolationFactory;
```

Returns the current interpolation factory, which defaults to d3.interpolateZoom to implement smooth zooming.

###### Type Parameters

| Type Parameter |
| ------ |
| `InterpolationFactory` *extends* (`a`: `ZoomView`, `b`: `ZoomView`) => (`t`: `number`) => `ZoomView` |

###### Returns

`InterpolationFactory`

###### Call Signature

```ts
interpolate(interpolatorFactory: (a: ZoomView, b: ZoomView) => (t: number) => ZoomView): this;
```

Sets the interpolation factory for zoom transitions to the specified function.
Use the default d3.interpolateZoom to implement smooth zooming.
To apply direct interpolation between two views, try d3.interpolate instead.

Each view is defined as an array of three numbers: cx, cy and width. The first two coordinates cx, cy represent the center of the viewport;
the last coordinate width represents the size of the viewport.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `interpolatorFactory` | (`a`: `ZoomView`, `b`: `ZoomView`) => (`t`: `number`) => `ZoomView` | An interpolator factory to be used to generate interpolators between zooms for transitions. |

###### Returns

`this`

##### on()

###### Call Signature

```ts
on(typenames: string): 
  | (this: ZoomRefElement, event: any, d: Datum) => void
  | undefined;
```

Return the first currently-assigned listener matching the specified typenames, if any.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `typenames` | `string` | The typenames is a string containing one or more typename separated by whitespace. Each typename is a type, optionally followed by a period (.) and a name, such as "drag.foo"" and "drag.bar"; the name allows multiple listeners to be registered for the same type. The type must be one of the following: start (after zooming begins \[such as mousedown]), zoom (after a change to the zoom transform \[such as mousemove], or end (after an active pointer becomes inactive \[such as on mouseup].) |

###### Returns

| (`this`: `ZoomRefElement`, `event`: `any`, `d`: `Datum`) => `void`
| `undefined`

###### Call Signature

```ts
on(typenames: string, listener: null): this;
```

Remove the current event listeners for the specified typenames, if any, return the drag behavior.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `typenames` | `string` | The typenames is a string containing one or more typename separated by whitespace. Each typename is a type, optionally followed by a period (.) and a name, such as "drag.foo"" and "drag.bar"; the name allows multiple listeners to be registered for the same type. The type must be one of the following: start (after zooming begins \[such as mousedown]), zoom (after a change to the zoom transform \[such as mousemove], or end (after an active pointer becomes inactive \[such as on mouseup].) |
| `listener` | `null` | Use null to remove the listener. |

###### Returns

`this`

###### Call Signature

```ts
on(typenames: string, listener: (this: ZoomRefElement, event: any, d: Datum) => void): this;
```

Set the event listener for the specified typenames and return the zoom behavior.
If an event listener was already registered for the same type and name,
the existing listener is removed before the new listener is added.
When a specified event is dispatched, each listener will be invoked with the same context and arguments as selection.on listeners.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `typenames` | `string` | The typenames is a string containing one or more typename separated by whitespace. Each typename is a type, optionally followed by a period (.) and a name, such as "drag.foo"" and "drag.bar"; the name allows multiple listeners to be registered for the same type. The type must be one of the following: start (after zooming begins \[such as mousedown]), zoom (after a change to the zoom transform \[such as mousemove], or end (after an active pointer becomes inactive \[such as on mouseup].) |
| `listener` | (`this`: `ZoomRefElement`, `event`: `any`, `d`: `Datum`) => `void` | An event listener function which is evaluated for each selected element, in order, being passed the current event (event) and datum d, with the this context as the current DOM element. |

###### Returns

`this`

##### scaleBy()

```ts
scaleBy(
   selection: 
  | Selection<ZoomRefElement, Datum, any, any>
  | TransitionLike<ZoomRefElement, Datum>, 
   k: number | ValueFn<ZoomRefElement, Datum, number>, 
   p?: 
  | [number, number]
  | ValueFn<ZoomRefElement, Datum, [number, number]>): void;
```

If selection is a selection, scales the current zoom transform of the selected elements by k, such that the new k₁ = k₀k.
The reference point p does move.
If p is not specified, it defaults to the center of the viewport extent.
If selection is a transition, defines a “zoom” tween translating the current transform.
This method is a convenience method for zoom.transform.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `selection` | | `Selection`<`ZoomRefElement`, `Datum`, `any`, `any`> | `TransitionLike`<`ZoomRefElement`, `Datum`> | A selection or a transition. |
| `k` | `number` | `ValueFn`<`ZoomRefElement`, `Datum`, `number`> | Scale factor. A number or a function that returns a number. If a function, it is invoked for each selected element, being passed the current datum d and index i, with the this context as the current DOM element. |
| `p?` | | \[`number`, `number`] | `ValueFn`<`ZoomRefElement`, `Datum`, \[`number`, `number`]> | A two-element array \[px,py] or a function. If a function, it is invoked for each selected element, being passed the current datum d and index i, with the this context as the current DOM element. |

###### Returns

`void`

##### scaleExtent()

###### Call Signature

```ts
scaleExtent(): [number, number];
```

Return the current scale extent.

###### Returns

\[`number`, `number`]

###### Call Signature

```ts
scaleExtent(extent: [number, number]): this;
```

Set the scale extent to the specified array of numbers \[k0, k1] where k0 is the minimum allowed scale factor and k1 is the maximum allowed scale factor,
and return this zoom behavior.

The scale extent restricts zooming in and out. It is enforced on interaction and when using zoom.scaleBy, zoom.scaleTo and zoom.translateBy;
however, it is not enforced when using zoom.transform to set the transform explicitly.

The default scale extent is \[0, infinity].

If the user tries to zoom by wheeling when already at the corresponding limit of the scale extent, the wheel events will be ignored and not initiate a zoom gesture.
This allows the user to scroll down past a zoomable area after zooming in, or to scroll up after zooming out.
If you would prefer to always prevent scrolling on wheel input regardless of the scale extent, register a wheel event listener to prevent the browser default behavior

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `extent` | \[`number`, `number`] | A scale extent array of two numbers representing the scale boundaries. |

###### Returns

`this`

##### scaleTo()

```ts
scaleTo(
   selection: 
  | Selection<ZoomRefElement, Datum, any, any>
  | TransitionLike<ZoomRefElement, Datum>, 
   k: number | ValueFn<ZoomRefElement, Datum, number>, 
   p?: [number, number]): void;
```

If selection is a selection, scales the current zoom transform of the selected elements to k, such that the new k₁ = k.
The reference point p does move.
If p is not specified, it defaults to the center of the viewport extent.
If selection is a transition, defines a “zoom” tween translating the current transform.
This method is a convenience method for zoom.transform.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `selection` | | `Selection`<`ZoomRefElement`, `Datum`, `any`, `any`> | `TransitionLike`<`ZoomRefElement`, `Datum`> | - |
| `k` | `number` | `ValueFn`<`ZoomRefElement`, `Datum`, `number`> | Scale factor. A number or a function that returns a number. If a function, it is invoked for each selected element, being passed the current datum d and index i, with the this context as the current DOM element. |
| `p?` | \[`number`, `number`] | A two-element array \[px,py] or a function. If a function, it is invoked for each selected element, being passed the current datum d and index i, with the this context as the current DOM element. |

###### Returns

`void`

##### tapDistance()

###### Call Signature

```ts
tapDistance(): number;
```

Return the current tap distance threshold, which defaults to 10.

###### Returns

`number`

###### Call Signature

```ts
tapDistance(distance: number): this;
```

Sets the maximum distance that a double-tap gesture can move between first touchstart and second touchend that will trigger a subsequent double-click event.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `distance` | `number` | The distance threshold between mousedown and mouseup measured in client coordinates (event.clientX and event.clientY). The default is 10. |

###### Returns

`this`

##### toString()

```ts
toString(): string;
```

Returns a string representation of a function.

###### Returns

`string`

###### Inherited from

```ts
Function.toString
```

##### touchable()

###### Call Signature

```ts
touchable(): ValueFn<ZoomRefElement, Datum, boolean>;
```

Returns the current touch support detector, which defaults to a function returning true,
if the "ontouchstart" event is supported on the current element.

###### Returns

`ValueFn`<`ZoomRefElement`, `Datum`, `boolean`>

###### Call Signature

```ts
touchable(touchable: boolean): this;
```

Sets the touch support detector to the specified boolean value and returns the zoom behavior.

Touch event listeners are only registered if the detector returns truthy for the corresponding element when the zoom behavior is applied.
The default detector works well for most browsers that are capable of touch input, but not all; Chrome’s mobile device emulator, for example,
fails detection.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `touchable` | `boolean` | A boolean value. true when touch event listeners should be applied to the corresponding element, otherwise false. |

###### Returns

`this`

###### Call Signature

```ts
touchable(touchable: ValueFn<ZoomRefElement, Datum, boolean>): this;
```

Sets the touch support detector to the specified function and returns the zoom behavior.

Touch event listeners are only registered if the detector returns truthy for the corresponding element when the zoom behavior is applied.
The default detector works well for most browsers that are capable of touch input, but not all; Chrome’s mobile device emulator, for example,
fails detection.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `touchable` | `ValueFn`<`ZoomRefElement`, `Datum`, `boolean`> | A touch support detector function, which returns true when touch event listeners should be applied to the corresponding element. The function is evaluated for each selected element to which the zoom behavior was applied, in order, being passed the current datum (d), the current index (i), and the current group (nodes), with this as the current DOM element. The function returns a boolean value. |

###### Returns

`this`

##### transform()

```ts
transform(
   selection: 
  | Selection<ZoomRefElement, Datum, any, any>
  | TransitionLike<ZoomRefElement, Datum>, 
   transform: 
  | ZoomTransform
  | (this: ZoomRefElement, event: any, d: Datum) => ZoomTransform, 
   point?: 
  | [number, number]
  | (this: ZoomRefElement, event: any, d: Datum) => [number, number]): void;
```

If selection is a selection, sets the current zoom transform of the selected elements to the specified transform, instantaneously emitting start, zoom and end events.
If selection is a transition, defines a “zoom” tween to the specified transform using d3.interpolateZoom, emitting a start event when the transition starts,
zoom events for each tick of the transition, and then an end event when the transition ends (or is interrupted).
The transition will attempt to minimize the visual movement around the specified point; if the point is not specified, it defaults to the center of the viewport extent.

This function is typically not invoked directly, and is instead invoked via selection.call or transition.call.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `selection` | | `Selection`<`ZoomRefElement`, `Datum`, `any`, `any`> | `TransitionLike`<`ZoomRefElement`, `Datum`> | A selection or a transition. |
| `transform` | | [`ZoomTransform`](#zoomtransform) | (`this`: `ZoomRefElement`, `event`: `any`, `d`: `Datum`) => [`ZoomTransform`](#zoomtransform) | A zoom transform or a function that returns a zoom transform. If a function, it is invoked for each selected element, being passed the current event (event) and datum d, with the this context as the current DOM element. |
| `point?` | | \[`number`, `number`] | (`this`: `ZoomRefElement`, `event`: `any`, `d`: `Datum`) => \[`number`, `number`] | A two-element array \[x, y] or a function that returns such an array. If a function, it is invoked for each selected element, being passed the current event (event) and datum d, with the this context as the current DOM element. |

###### Returns

`void`

##### translateBy()

```ts
translateBy(
   selection: 
  | Selection<ZoomRefElement, Datum, any, any>
  | TransitionLike<ZoomRefElement, Datum>, 
   x: number | ValueFn<ZoomRefElement, Datum, number>, 
   y: number | ValueFn<ZoomRefElement, Datum, number>): void;
```

If selection is a selection, translates the current zoom transform of the selected elements by x and y, such that the new tx1 = tx0 + kx and ty1 = ty0 + ky.
If selection is a transition, defines a “zoom” tween translating the current transform.
This method is a convenience method for zoom.transform.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `selection` | | `Selection`<`ZoomRefElement`, `Datum`, `any`, `any`> | `TransitionLike`<`ZoomRefElement`, `Datum`> | A selection or a transition. |
| `x` | `number` | `ValueFn`<`ZoomRefElement`, `Datum`, `number`> | A number or a function that returns a number. If a function, it is invoked for each selected element, being passed the current datum d and index i, with the this context as the current DOM element. |
| `y` | `number` | `ValueFn`<`ZoomRefElement`, `Datum`, `number`> | A number or a function that returns a number. If a function, it is invoked for each selected element, being passed the current datum d and index i, with the this context as the current DOM element. |

###### Returns

`void`

##### translateExtent()

###### Call Signature

```ts
translateExtent(): [[number, number], [number, number]];
```

Return the current translate extent.

###### Returns

\[\[`number`, `number`], \[`number`, `number`]]

###### Call Signature

```ts
translateExtent(extent: [[number, number], [number, number]]): this;
```

Set the translate extent to the specified array of points \[\[x0, y0], \[x1, y1]], where \[x0, y0] is the top-left corner of the world and \[x1, y1]
is the bottom-right corner of the world, and return this zoom behavior.

The translate extent restricts panning, and may cause translation on zoom out. It is enforced on interaction and when using zoom.scaleBy, zoom.scaleTo and zoom.translateBy;
however, it is not enforced when using zoom.transform to set the transform explicitly.

The default scale extent is \[\[-infinity, infinity], \[-infinity, infinity]].

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `extent` | \[\[`number`, `number`], \[`number`, `number`]] | A translate extent array, i.e. an array of two arrays, each representing a point. |

###### Returns

`this`

##### translateTo()

```ts
translateTo(
   selection: 
  | Selection<ZoomRefElement, Datum, any, any>
  | TransitionLike<ZoomRefElement, Datum>, 
   x: number | ValueFn<ZoomRefElement, Datum, number>, 
   y: number | ValueFn<ZoomRefElement, Datum, number>, 
   p?: 
  | [number, number]
  | ValueFn<ZoomRefElement, Datum, [number, number]>): void;
```

If selection is a selection, translates the current zoom transform of the selected elements such that the given position ⟨x,y⟩ appears at given point p.
The new tx = px - kx and ty = py - ky. If p is not specified, it defaults to the center of the viewport extent.
If selection is a transition, defines a “zoom” tween translating the current transform. This method is a convenience method for zoom.transform.

Translates the current zoom transform of the selected elements such that the specified position ⟨x,y⟩ appears at the center of the viewport extent.
The new tx = cx - kx and ty = cy - ky, where ⟨cx,cy⟩ is the center.

x is provided as a constant for all elements.
y is provided as a constant for all elements.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `selection` | | `Selection`<`ZoomRefElement`, `Datum`, `any`, `any`> | `TransitionLike`<`ZoomRefElement`, `Datum`> | A selection or a transition. |
| `x` | `number` | `ValueFn`<`ZoomRefElement`, `Datum`, `number`> | A number or a function that returns a number. If a function, it is invoked for each selected element, being passed the current datum d and index i, with the this context as the current DOM element. |
| `y` | `number` | `ValueFn`<`ZoomRefElement`, `Datum`, `number`> | A number or a function that returns a number. If a function, it is invoked for each selected element, being passed the current datum d and index i, with the this context as the current DOM element. |
| `p?` | | \[`number`, `number`] | `ValueFn`<`ZoomRefElement`, `Datum`, \[`number`, `number`]> | A two-element array \[px,py] or a function If a function, it is invoked for each selected element, being passed the current datum d and index i, with the this context as the current DOM element. |

###### Returns

`void`

##### wheelDelta()

###### Call Signature

```ts
wheelDelta(): ValueFn<ZoomRefElement, Datum, number>;
```

Returns the current wheelDelta function.

###### Returns

`ValueFn`<`ZoomRefElement`, `Datum`, `number`>

###### Call Signature

```ts
wheelDelta(delta: number | (event: WheelEvent) => number): this;
```

Sets the wheel delta function to the specified function and returns the zoom behavior. The wheel delta function which is invoked in the wheel event handler
of each element to which the zoom behavior was applied.
The value Δ returned by the wheel delta function determines the amount of scaling applied in response to a WheelEvent.
The scale factor transform.k is multiplied by 2Δ; for example, a Δ of +1 doubles the scale factor, Δ of -1 halves the scale factor.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `delta` | `number` | (`event`: `WheelEvent`) => `number` | Wheel delta function which is invoked in the wheel event handler of each element to which the zoom behavior was applied, in order, being passed the wheel event that triggered the handler, with this as the current DOM element. The function returns a numeric value. |

###### Returns

`this`

#### Properties

| Property | Modifier | Type | Description | Inherited from |
| ------ | ------ | ------ | ------ | ------ |
| <a id="property-metadata-1"></a> `[metadata]` | `public` | `DecoratorMetadataObject` | `null` | - | `Function.[metadata]` |
| <a id="property-arguments-1"></a> `arguments` | `public` | `any` | - | `Function.arguments` |
| <a id="property-caller-1"></a> `caller` | `public` | `Function` | - | `Function.caller` |
| <a id="property-length-1"></a> `length` | `readonly` | `number` | - | `Function.length` |
| <a id="property-name-1"></a> `name` | `readonly` | `string` | Returns the name of the function. Function names are read-only and can not be changed. | `Function.name` |
| <a id="property-prototype-1"></a> `prototype` | `public` | `any` | - | `Function.prototype` |

***

### ZoomBehaviorOptions

#### Extends

* [`ZoomProps`](#zoomprops).[`ZoomEvents`](#zoomevents)

#### Properties

| Property | Type | Inherited from |
| ------ | ------ | ------ |
| <a id="property-center-2"></a> `center?` | \[`number`, `number`] | [`ZoomProps`](#zoomprops).[`center`](#property-center-3) |
| <a id="property-config"></a> `config?` | [`ZoomModifiers`](#zoommodifiers) | [`ZoomProps`](#zoomprops).[`config`](#property-config-1) |
| <a id="property-maxzoom"></a> `maxZoom?` | `number` | [`ZoomProps`](#zoomprops).[`maxZoom`](#property-maxzoom-1) |
| <a id="property-minzoom"></a> `minZoom?` | `number` | [`ZoomProps`](#zoomprops).[`minZoom`](#property-minzoom-1) |
| <a id="property-onzoom"></a> `onZoom?` | (`event`: [`ZoomEvent`](#zoomevent)) => `void` | [`ZoomEvents`](#zoomevents).[`onZoom`](#property-onzoom-1) |
| <a id="property-onzoomend"></a> `onZoomEnd?` | (`event`: [`ZoomEvent`](#zoomevent)) => `void` | [`ZoomEvents`](#zoomevents).[`onZoomEnd`](#property-onzoomend-1) |
| <a id="property-onzoomstart"></a> `onZoomStart?` | (`event`: [`ZoomEvent`](#zoomevent)) => `void` | [`ZoomEvents`](#zoomevents).[`onZoomStart`](#property-onzoomstart-1) |
| <a id="property-zoom-2"></a> `zoom?` | `number` | [`ZoomProps`](#zoomprops).[`zoom`](#property-zoom-3) |

***

### ZoomEvent

A D3 Zoom Event

The first generic refers to the type of reference element to which the zoom behavior is attached.
The second generic refers to the type of the datum of the reference element.

#### Extends

* [`D3ZoomEvent`](#d3zoomevent)<`SVGSVGElement`, `unknown`>

#### Properties

| Property | Type | Description | Inherited from |
| ------ | ------ | ------ | ------ |
| <a id="property-sourceevent-1"></a> `sourceEvent` | `any` | The underlying input event, such as mousemove or touchmove. | [`D3ZoomEvent`](#d3zoomevent).[`sourceEvent`](#property-sourceevent) |
| <a id="property-target-1"></a> `target` | [`ZoomBehavior`](#zoombehavior)<`SVGSVGElement`, `unknown`> | The ZoomBehavior associated with the event | [`D3ZoomEvent`](#d3zoomevent).[`target`](#property-target) |
| <a id="property-transform-1"></a> `transform` | [`ZoomTransform`](#zoomtransform) | The current zoom transform | [`D3ZoomEvent`](#d3zoomevent).[`transform`](#property-transform) |
| <a id="property-type-1"></a> `type` | `string` | The event type for the zoom event | [`D3ZoomEvent`](#d3zoomevent).[`type`](#property-type) |

***

### ZoomEvents

#### Extended by

* [`ZoomBehaviorOptions`](#zoombehavioroptions)

#### Properties

| Property | Type |
| ------ | ------ |
| <a id="property-onzoom-1"></a> `onZoom?` | (`event`: [`ZoomEvent`](#zoomevent)) => `void` |
| <a id="property-onzoomend-1"></a> `onZoomEnd?` | (`event`: [`ZoomEvent`](#zoomevent)) => `void` |
| <a id="property-onzoomstart-1"></a> `onZoomStart?` | (`event`: [`ZoomEvent`](#zoomevent)) => `void` |

***

### ZoomModifiers

Extra zoom method calls to apply before rendering.

Use zoom method names as keys and method arguments as values.
Example: `{ scaleExtent: [[2, 9]], translateExtent: [[[0, 0], [10, 10]]] }`

#### See

https://d3js.org/d3-zoom

#### Extends

* [`MethodsToModifiers`](utils.md#methodstomodifiers)<[`DefaultZoomBehavior`](#defaultzoombehavior)>

#### Properties

| Property | Type | Inherited from |
| ------ | ------ | ------ |
| <a id="property-clickdistance"></a> `clickDistance?` | `number` | \[`number`] | `MethodsToModifiers.clickDistance` |
| <a id="property-constrain"></a> `constrain?` | | (`transform`: [`ZoomTransform`](#zoomtransform), `extent`: \[\[`number`, `number`], \[`number`, `number`]], `translateExtent`: \[\[`number`, `number`], \[`number`, `number`]]) => [`ZoomTransform`](#zoomtransform) | \[(`transform`: [`ZoomTransform`](#zoomtransform), `extent`: \[\[`number`, `number`], \[`number`, `number`]], `translateExtent`: \[\[`number`, `number`], \[`number`, `number`]]) => [`ZoomTransform`](#zoomtransform)] | `MethodsToModifiers.constrain` |
| <a id="property-duration"></a> `duration?` | `number` | \[`number`] | `MethodsToModifiers.duration` |
| <a id="property-extent"></a> `extent?` | | \[\[\[`number`, `number`], \[`number`, `number`]]] | (`this`: `SVGSVGElement`, `datum`: `unknown`) => \[\[`number`, `number`], \[`number`, `number`]] | \[(`this`: `SVGSVGElement`, `datum`: `unknown`) => \[\[`number`, `number`], \[`number`, `number`]]] | `MethodsToModifiers.extent` |
| <a id="property-filter"></a> `filter?` | | (`this`: `SVGSVGElement`, `event`: `any`, `datum`: `unknown`) => `boolean` | \[(`this`: `SVGSVGElement`, `event`: `any`, `datum`: `unknown`) => `boolean`] | `MethodsToModifiers.filter` |
| <a id="property-interpolate"></a> `interpolate?` | | (`a`: `ZoomView`, `b`: `ZoomView`) => (`t`: `number`) => `ZoomView` | \[(`a`: `ZoomView`, `b`: `ZoomView`) => (`t`: `number`) => `ZoomView`] | `MethodsToModifiers.interpolate` |
| <a id="property-on"></a> `on?` | | `string` | \[`string`, `null`] | \[`string`, (`this`: `SVGSVGElement`, `event`: `any`, `d`: `unknown`) => `void`] | \[`string`] | `MethodsToModifiers.on` |
| <a id="property-scaleby"></a> `scaleBy?` | \[ | `Selection`<`SVGSVGElement`, `unknown`, `any`, `any`> | `TransitionLike`<`SVGSVGElement`, `unknown`>, `number` | `ValueFn`<`SVGSVGElement`, `unknown`, `number`>, | \[`number`, `number`] | `ValueFn`<`SVGSVGElement`, `unknown`, \[`number`, `number`]>] | `MethodsToModifiers.scaleBy` |
| <a id="property-scaleextent"></a> `scaleExtent?` | \[\[`number`, `number`]] | `MethodsToModifiers.scaleExtent` |
| <a id="property-scaleto"></a> `scaleTo?` | \[ | `Selection`<`SVGSVGElement`, `unknown`, `any`, `any`> | `TransitionLike`<`SVGSVGElement`, `unknown`>, `number` | `ValueFn`<`SVGSVGElement`, `unknown`, `number`>, \[`number`, `number`]] | `MethodsToModifiers.scaleTo` |
| <a id="property-tapdistance"></a> `tapDistance?` | `number` | \[`number`] | `MethodsToModifiers.tapDistance` |
| <a id="property-touchable"></a> `touchable?` | | `boolean` | \[`false`] | \[`true`] | `ValueFn`<`SVGSVGElement`, `unknown`, `boolean`> | \[`ValueFn`<`SVGSVGElement`, `unknown`, `boolean`>] | `MethodsToModifiers.touchable` |
| <a id="property-transform-2"></a> `transform?` | \[ | `Selection`<`SVGSVGElement`, `unknown`, `any`, `any`> | `TransitionLike`<`SVGSVGElement`, `unknown`>, | [`ZoomTransform`](#zoomtransform) | (`this`: `SVGSVGElement`, `event`: `any`, `d`: `unknown`) => [`ZoomTransform`](#zoomtransform), | \[`number`, `number`] | (`this`: `SVGSVGElement`, `event`: `any`, `d`: `unknown`) => \[`number`, `number`]] | `MethodsToModifiers.transform` |
| <a id="property-translateby"></a> `translateBy?` | \[ | `Selection`<`SVGSVGElement`, `unknown`, `any`, `any`> | `TransitionLike`<`SVGSVGElement`, `unknown`>, `number` | `ValueFn`<`SVGSVGElement`, `unknown`, `number`>, `number` | `ValueFn`<`SVGSVGElement`, `unknown`, `number`>] | `MethodsToModifiers.translateBy` |
| <a id="property-translateextent"></a> `translateExtent?` | \[\[\[`number`, `number`], \[`number`, `number`]]] | `MethodsToModifiers.translateExtent` |
| <a id="property-translateto"></a> `translateTo?` | \[ | `Selection`<`SVGSVGElement`, `unknown`, `any`, `any`> | `TransitionLike`<`SVGSVGElement`, `unknown`>, `number` | `ValueFn`<`SVGSVGElement`, `unknown`, `number`>, `number` | `ValueFn`<`SVGSVGElement`, `unknown`, `number`>, | \[`number`, `number`] | `ValueFn`<`SVGSVGElement`, `unknown`, \[`number`, `number`]>] | `MethodsToModifiers.translateTo` |
| <a id="property-wheeldelta"></a> `wheelDelta?` | | `number` | \[`number`] | (`event`: `WheelEvent`) => `number` | \[(`event`: `WheelEvent`) => `number`] | `MethodsToModifiers.wheelDelta` |

***

### ZoomProps

#### Extended by

* [`ZoomBehaviorOptions`](#zoombehavioroptions)

#### Properties

| Property | Type |
| ------ | ------ |
| <a id="property-center-3"></a> `center?` | \[`number`, `number`] |
| <a id="property-config-1"></a> `config?` | [`ZoomModifiers`](#zoommodifiers) |
| <a id="property-maxzoom-1"></a> `maxZoom?` | `number` |
| <a id="property-minzoom-1"></a> `minZoom?` | `number` |
| <a id="property-zoom-3"></a> `zoom?` | `number` |

***

### ZoomTransform

A zoom transform

The zoom behavior stores the zoom state on the element to which the zoom behavior was applied, not on the zoom behavior itself.
This is because the zoom behavior can be applied to many elements simultaneously, and each element can be zoomed independently.
The zoom state can change either on user interaction or programmatically via zoom.transform.

To retrieve the zoom state, use event.transform on the current zoom event within a zoom event listener (see zoom.on), or use d3.zoomTransform for a given node.
The latter is particularly useful for modifying the zoom state programmatically,
say to implement buttons for zooming in and out.

For details see <https://github.com/d3/d3-zoom#zoom-transforms>

#### Methods

##### apply()

```ts
apply(point: [number, number]): [number, number];
```

Return the transformation of the specified point which is a two-element array of numbers \[x, y].
The returned point is equal to \[xk + tx, yk + ty].

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `point` | \[`number`, `number`] | Point coordinates \[x, y] |

###### Returns

\[`number`, `number`]

##### applyX()

```ts
applyX(x: number): number;
```

Return the transformation of the specified x-coordinate, xk + tx.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `x` | `number` | Value of x-coordinate. |

###### Returns

`number`

##### applyY()

```ts
applyY(y: number): number;
```

Return the transformation of the specified y-coordinate, yk + ty.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `y` | `number` | Value of y-coordinate. |

###### Returns

`number`

##### invert()

```ts
invert(point: [number, number]): [number, number];
```

Return the inverse transformation of the specified point which is a two-element array of numbers \[x, y].
The returned point is equal to \[(x - tx) / k, (y - ty) / k].

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `point` | \[`number`, `number`] | Point coordinates \[x, y] |

###### Returns

\[`number`, `number`]

##### invertX()

```ts
invertX(x: number): number;
```

Return the inverse transformation of the specified x-coordinate, (x - tx) / k.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `x` | `number` | Value of x-coordinate. |

###### Returns

`number`

##### invertY()

```ts
invertY(y: number): number;
```

Return the inverse transformation of the specified y-coordinate, (y - ty) / k.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `y` | `number` | Value of y-coordinate. |

###### Returns

`number`

##### rescaleX()

```ts
rescaleX<S>(xScale: S): S;
```

Returns a copy of the continuous scale x whose domain is transformed.
This is implemented by first applying the inverse x-transform on the scale’s range,
and then applying the inverse scale to compute the corresponding domain

The scale x must use d3.interpolateNumber; do not use continuous.rangeRound as this
reduces the accuracy of continuous.invert and can lead to an inaccurate rescaled domain.
This method does not modify the input scale x; x thus represents the untransformed scale,
while the returned scale represents its transformed view.

###### Type Parameters

| Type Parameter |
| ------ |
| `S` *extends* `ZoomScale` |

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `xScale` | `S` | A continuous scale for x-dimension. |

###### Returns

`S`

##### rescaleY()

```ts
rescaleY<S>(yScale: S): S;
```

Returns a copy of the continuous scale y whose domain is transformed.
This is implemented by first applying the inverse y-transform on the scale’s range,
and then applying the inverse scale to compute the corresponding domain

The scale y must use d3.interpolateNumber; do not use continuous.rangeRound as this
reduces the accuracy of continuous.invert and can lead to an inaccurate rescaled domain.
This method does not modify the input scale x; x thus represents the untransformed scale,
while the returned scale represents its transformed view.

###### Type Parameters

| Type Parameter |
| ------ |
| `S` *extends* `ZoomScale` |

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `yScale` | `S` | A continuous scale for y-dimension. |

###### Returns

`S`

##### scale()

```ts
scale(k: number): ZoomTransform;
```

Return a transform whose scale k1 is equal to k0 × k, where k0 is this transform’s scale.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `k` | `number` | A scale factor. |

###### Returns

[`ZoomTransform`](#zoomtransform)

##### toString()

```ts
toString(): string;
```

Return a string representing the SVG transform corresponding to this transform.

###### Returns

`string`

##### translate()

```ts
translate(x: number, y: number): ZoomTransform;
```

Returns a transform whose translation tx1 and ty1 is equal to tx0 + tkx and ty0 + tky,
where tx0 and ty0 is this transform’s translation and tk is this transform’s scale.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `x` | `number` | Amount of translation in x-direction. |
| `y` | `number` | Amount of translation in y-direction. |

###### Returns

[`ZoomTransform`](#zoomtransform)

#### Properties

| Property | Modifier | Type | Description |
| ------ | ------ | ------ | ------ |
| <a id="property-k"></a> `k` | `readonly` | `number` | The scale factor k. This property should be considered read-only; instead of mutating a transform, use transform.scale and transform.translate to derive a new transform. Also see zoom.scaleBy, zoom.scaleTo and zoom.translateBy for convenience methods on the zoom behavior. |
| <a id="property-x"></a> `x` | `readonly` | `number` | The translation amount tx along the x-axis. This property should be considered read-only; instead of mutating a transform, use transform.scale and transform.translate to derive a new transform. Also see zoom.scaleBy, zoom.scaleTo and zoom.translateBy for convenience methods on the zoom behavior. |
| <a id="property-y"></a> `y` | `readonly` | `number` | The translation amount ty along the y-axis This property should be considered read-only; instead of mutating a transform, use transform.scale and transform.translate to derive a new transform. Also see zoom.scaleBy, zoom.scaleTo and zoom.translateBy for convenience methods on the zoom behavior. |

## Type Aliases

### Extent

```ts
type Extent = [[number, number], [number, number]];
```

***

### ZoomScaleSource

```ts
type ZoomScaleSource = 
  | number
  | ZoomTransform
  | {
  transform: ZoomTransform;
};
```

***

### ZoomTargetElement

```ts
type ZoomTargetElement = SVGSVGElement | SVGGElement;
```
