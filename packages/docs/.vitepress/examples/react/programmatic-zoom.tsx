import type {
  MapData,
  MapFeatureData,
  MapZoomRef,
  ZoomEvent,
} from '@d3-maps/react'
import type {
  JSX,
  KeyboardEvent as ReactKeyboardEvent,
} from 'react'

import {
  getFeatureKey,
  MapBase,
  MapFeature,
  MapFeatures,
  MapGraticule,
  MapMesh,
  MapZoom,
  useCreateMapContext,
  useMapZoom,
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
const zoomTransition = [{ duration: 600 }] as const
const dragOnlyZoomConfig = { filter: isDragOnlyFilter }
const featureButtonStyle = { cursor: 'pointer' }
const featureInteractionStyles = {
  focus: {
    fill: 'lightskyblue',
  },
}

export default function ProgrammaticZoomExample(): JSX.Element | null {
  const [mapData, setMapData] = useState<MapData>()
  const [zoomLevel, setZoomLevel] = useState(initialZoom)
  const [activeCountryLabel, setActiveCountryLabel] = useState('World')
  const mapRootRef = useRef<HTMLDivElement | null>(null)
  const zoomRef = useRef<MapZoomRef | null>(null)
  const zoom = useMapZoom(zoomRef)

  const mapContextConfig = useMemo(
    () => (mapData ? { data: mapData } : undefined),
    [mapData],
  )
  const mapContext = useCreateMapContext(mapContextConfig)

  useEffect(() => {
    let isCancelled = false

    async function loadMap(): Promise<void> {
      const { default: payload } = await import('world-atlas/countries-110m.json')

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
    zoom.scaleWith(zoomStep)
  }

  function zoomOut(): void {
    zoom.scaleWith(-zoomStep)
  }

  function resetView(): void {
    zoom.reset()
    setActiveCountryLabel('World')
  }

  function zoomToFeature(feature: MapFeatureData): void {
    const didFit = zoom.zoomToFeature(feature)

    if (!didFit) return

    setActiveCountryLabel(getFeatureLabel(feature))
  }

  function onZoom(event: ZoomEvent): void {
    setZoomLevel(event.transform.k)
  }

  function onFeatureClick(
    feature: MapFeatureData,
  ): void {
    zoomToFeature(feature)
  }

  function onFeatureKeyDown(
    feature: MapFeatureData,
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

    const featureKey = getFeatureKey(feature)
    if (featureKey === undefined) return

    await Promise.resolve()
    focusFeatureByKey(featureKey)
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
            ref={zoomRef}
            minZoom={minZoom}
            maxZoom={maxZoom}
            transition={zoomTransition}
            config={dragOnlyZoomConfig}
            onZoom={onZoom}
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
                  data-feature-key={getFeatureKey(feature)}
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
            <MapMesh pointerEvents="none" />
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
            {zoomLevel.toFixed(1)}
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

function isDragOnlyFilter(event: Event): boolean {
  return event.type !== 'wheel' && event.type !== 'dblclick'
}

function getFeatureLabel(feature: MapFeatureData): string {
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
