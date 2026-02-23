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
  * [OverloadedArgs](#overloadedargs)
  * [OwnKeys](#ownkeys)
  * [SetterArgs](#setterargs)

## Functions

### applyModifiers()

```ts
function applyModifiers<T>(target: T, modifiers?: MethodsToModifiers<T>): void;
```

Invokes `target` methods with arguments from `modifiers`.

modifiers: `{ [methodName]: args[] | arg }`

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
type HasArgs<F> = [SetterArgs<F>] extends [never] ? false : true;
```

True if the function has at least one overload that accepts arguments (i.e. a setter overload).

#### Type Parameters

| Type Parameter |
| ------ |
| `F` |

***

### MethodsToModifiers

```ts
type MethodsToModifiers<T> = { [K in OwnKeys<T> as Extract<T[K], AnyFn> extends never ? never : HasArgs<Extract<T[K], AnyFn>> extends true ? K : never]?: ModifierArgs<Extract<SetterArgs<Extract<T[K], AnyFn>>, unknown[]>> };
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
type ModifierArgs<P> = P extends [infer Only] ? Only extends readonly unknown[] ? [Only] : Only | [Only] : P;
```

Converts method parameters to modifiers values

* single non-array arg: `arg` | `[arg]`
* multiple args/single array wrapped with array

#### Type Parameters

| Type Parameter |
| ------ |
| `P` *extends* `unknown`\[] |

***

### OverloadedArgs

```ts
type OverloadedArgs<F> = F extends {
  (...a: A1): any;
  (...a: A2): any;
  (...a: A3): any;
  (...a: A4): any;
  (...a: A5): any;
} ? A1 | A2 | A3 | A4 | A5 : F extends {
  (...a: A1): any;
  (...a: A2): any;
  (...a: A3): any;
  (...a: A4): any;
} ? A1 | A2 | A3 | A4 : F extends {
  (...a: A1): any;
  (...a: A2): any;
  (...a: A3): any;
} ? A1 | A2 | A3 : F extends {
  (...a: A1): any;
  (...a: A2): any;
} ? A1 | A2 : F extends (...a: infer A1) => any ? A1 : never;
```

Extracts a union of parameter tuples from a (possibly overloaded) function type.

TypeScript's built-in `Parameters<F>` only captures the *last* overload, which breaks typing
for overloaded getter/setter APIs (common in d3), where the setter overload might not be last.

Notes:

* This helper supports up to 5 overload signatures (adjust if needed).
* Getter overloads like `(): T` are filtered out later via `Exclude<..., []>` when we build
  setter-only config types.

#### Type Parameters

| Type Parameter |
| ------ |
| `F` |

***

### OwnKeys

```ts
type OwnKeys<T> = T extends AnyFn ? Exclude<keyof T, keyof CallableFunction> : keyof T;
```

#### Type Parameters

| Type Parameter |
| ------ |
| `T` |

***

### SetterArgs

```ts
type SetterArgs<F> = Exclude<OverloadedArgs<F>, []>;
```

Removes 0-arg overloads (getters), leaving only setter-style overload argument tuples.

#### Type Parameters

| Type Parameter |
| ------ |
| `F` |
