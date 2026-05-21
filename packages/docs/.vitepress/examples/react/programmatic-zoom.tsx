import type {
  MapDataSource,
  MapFeature,
} from '@d3-maps/react'
import type {
  JSX,
  KeyboardEvent as ReactKeyboardEvent,
} from 'react'

import { makeMapFeatures } from '@d3-maps/core'
import {
  getObjectZoomView,
  MapBase,
  MapFeatures,
  MapGraticule,
  MapMesh,
  MapObject,
  MapZoom,
  useCreateMapContext,
} from '@d3-maps/react'
import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

const initialZoom = 1
const minZoom = 1
const maxZoom = 16
const zoomStep = 0.5
type MapGeoFeature = Extract<MapFeature, { type: 'Feature' }>

export default function ProgrammaticZoomExample(): JSX.Element | null {
  const [mapData, setMapData] = useState<MapDataSource>()
  const [center, setCenter] = useState<[number, number]>()
  const [zoom, setZoom] = useState(initialZoom)
  const [activeCountryLabel, setActiveCountryLabel] = useState('World')
  const [isTransitionOn, setIsTransitionOn] = useState(true)
  const mapRootRef = useRef<HTMLDivElement | null>(null)

  const mapContext = useCreateMapContext(
    mapData
      ? {
          fit: mapData,
        }
      : undefined,
  )

  useEffect(() => {
    let isCancelled = false

    async function loadMap(): Promise<void> {
      const { default: payload } = await import('@d3-maps/atlas/world/countries')

      if (!isCancelled) {
        setMapData(payload)
      }
    }

    loadMap()

    return () => {
      isCancelled = true
    }
  }, [])

  const renderedFeatures = useMemo(() => {
    return mapData && mapContext
      ? makeMapFeatures(mapContext, { data: mapData })
      : []
  }, [mapContext, mapData])

  if (!mapData || !mapContext) return null

  function zoomIn(): void {
    setIsTransitionOn(false)
    setZoom(clampZoom(zoom + zoomStep))
    queueMicrotask(() => setIsTransitionOn(true))
  }

  function zoomOut(): void {
    setIsTransitionOn(false)
    setZoom(clampZoom(zoom - zoomStep))
    queueMicrotask(() => setIsTransitionOn(true))
  }

  function resetView(): void {
    setCenter(undefined)
    setZoom(initialZoom)
    setActiveCountryLabel('World')
  }

  function zoomToFeature(feature: MapGeoFeature): void {
    const view = getObjectZoomView(mapContext, feature, {
      minZoom,
      maxZoom,
    })

    if (!view) return

    setCenter(view.center)
    setZoom(view.zoom)
    setActiveCountryLabel(getFeatureLabel(feature))
  }

  function onFeatureClick(
    feature: MapGeoFeature,
  ): void {
    zoomToFeature(feature)
  }

  function onFeatureKeyDown(
    feature: MapGeoFeature,
    event: ReactKeyboardEvent<SVGPathElement>,
  ): void {
    if (event.key !== 'Enter' && event.key !== ' ') return

    event.preventDefault()
    zoomToFeature(feature)
    focusFeatureElement(event.currentTarget)
  }

  async function zoomToRandomCountry(): Promise<void> {
    const features = renderedFeatures.filter((feature): feature is MapGeoFeature => feature.type === 'Feature')
    const randomIndex = Math.floor(Math.random() * features.length)
    const feature = features[randomIndex]

    if (!feature) return

    zoomToFeature(feature)

    await Promise.resolve()
    focusFeatureByKey(feature.key)
  }

  function focusFeatureByKey(featureKey: string | number): void {
    const featureElement = mapRootRef.current?.querySelector<SVGPathElement>(
      `[data-feature-key="${String(featureKey)}"]`,
    )

    focusFeatureElement(featureElement)
  }

  return (
    <div
      ref={mapRootRef}
      className="grid gap-3"
    >
      <div style={{ aspectRatio: '2 / 1' }}>
        <MapBase
          context={mapContext}
        >
          <MapZoom
            center={center}
            zoom={zoom}
            minZoom={minZoom}
            maxZoom={maxZoom}
            transition={{
              duration: isTransitionOn ? 600 : 0,
            }}
            config={{ filter: isDragOnlyFilter }}
          >
            <MapGraticule
              border
              pointerEvents="none"
            />
            <MapFeatures
              data={mapData}
              fill="var(--vp-c-neutral-inverse)"
            >
              {({ features }) => features.map((feature) => (
                <MapObject
                  key={feature.key}
                  d={feature.d}
                  data-feature-key={feature.key}
                  aria-label={feature.type === 'Feature' ? getFeatureLabel(feature) : undefined}
                  role="button"
                  tabIndex={0}
                  style={{ cursor: 'pointer' }}
                  styles={{
                    focus: {
                      fill: 'lightskyblue',
                    },
                  }}
                  onClick={() => {
                    if (feature.type === 'Feature') onFeatureClick(feature)
                  }}
                  onKeyDown={(event) => {
                    if (feature.type === 'Feature') onFeatureKeyDown(feature, event)
                  }}
                />
              ))}
            </MapFeatures>
            <MapMesh
              data={mapData}
              pointerEvents="none"
            />
          </MapZoom>
        </MapBase>
      </div>

      <div className="flex flex-col items-center justify-center gap-2">
        <div>
          Focus:
          {' '}
          {activeCountryLabel}
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          <button
            type="button"
            className="rounded-full border px-0 py-0 text-sm w-7 h-7"
            onClick={zoomOut}
          >
            -
          </button>
          <div>
            {zoom.toFixed(1)}
            x
          </div>
          <button
            type="button"
            className="rounded-full border px-0 py-0 text-sm w-7 h-7"
            onClick={zoomIn}
          >
            +
          </button>
          <button
            type="button"
            className="rounded border px-3 h-7"
            onClick={zoomToRandomCountry}
          >
            Random
          </button>
          <button
            type="button"
            className="rounded border px-3 h-7"
            onClick={resetView}
          >
            Reset
          </button>
        </div>
        <div className="text-sm text-[var(--vp-c-text-2)]">
          Click any country to zoom to it. Drag enabled, wheel zoom disabled.
        </div>
      </div>
    </div>
  )
}

function clampZoom(value: number): number {
  return Math.min(maxZoom, Math.max(minZoom, value))
}

function isDragOnlyFilter(event: Event): boolean {
  return event.type !== 'wheel' && event.type !== 'dblclick'
}

function getFeatureLabel(feature: MapGeoFeature): string {
  return String(
    feature.properties?.name
    ?? 'Country',
  )
}

function focusFeatureElement(element: SVGPathElement | null | undefined): void {
  if (!element) return

  try {
    element.focus({ preventScroll: true })
  } catch {
    element.focus()
  }
}
