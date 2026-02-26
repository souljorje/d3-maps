[@d3-maps/core](index.md) / graticule

# graticule

## Table of contents

* [Functions](#functions)
  * [renderGraticule()](#rendergraticule)
  * [renderOutline()](#renderoutline)
* [Interfaces](#interfaces)
  * [GraticuleConfig](#graticuleconfig)

## Functions

### renderGraticule()

```ts
function renderGraticule(context: MapContext, config?: GraticuleConfig): string | null;
```

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `context` | [`MapContext`](map.md#mapcontext) |
| `config?` | [`GraticuleConfig`](#graticuleconfig) |

#### Returns

`string` | `null`

***

### renderOutline()

```ts
function renderOutline(context: MapContext): string | null;
```

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `context` | [`MapContext`](map.md#mapcontext) |

#### Returns

`string` | `null`

## Interfaces

### GraticuleConfig

Extra graticule generator method calls to apply before rendering.

Uses d3-geo `geoGraticule()` setter method names as keys.
Example: `{ step: [[10, 10]], precision: 2.5 }`

#### See

https://d3js.org/d3-geo/shape#geoGraticule

#### Extends

* [`MethodsToModifiers`](utils.md#methodstomodifiers)<`GeoGraticuleGenerator`>

#### Properties

| Property | Type | Inherited from |
| ------ | ------ | ------ |
| <a id="property-extent"></a> `extent?` | \[\[\[`number`, `number`], \[`number`, `number`]]] | `MethodsToModifiers.extent` |
| <a id="property-extentmajor"></a> `extentMajor?` | \[\[\[`number`, `number`], \[`number`, `number`]]] | `MethodsToModifiers.extentMajor` |
| <a id="property-extentminor"></a> `extentMinor?` | \[\[\[`number`, `number`], \[`number`, `number`]]] | `MethodsToModifiers.extentMinor` |
| <a id="property-precision"></a> `precision?` | `number` | \[`number`] | `MethodsToModifiers.precision` |
| <a id="property-step"></a> `step?` | \[\[`number`, `number`]] | `MethodsToModifiers.step` |
| <a id="property-stepmajor"></a> `stepMajor?` | \[\[`number`, `number`]] | `MethodsToModifiers.stepMajor` |
| <a id="property-stepminor"></a> `stepMinor?` | \[\[`number`, `number`]] | `MethodsToModifiers.stepMinor` |
