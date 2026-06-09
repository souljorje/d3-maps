import type {
  MapData,
  MapFeatureRendered,
  MapZoomRef,
  ZoomEvent,
} from '@d3-maps/react'
import type {
  JSX,
  KeyboardEvent as ReactKeyboardEvent,
} from 'react'

import { makeMapFeatures } from '@d3-maps/core'
import {
  MapBase,
  MapFeature,
  MapFeatures,
  MapGraticule,
  MapMesh,
  MapSphere,
  MapZoom,
  useCreateMapContext,
  useMapZoom,
} from '@d3-maps/react'
import {
  use,
  useMemo,
  useRef,
  useState,
} from 'react'

const initialZoom = 1
const minZoom = 1
const maxZoom = 16
const zoomStep = 0.5
const zoomTransition = [{ duration: 600 }] as const
const dragOnlyZoomConfig = { filter: isDragOnlyFilter }
const featureButtonStyle = { cursor: 'pointer' }
const featureInteractionStyles = {
  focus: {
    fill: 'lightskyblue',
  },
}

function isDragOnlyFilter(event: Event): boolean {
  return event.type !== 'wheel' && event.type !== 'dblclick'
}

function getFeatureLabel(feature: MapFeatureRendered): string {
  return String(feature.properties.name ?? 'Country')
}

const mapDataPromise = import('@d3-maps/atlas/world/countries/countries-110m').then((m) => m.default as MapData)

export default function ProgrammaticZoomExample(): JSX.Element {
  const mapData = use(mapDataPromise)
  const [zoomLevel, setZoomLevel] = useState(initialZoom)
  const [activeCountryLabel, setActiveCountryLabel] = useState('World')
  const mapRootRef = useRef<HTMLDivElement | null>(null)
  const zoomRef = useRef<MapZoomRef | null>(null)
  const zoom = useMapZoom(zoomRef)
  const mapContext = useCreateMapContext()

  const renderedFeatures = useMemo(() => {
    return makeMapFeatures(mapContext, {
      data: mapData,
    })
  }, [mapContext, mapData])

  function zoomIn(): void {
    zoom.scaleWith(zoomStep)
  }

  function zoomOut(): void {
    zoom.scaleWith(-zoomStep)
  }

  function resetView(): void {
    zoom.reset()
    setActiveCountryLabel('World')
  }

  function zoomToFeature(feature: MapFeatureRendered): void {
    const didFit = zoom.zoomToFeature(feature)
    if (!didFit) return

    setActiveCountryLabel(getFeatureLabel(feature))
  }

  function zoomToRandomCountry(): void {
    const randomIndex = Math.floor(Math.random() * renderedFeatures.length)
    const feature = renderedFeatures[randomIndex]
    if (!feature) return

    zoomToFeature(feature)
    focusFeatureByKey(feature.key)
  }

  function onZoom(event: ZoomEvent): void {
    setZoomLevel(event.transform.k)
  }

  function onFeatureClick(feature: MapFeatureRendered): void {
    zoomToFeature(feature)
  }

  function onFeatureKeyDown(
    feature: MapFeatureRendered,
    event: ReactKeyboardEvent<SVGPathElement>,
  ): void {
    if (event.key !== 'Enter' && event.key !== ' ') return
    event.preventDefault()
    zoomToFeature(feature)
  }

  function focusFeatureByKey(featureKey: string | number): void {
    const featureElement = mapRootRef.current?.querySelector<SVGPathElement>(
      `[data-feature-key="${String(featureKey)}"]`,
    )
    featureElement?.focus({ preventScroll: true })
  }

  return (
    <div
      ref={mapRootRef}
      className="grid gap-3"
    >
      <div className="relative aspect-2/1">
        <MapBase context={mapContext}>
          <MapZoom
            ref={zoomRef}
            minZoom={minZoom}
            maxZoom={maxZoom}
            transition={zoomTransition}
            config={dragOnlyZoomConfig}
            onZoom={onZoom}
          >
            <MapSphere
              fill="var(--vp-c-bg-alt)"
              stroke="var(--vp-c-border)"
            >
              <MapGraticule pointerEvents="none" />
              <MapFeatures
                data={mapData}
                fill="var(--vp-c-neutral-inverse)"
              >
                {({ features }) => features.map((feature) => (
                  <MapFeature
                    key={feature.key}
                    d={feature.d}
                    data-feature-key={feature.key}
                    aria-label={getFeatureLabel(feature)}
                    role="button"
                    tabIndex={0}
                    style={featureButtonStyle}
                    styles={featureInteractionStyles}
                    onClick={() => onFeatureClick(feature)}
                    onKeyDown={(event) => onFeatureKeyDown(feature, event)}
                  />
                ))}
              </MapFeatures>
              <MapMesh
                data={mapData}
                pointerEvents="none"
              />
            </MapSphere>
          </MapZoom>
        </MapBase>
      </div>
      <div className="flex flex-col justify-center items-center gap-2">
        <div>{activeCountryLabel}</div>
        <div className="flex gap-2 flex-wrap justify-center">
          <button
            type="button"
            className="flex items-center justify-center rounded-full w-7 h-7 border!"
            onClick={zoomOut}
          >
            -
          </button>
          <div>
            {zoomLevel.toFixed(1)}
            x
          </div>
          <button
            type="button"
            className="flex items-center justify-center rounded-full w-7 h-7 border!"
            onClick={zoomIn}
          >
            +
          </button>
          <button
            type="button"
            className="flex rounded border! px-3! h-7"
            onClick={zoomToRandomCountry}
          >
            Random
          </button>
          <button
            type="button"
            className="flex rounded border! px-3! h-7"
            onClick={resetView}
          >
            Reset
          </button>
        </div>
        <div className="text-sm text-(--vp-c-text-2)">
          Click any country to zoom to it. Drag enabled, wheel zoom disabled.
        </div>
      </div>
    </div>
  )
}
