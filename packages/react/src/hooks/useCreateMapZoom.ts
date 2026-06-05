'use client'

import type {
  ApplyZoomTransformOptions,
  DefaultZoomBehavior,
  ScaleToOptions,
  ZoomEvent,
  ZoomFitOptions,
  ZoomObject,
  ZoomProps,
  ZoomTransform,
} from '@d3-maps/core'
import type { RefObject } from 'react'

import {
  scaleTo as applyScaleTo,
  applyZoomEventTransform,
  applyZoomTransform,
  createZoomBehavior,
  getCurrentZoomTransform,
  getFeatureZoomTransform,
  setupZoom,
  zoomIdentity,
} from '@d3-maps/core'
import {
  useCallback,
  useEffect,
  useMemo,
} from 'react'

import { useLatest } from './useLatest'
import { useMapContext } from './useMapContext'

export interface MapZoomState {
  minZoom: number
  maxZoom: number
}

export interface MapZoomEventCallbacks {
  onZoomStart?: (event: ZoomEvent) => void
  onZoom?: (event: ZoomEvent) => void
  onZoomEnd?: (event: ZoomEvent) => void
}

export interface ResolvedMapZoomProps extends ZoomProps {
  minZoom: number
  maxZoom: number
}

export type MapZoomCommandOptions = Pick<ApplyZoomTransformOptions, 'transition'>

export interface MapZoomFeatureOptions extends ZoomFitOptions, MapZoomCommandOptions {}
export type MapZoomByOptions = Pick<ScaleToOptions, 'transition'>
export type MapZoomToScaleOptions = Pick<ScaleToOptions, 'transition'>

export interface MapZoomCommands {
  zoomTo: (transform: ZoomTransform, options?: MapZoomCommandOptions) => boolean
  zoomBy: (delta: number, options?: MapZoomByOptions) => boolean
  zoomToScale: (scale: number, options?: MapZoomToScaleOptions) => boolean
  zoomToFeature: (feature: ZoomObject, options?: MapZoomFeatureOptions) => boolean
  reset: (options?: MapZoomCommandOptions) => boolean
}

export interface CreateMapZoomResult extends MapZoomCommands {
  containerRef: RefObject<SVGGElement | null>
  zoomBehavior: DefaultZoomBehavior
  zoomContext: MapZoomState
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

  const zoomContext = useMemo<MapZoomState>(() => ({
    minZoom,
    maxZoom,
  }), [
    maxZoom,
    minZoom,
  ])

  const zoomTo = useCallback((
    transform: ZoomTransform,
    options?: MapZoomCommandOptions,
  ): boolean => {
    return applyZoomTransform({
      element: containerRef.current,
      behavior: zoomBehavior,
      transform,
      transition: options?.transition ?? transition,
    })
  }, [
    transition,
    zoomBehavior,
  ])

  const zoomToScale = useCallback((
    scale: number,
    options?: MapZoomToScaleOptions,
  ): boolean => {
    return applyScaleTo({
      element: containerRef.current,
      behavior: zoomBehavior,
      scale,
      transition: options?.transition ?? transition,
    })
  }, [
    transition,
    zoomBehavior,
  ])

  const zoomBy = useCallback((
    delta: number,
    options?: MapZoomByOptions,
  ): boolean => {
    const currentTransform = getCurrentZoomTransform(containerRef.current)
    return zoomToScale(currentTransform.k + delta, options)
  }, [
    zoomToScale,
  ])

  const zoomToFeature = useCallback((
    feature: ZoomObject,
    options: MapZoomFeatureOptions = {},
  ): boolean => {
    const transform = getFeatureZoomTransform(context, feature, {
      minZoom: options.minZoom ?? minZoom,
      maxZoom: options.maxZoom ?? maxZoom,
      padding: options.padding,
    })

    return transform ? zoomTo(transform, options) : false
  }, [
    context,
    maxZoom,
    minZoom,
    zoomTo,
  ])

  const reset = useCallback((
    options?: MapZoomCommandOptions,
  ): boolean => {
    return zoomTo(zoomIdentity, options)
  }, [zoomTo])

  return {
    containerRef,
    reset,
    zoomBy,
    zoomTo,
    zoomToFeature,
    zoomToScale,
    zoomBehavior,
    zoomContext,
  }
}
