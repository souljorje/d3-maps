'use client'

import type { RefObject } from 'react'

import { useRef } from 'react'

export function useLatest<T>(value: T): RefObject<T> {
  const ref = useRef(value)
  ref.current = value
  return ref
}
