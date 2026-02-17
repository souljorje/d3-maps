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

export async function get<T>(url: string): Promise<T> {
  const response = await fetch(url)
  return response.json() as Promise<T>
}

export function makeTransform(x: number, y: number, k?: number): string {
  return `translate(${x}, ${y}) scale(${k ?? 1})`
}
