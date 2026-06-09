'use client'

import type {
  DefaultZoomBehavior,
  ZoomCommands,
  ZoomEvent,
  ZoomProps,
} from '@d3-maps/core'
import type { RefObject } from 'react'

import {
  applyZoomEventTransform,
  createZoomBehavior,
  createZoomCommands,
  setupZoom,
} from '@d3-maps/core'
import {
  useCallback,
  useEffect,
  useMemo,
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
  zoomBehavior: DefaultZoomBehavior
}

export function useCreateMapZoom(
  containerRef: RefObject<SVGGElement | null>,
  props: ResolvedMapZoomProps,
  eventCallbacks: MapZoomEventCallbacks,
): CreateMapZoomResult {
  const { minZoom, maxZoom, transition, config } = props
  const context = useMapContext()

  const {
    onZoomStart,
    onZoom,
    onZoomEnd,
  } = eventCallbacks
  const onZoomStartRef = useLatest(onZoomStart)
  const onZoomRef = useLatest(onZoom)
  const onZoomEndRef = useLatest(onZoomEnd)

  const onZoomStartEvent = useCallback((event: ZoomEvent) => {
    onZoomStartRef.current?.(event)
  }, [])
  const onZoomEvent = useCallback((event: ZoomEvent) => {
    applyZoomEventTransform(containerRef.current, event)
    onZoomRef.current?.(event)
  }, [])
  const onZoomEndEvent = useCallback((event: ZoomEvent) => {
    onZoomEndRef.current?.(event)
  }, [])

  const zoomBehavior = useMemo(() => {
    return createZoomBehavior({
      width: context.width,
      height: context.height,
    }, {
      minZoom,
      maxZoom,
      config,
      onZoomStart: onZoomStartEvent,
      onZoom: onZoomEvent,
      onZoomEnd: onZoomEndEvent,
    })
  }, [
    config,
    context.height,
    context.width,
    maxZoom,
    minZoom,
  ])

  useEffect(() => {
    setupZoom({
      element: containerRef.current,
      behavior: zoomBehavior,
    })
  }, [zoomBehavior])

  const commands = useMemo(() => createZoomCommands({
    element: () => containerRef.current,
    behavior: () => zoomBehavior,
    context: () => context,
    minZoom: () => minZoom,
    maxZoom: () => maxZoom,
    transition: () => transition,
  }), [
    context,
    maxZoom,
    minZoom,
    transition,
    zoomBehavior,
  ])

  return {
    commands,
    zoomBehavior,
  }
}
