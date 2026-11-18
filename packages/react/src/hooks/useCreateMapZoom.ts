'use client'

import type {
  DefaultZoomBehavior,
  ZoomBinding,
  ZoomCommands,
  ZoomEvent,
  ZoomProps,
} from '@d3-maps/core'
import type { RefObject } from 'react'

import {
  createZoomBinding,
  createZoomCommandsProxy,
} from '@d3-maps/core'
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from 'react'

import { useLatest } from './useLatest'
import { useMapContext } from './useMapContext'

export interface MapZoomEventCallbacks {
  onZoomStart?: (event: ZoomEvent) => void
  onZoom?: (event: ZoomEvent) => void
  onZoomEnd?: (event: ZoomEvent) => void
}

export interface ResolvedMapZoomProps extends ZoomProps {
  minZoom: number
  maxZoom: number
}

export interface CreateMapZoomResult {
  commands: ZoomCommands
  getZoomBehavior: () => DefaultZoomBehavior | undefined
}

export function useCreateMapZoom(
  containerRef: RefObject<SVGGElement | null>,
  props: ResolvedMapZoomProps,
  eventCallbacks: MapZoomEventCallbacks,
): CreateMapZoomResult {
  const { minZoom, maxZoom, config } = props
  const context = useMapContext()
  const latestContext = useLatest(context)
  const latestProps = useLatest(props)
  const latestCallbacks = useLatest(eventCallbacks)
  const bindingRef = useRef<ZoomBinding | undefined>(undefined)

  const commands = useMemo(() => createZoomCommandsProxy(() => bindingRef.current?.commands), [])
  const getZoomBehavior = useCallback(() => bindingRef.current?.zoomBehavior, [])

  useEffect(() => {
    const element = containerRef.current
    if (!element) return

    const current = createZoomBinding(
      () => latestContext.current,
      element,
      () => ({
        ...latestProps.current,
        onZoomStart: (event) => latestCallbacks.current.onZoomStart?.(event),
        onZoom: (event) => latestCallbacks.current.onZoom?.(event),
        onZoomEnd: (event) => latestCallbacks.current.onZoomEnd?.(event),
      }),
    )
    bindingRef.current = current

    return () => {
      current.dispose()
      if (bindingRef.current === current) bindingRef.current = undefined
    }
  }, [containerRef, latestContext, latestProps, latestCallbacks])

  useEffect(() => {
    bindingRef.current?.update()
  }, [context.width, context.height, minZoom, maxZoom, config])

  return { commands, getZoomBehavior }
}
