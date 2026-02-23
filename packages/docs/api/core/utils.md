[@d3-maps/core](index.md) / utils

# utils

## Table of contents

* [Functions](#functions)
  * [applyModifiers()](#applymodifiers)
  * [isDefined()](#isdefined)
  * [isFunction()](#isfunction)
  * [isNullish()](#isnullish)
  * [isNumber()](#isnumber)
  * [isPlainObject()](#isplainobject)
  * [isString()](#isstring)
  * [isStringOrNumber()](#isstringornumber)
  * [makeTransform()](#maketransform)
* [Type Aliases](#type-aliases)
  * [AnyFn()](#anyfn)
  * [HasArgs](#hasargs)
  * [MethodsToModifiers](#methodstomodifiers)
  * [ModifierArgs](#modifierargs)
  * [OwnKeys](#ownkeys)

## Functions

### applyModifiers()

```ts
function applyModifiers<T>(target: T, modifiers?: MethodsToModifiers<T>): void;
```

Invokes `target` methods with arguments from `modifiers`.

modifers: `{ [methodName]: GetArgs[] }`

#### Type Parameters

| Type Parameter |
| ------ |
| `T` *extends* `object` |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `target` | `T` |
| `modifiers?` | [`MethodsToModifiers`](#methodstomodifiers)<`T`> |

#### Returns

`void`

#### Example

```ts
class X {
 a(x: number) {}
 b(x: number, y: string) {}
 c(x: string[]) {}
 d() {}
 e = 'foo'
}

applyModifiers(new X(), {
 a: 1, // ok (single arg as-is)
 a: [1], // ok (single arg wrapped)
 b: [1, 'foo'], // ok (tuple for 2 args)
 c: [['foo', 'bar']], // ok (array-arg must be wrapped)
 c: ['foo', 'bar'],  // error (single array-arg must be wrapped into array)
 d: [], // error (d has no args, excluded)
 e: 'foo' // error (e is not a function, excluded)
})
```

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

## Type Aliases

### AnyFn()

```ts
type AnyFn = (...args: any) => any;
```

#### Parameters

| Parameter | Type |
| ------ | ------ |
| ...`args` | `any` |

#### Returns

`any`

***

### HasArgs

```ts
type HasArgs<F> = Parameters<F>["length"] extends 0 ? false : true;
```

#### Type Parameters

| Type Parameter |
| ------ |
| `F` *extends* [`AnyFn`](#anyfn) |

***

### MethodsToModifiers

```ts
type MethodsToModifiers<T> = { [K in OwnKeys<T> as T[K] extends AnyFn ? HasArgs<T[K]> extends true ? K : never : never]?: T[K] extends AnyFn ? ModifierArgs<Parameters<T[K]>> : never };
```

Maps methods with args to modifiers

#### Type Parameters

| Type Parameter |
| ------ |
| `T` *extends* `object` |

#### Example

```ts
type X = {
  a: string;  // not a function - will be ignored
  b(): void;  // has no arguments - will be ignored
  c(x: number): void;
  d(x: number, y: string): void;
  e(xs: string[]): void;
}

type R = MethodsToModifiers<X>
{
  c: number | [number];
  d: [number, string];
  e: [string[]]; // forced wrapper (arg is array)
}
```

***

### ModifierArgs

```ts
type ModifierArgs<P> = P extends [infer Only] ? Only extends unknown[] ? [Only] : Only | [Only] : P;
```

Converts method parameters to modifiers values

* single non-array arg: `arg` | `[arg]`
* multiple args/single array wrapped with array

#### Type Parameters

| Type Parameter |
| ------ |
| `P` *extends* `unknown`\[] |

***

### OwnKeys

```ts
type OwnKeys<T> = T extends Function ? Exclude<keyof T, keyof Function> : keyof T;
```

#### Type Parameters

| Type Parameter |
| ------ |
| `T` |
