import type {
  MapFeature as D3MapFeature,
  MapData,
  ProjectionConfig,
} from '@d3-maps/core'
import type {
  JSX,
  KeyboardEvent as ReactKeyboardEvent,
  MouseEvent as ReactMouseEvent,
} from 'react'

import {
  getFeatureKey,
  getObjectZoomView,
} from '@d3-maps/core'
import {
  Map,
  MapFeature,
  MapFeatures,
  MapGraticule,
  MapMesh,
  MapZoom,
  useCreateMapContext,
} from '@d3-maps/react'
import {
  useEffect,
  useRef,
  useState,
} from 'react'
import { withBase } from 'vitepress'

const initialZoom = 1
const minZoom = 1
const maxZoom = 16
const zoomStep = 0.5
const projectionConfig: ProjectionConfig = {
  rotate: [[-11, 0]],
}
export default function ProgrammaticZoomExample(): JSX.Element | null {
  const [mapData, setMapData] = useState<MapData>()
  const [center, setCenter] = useState<[number, number]>()
  const [zoom, setZoom] = useState(initialZoom)
  const [activeCountryLabel, setActiveCountryLabel] = useState('World')
  const [isTransitionOn, setIsTransitionOn] = useState(true)
  const mapRootRef = useRef<HTMLDivElement | null>(null)

  const mapContext = useCreateMapContext(
    mapData
      ? {
          data: mapData,
          projectionConfig,
        }
      : undefined,
  )

  useEffect(() => {
    let isCancelled = false

    async function loadMap(): Promise<void> {
      const response = await fetch(withBase('/example-data/countries-110m.json'))
      const payload = await response.json()

      if (!isCancelled) {
        setMapData(payload)
      }
    }

    loadMap()

    return () => {
      isCancelled = true
    }
  }, [])

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

  function zoomToFeature(feature: D3MapFeature): void {
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
    feature: D3MapFeature,
    event: ReactMouseEvent<SVGPathElement>,
  ): void {
    zoomToFeature(feature)
    focusFeatureElement(event.currentTarget)
  }

  function onFeatureKeyDown(
    feature: D3MapFeature,
    event: ReactKeyboardEvent<SVGPathElement>,
  ): void {
    if (event.key !== 'Enter' && event.key !== ' ') return

    event.preventDefault()
    zoomToFeature(feature)
    focusFeatureElement(event.currentTarget)
  }

  async function zoomToRandomCountry(): Promise<void> {
    const randomIndex = Math.floor(Math.random() * mapContext.features.length)
    const feature = mapContext.features[randomIndex]

    if (!feature) return

    zoomToFeature(feature)

    await Promise.resolve()
    focusFeatureByKey(getFeatureKey(feature, 'id', randomIndex))
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
        <Map
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
            <MapFeatures fill="var(--vp-c-neutral-inverse)">
              {({ features }) => features.map((feature, index) => (
                <MapFeature
                  key={getFeatureKey(feature, 'id', index)}
                  data={feature}
                  data-feature-key={getFeatureKey(feature, 'id', index)}
                  aria-label={getFeatureLabel(feature)}
                  role="button"
                  tabIndex={0}
                  style={{ cursor: 'pointer' }}
                  styles={{
                    focus: {
                      fill: 'lightskyblue',
                    },
                  }}
                  onClick={(event) => onFeatureClick(feature, event)}
                  onKeyDown={(event) => onFeatureKeyDown(feature, event)}
                />
              ))}
            </MapFeatures>
            <MapMesh pointerEvents="none" />
          </MapZoom>
        </Map>
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

function getFeatureLabel(feature: D3MapFeature): string {
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
