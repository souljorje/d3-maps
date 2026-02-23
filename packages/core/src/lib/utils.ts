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

export type AnyFn = (...args: any) => any

/**
 * Extracts a union of parameter tuples from a (possibly overloaded) function type.
 *
 * TypeScript's built-in `Parameters<F>` only captures the *last* overload, which breaks typing
 * for overloaded getter/setter APIs (common in d3), where the setter overload might not be last.
 *
 * Notes:
 * - This helper supports up to 5 overload signatures (adjust if needed).
 * - Getter overloads like `(): T` are filtered out later via `Exclude<..., []>` when we build
 *   setter-only config types.
 */
export type OverloadedArgs<F> =
  F extends {
    (...a: infer A1): any
    (...a: infer A2): any
    (...a: infer A3): any
    (...a: infer A4): any
    (...a: infer A5): any
  }
    ? A1 | A2 | A3 | A4 | A5
    : F extends {
      (...a: infer A1): any
      (...a: infer A2): any
      (...a: infer A3): any
      (...a: infer A4): any
    }
      ? A1 | A2 | A3 | A4
      : F extends {
        (...a: infer A1): any
        (...a: infer A2): any
        (...a: infer A3): any
      }
        ? A1 | A2 | A3
        : F extends {
          (...a: infer A1): any
          (...a: infer A2): any
        }
          ? A1 | A2
          : F extends (...a: infer A1) => any
            ? A1
            : never

/**
 * Removes 0-arg overloads (getters), leaving only setter-style overload argument tuples.
 */
export type SetterArgs<F> = Exclude<OverloadedArgs<F>, []>

/**
 * True if the function has at least one overload that accepts arguments (i.e. a setter overload).
 */
export type HasArgs<F> = [SetterArgs<F>] extends [never] ? false : true

export type OwnKeys<T> =
  T extends AnyFn ? Exclude<keyof T, keyof CallableFunction> : keyof T

/**
 * Converts method parameters to modifiers values
 * - single non-array arg: `arg` | `[arg]`
 * - multiple args/single array wrapped with array
 */
export type ModifierArgs<P extends unknown[]> =
  P extends [infer Only]
    ? Only extends readonly unknown[]
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
  [K in OwnKeys<T> as Extract<T[K], AnyFn> extends never
    ? never
    : HasArgs<Extract<T[K], AnyFn>> extends true
      ? K
      : never
  ]?: ModifierArgs<Extract<SetterArgs<Extract<T[K], AnyFn>>, unknown[]>>
}

/**
 * Invokes `target` methods with arguments from `modifiers`.
 *
 * modifiers: `{ [methodName]: args[] | arg }`
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
