import type {
  MapAnnotationProps as CoreMapAnnotationProps,
  MapElementProps as CoreMapElementProps,
  MapFeaturesProps as CoreMapFeaturesProps,
  MapGraticuleProps as CoreMapGraticuleProps,
  MapLineProps as CoreMapLineProps,
  MapMarkerProps as CoreMapMarkerProps,
  MapMeshProps as CoreMapMeshProps,
  MapSphereProps as CoreMapSphereProps,
  DefaultZoomBehavior,
  MapContext,
  MapFeatureRendered,
  MapProps,
  ZoomCommands,
  ZoomEvents,
  ZoomProps,
} from '@d3-maps/core'
import type { JSX } from '@solidjs/web'
import type { Ref } from 'solid-js'

/** Native and interaction styles use Solid's CSS property objects. */
export type MapElementProps = Omit<JSX.SVGAttributes<SVGElement>, 'style' | 'children' | 'ref'> & CoreMapElementProps<JSX.CSSProperties> & {
  tag?: 'path' | 'g'
  style?: JSX.CSSProperties
  ref?: Ref<SVGElement>
  children?: JSX.Element
}

export type MapBaseProps = Omit<JSX.IntrinsicElements['svg'], keyof MapProps | 'children'> & MapProps & {
  context?: MapContext
  children?: JSX.Element | ((context: MapContext) => JSX.Element)
}

export type MapFeatureProps = Omit<MapElementProps, 'tag' | 'children'>

export type MapFeaturesProps<TExtra extends object = object> =
  Omit<JSX.IntrinsicElements['g'], 'children'> & CoreMapFeaturesProps<TExtra, JSX.CSSProperties> & {
    children?: (value: { features: MapFeatureRendered<TExtra>[] }) => JSX.Element
    onFeaturesChange?: (features: MapFeatureRendered<TExtra>[]) => void
  }

export type MapMarkerProps = Omit<MapElementProps, 'tag' | 'd'> & CoreMapMarkerProps<JSX.CSSProperties>
export type MapLineProps = Omit<MapElementProps, 'tag' | 'd' | 'children'> & CoreMapLineProps<JSX.CSSProperties>
export type MapAnnotationProps = Omit<MapElementProps, 'tag' | 'd'> & CoreMapAnnotationProps<JSX.CSSProperties>
export type MapGraticuleProps = Omit<JSX.IntrinsicElements['path'], 'children' | 'd' | 'fill'> & CoreMapGraticuleProps
export type MapMeshProps = Omit<JSX.IntrinsicElements['path'], 'children' | 'd' | 'filter'> & CoreMapMeshProps
export type MapSphereProps = Omit<JSX.IntrinsicElements['g'], 'fill' | 'stroke'> & CoreMapSphereProps

export interface MapZoomHandle extends ZoomCommands {
  getContainer: () => SVGGElement | null
  getZoomBehavior: () => DefaultZoomBehavior | undefined
}

export type MapZoomProps = JSX.IntrinsicElements['g'] & ZoomProps & ZoomEvents & {
  onReady?: (zoom: MapZoomHandle) => void
}
