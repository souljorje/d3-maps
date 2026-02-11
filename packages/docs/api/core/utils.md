[@d3-maps/core](index.md) / utils

# utils

## Table of contents

* [Functions](#functions)
  * [get()](#get)
  * [isDefined()](#isdefined)
  * [isFunction()](#isfunction)
  * [isNullish()](#isnullish)
  * [isNumber()](#isnumber)
  * [isPlainObject()](#isplainobject)
  * [isString()](#isstring)
  * [isStringOrNumber()](#isstringornumber)
  * [makeTransform()](#maketransform)

## Functions

### get()

```ts
function get<T>(url: string): Promise<T>;
```

#### Type Parameters

| Type Parameter |
| ------ |
| `T` |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `url` | `string` |

#### Returns

`Promise`<`T`>

***

### isDefined()

```ts
function isDefined<T>(value: T | null | undefined): value is T;
```

#### Type Parameters

| Type Parameter |
| ------ |
| `T` |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `T` | `null` | `undefined` |

#### Returns

`value is T`

***

### isFunction()

```ts
function isFunction(value: unknown): value is (args: unknown[]) => unknown;
```

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `unknown` |

#### Returns

`value is (args: unknown[]) => unknown`

***

### isNullish()

```ts
function isNullish(value: unknown): value is null | undefined;
```

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `unknown` |

#### Returns

value is null | undefined

***

### isNumber()

```ts
function isNumber(value: unknown): value is number;
```

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `unknown` |

#### Returns

`value is number`

***

### isPlainObject()

```ts
function isPlainObject(value: unknown): value is Record<string, unknown>;
```

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `unknown` |

#### Returns

`value is Record<string, unknown>`

***

### isString()

```ts
function isString(value: unknown): value is string;
```

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `unknown` |

#### Returns

`value is string`

***

### isStringOrNumber()

```ts
function isStringOrNumber(value: unknown): value is string | number;
```

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `unknown` |

#### Returns

value is string | number

***

### makeTransform()

```ts
function makeTransform(
   x: number, 
   y: number, 
   k?: number): string;
```

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `x` | `number` |
| `y` | `number` |
| `k?` | `number` |

#### Returns

`string`
