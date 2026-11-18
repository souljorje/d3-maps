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
import type { Snippet } from 'svelte'
import type { SVGAttributes } from 'svelte/elements'

/** Svelte styles use native CSS declaration strings, including interaction states. */
export type MapElementProps = Omit<SVGAttributes<SVGElement>, 'children'> & CoreMapElementProps<string> & {
  tag?: 'path' | 'g'
  children?: Snippet
}

export type MapBaseProps = Omit<SVGAttributes<SVGSVGElement>, keyof MapProps | 'children'> & MapProps & {
  context?: MapContext
  children?: Snippet<[MapContext]>
}

export type MapFeatureProps = Omit<MapElementProps, 'tag' | 'children'>

export type MapFeaturesProps<TExtra extends object = object> =
  Omit<SVGAttributes<SVGGElement>, 'children'> & CoreMapFeaturesProps<TExtra, string> & {
    children?: Snippet<[{ features: MapFeatureRendered<TExtra>[] }]>
    onFeaturesChange?: (features: MapFeatureRendered<TExtra>[]) => void
  }

export type MapMarkerProps = Omit<MapElementProps, 'tag' | 'd'> & CoreMapMarkerProps<string>
export type MapLineProps = Omit<MapElementProps, 'tag' | 'd' | 'children'> & CoreMapLineProps<string>
export type MapAnnotationProps = Omit<MapElementProps, 'tag' | 'd'> & CoreMapAnnotationProps<string>
export type MapGraticuleProps = Omit<SVGAttributes<SVGPathElement>, 'children' | 'd' | 'fill'> & CoreMapGraticuleProps
export type MapMeshProps = Omit<SVGAttributes<SVGPathElement>, 'children' | 'd' | 'filter'> & CoreMapMeshProps
export type MapSphereProps = Omit<SVGAttributes<SVGGElement>, 'children' | 'fill' | 'stroke'> & CoreMapSphereProps & {
  children?: Snippet
}

export interface MapZoomHandle extends ZoomCommands {
  getContainer: () => SVGGElement | null
  getZoomBehavior: () => DefaultZoomBehavior | undefined
}

export type MapZoomProps = Omit<SVGAttributes<SVGGElement>, 'children'> & ZoomProps & ZoomEvents & {
  children?: Snippet
  onReady?: (zoom: MapZoomHandle) => void
}
