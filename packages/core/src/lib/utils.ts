export type AnyFn = (...args: unknown[]) => unknown

export type HasArgs<F extends AnyFn> =
  Parameters<F> extends [] ? false : true

export function isString(value: unknown): value is string {
  return typeof value === 'string'
}

export function isDefined<T>(value: T | null | undefined): value is T {
  return value !== 'undefined'
}

export const isNullish = (value: unknown): value is null | undefined => value == null

export const isNumber = (value: unknown): value is number => Number.isFinite(value)

export function isStringOrNumber(value: unknown): value is string | number {
  return isString(value) || isNumber(value)
}

export function isFunction(value: unknown): value is (...args: unknown[]) => unknown {
  return typeof value === 'function'
}

export function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (Object.prototype.toString.call(value) !== '[object Object]') return false
  const prototype = Object.getPrototypeOf(value)
  return prototype === null || prototype === Object.prototype
}

export function makeTransform(x: number, y: number, k?: number): string {
  return `translate(${x}, ${y}) scale(${k ?? 1})`
}

/**
 * Converts method parameters to modifiers values
 * - single non-array arg: `arg` or `[arg]`
 * - single array/tuple arg: must be as `[arg]` (to avoid ambiguity)
 * - multiple args: provide the full args tuple
 */
export type ModifierArgs<P extends unknown[]> =
  P extends [infer Only]
    ? Only extends unknown[]
      ? [Only]
      : Only | [Only]
    : P

/**
 * Maps methods with args to modifiers
 *
 * @example
 * type X = {
 *   a: string;  // not a function - will be ignored
 *   b(): void;  // has no arguments - will be ignored
 *   c(x: number): void;
 *   d(x: number, y: string): void;
 *   e(xs: string[]): void;
 * }
 *
 * type R = MethodsToModifiers<X>
 * {
 *   c: number | [number];
 *   d: [number, string];
 *   e: [string[]]; // forced wrapper (arg is array)
 * }
 */
export type MethodsToModifiers<T extends object> = {
  [K in keyof T as T[K] extends AnyFn
    ? (HasArgs<T[K]> extends true ? K : never)
    : never
  ]?: T[K] extends AnyFn ? ModifierArgs<Parameters<T[K]>> : never
}

/**
 * Invokes `target` methods with arguments from `modifiers`.
 *
 * modifers: `{ [methodName]: methodArgs[] }`
 *
 * @example
 * class X {
 *  a(x: number) {}
 *  b(x: number, y: string) {}
 *  c(x: string[]) {}
 *  d() {}
 *  e = 'foo'
 * }
 *
 * applyModifiers(new X(), {
 *  a: 1, // ok (single arg as-is)
 *  a: [1], // ok (single arg wrapped)
 *  b: [1, 'foo'], // ok (tuple for 2 args)
 *  c: [['foo', 'bar']], // ok (array-arg must be wrapped)
 *  c: ['foo', 'bar'],  // error (single array-arg must be wrapped into array)
 *  d: [], // error (d has no args, excluded)
 *  e: 'foo' // error (e is not a function, excluded)
 * })
 */
export function applyModifiers<T extends object>(
  target: T,
  modifiers?: MethodsToModifiers<T>,
): void {
  if (!modifiers) return

  for (const methodName of Object.keys(modifiers) as (keyof typeof modifiers)[]) {
    const methodArgs = modifiers[methodName]
    if (!isDefined(methodArgs)) continue

    const fn = target[methodName] as AnyFn
    const normalizedArgs = Array.isArray(methodArgs) ? methodArgs : [methodArgs]
    fn.apply(target, normalizedArgs)
  }
}
