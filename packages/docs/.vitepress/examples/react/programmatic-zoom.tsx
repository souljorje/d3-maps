import type {
  MapFeature as D3MapFeature,
  MapContext,
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
  useMapContext,
} from '@d3-maps/react'
import {
  useEffect,
  useRef,
  useState,
} from 'react'
import { withBase } from 'vitepress'

const initialZoom = 1
const minZoom = 1
const maxZoom = 8
const zoomStep = 0.5
const projectionConfig: ProjectionConfig = {
  rotate: [[-11, 0]],
}
const featureStyles = {
  default: { fill: 'var(--vp-c-neutral-inverse)' },
  hover: { fill: 'lightblue' },
  active: { fill: 'skyblue' },
  focus: {
    fill: 'lightskyblue',
    stroke: 'darkgreen',
    strokeWidth: 1,
  },
}

export default function ProgrammaticZoomExample(): JSX.Element | null {
  const [mapData, setMapData] = useState<MapData>()
  const [center, setCenter] = useState<[number, number]>()
  const [zoom, setZoom] = useState(initialZoom)
  const [activeCountryLabel, setActiveCountryLabel] = useState('World')
  const mapRootRef = useRef<HTMLDivElement | null>(null)

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

  function zoomIn(): void {
    setZoom(clampZoom(zoom + zoomStep))
  }

  function zoomOut(): void {
    setZoom(clampZoom(zoom - zoomStep))
  }

  function resetView(): void {
    setCenter(undefined)
    setZoom(initialZoom)
    setActiveCountryLabel('World')
  }

  function zoomToRandomCountry(feature: D3MapFeature, index: number, context: MapContext): void {
    if (!feature) return

    zoomToFeature(feature, context)
    focusFeatureByKey(String(getFeatureKey(feature, 'id', index)))
  }

  function zoomToFeature(feature: D3MapFeature, context: MapContext): void {
    const view = getObjectZoomView(context, feature, {
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
    context: MapContext,
    event: ReactMouseEvent<SVGPathElement>,
  ): void {
    zoomToFeature(feature, context)
    focusFeatureElement(event.currentTarget)
  }

  function onFeatureKeyDown(
    feature: D3MapFeature,
    context: MapContext,
    event: ReactKeyboardEvent<SVGPathElement>,
  ): void {
    if (event.key !== 'Enter' && event.key !== ' ') return

    event.preventDefault()
    zoomToFeature(feature, context)
    focusFeatureElement(event.currentTarget)
  }

  function focusFeatureByKey(featureKey: string): void {
    const featureElement = mapRootRef.current?.querySelector<SVGPathElement>(
      `[data-feature-key="${escapeAttributeValue(featureKey)}"]`,
    )

    focusFeatureElement(featureElement)
  }

  return mapData
    ? (
        <div
          ref={mapRootRef}
          className="grid gap-3"
        >
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              className="rounded border px-3 py-1 text-sm"
              onClick={zoomOut}
            >
              -
            </button>
            <span className="text-sm text-[var(--vp-c-text-2)]">
              {zoom.toFixed(1)}
              x
            </span>
            <button
              type="button"
              className="rounded border px-3 py-1 text-sm"
              onClick={zoomIn}
            >
              +
            </button>
            <button
              type="button"
              className="rounded border px-3 py-1 text-sm"
              onClick={zoomToRandomCountry}
            >
              Random
            </button>
            <button
              type="button"
              className="rounded border px-3 py-1 text-sm"
              onClick={resetView}
            >
              Reset
            </button>
          </div>

          <div className="text-sm text-[var(--vp-c-text-2)]">
            Click any country to zoom to it. Drag enabled, wheel zoom disabled.
          </div>
          <div className="text-sm text-[var(--vp-c-text-2)]">
            Focus:
            {' '}
            {activeCountryLabel}
          </div>

          <div style={{ aspectRatio: '2 / 1' }}>
            <Map
              data={mapData}
              aspectRatio={2 / 1}
              projectionConfig={projectionConfig}
            >
              {
                (context) => (
                  <>
                    <ProgrammaticZoomControls
                      zoom={zoom}
                      onZoomIn={zoomIn}
                      onZoomOut={zoomOut}
                      onResetView={resetView}
                      onZoomToRandomCountry={zoomToRandomCountry}
                    />
                    <MapZoom
                      center={center}
                      zoom={zoom}
                      minZoom={minZoom}
                      maxZoom={maxZoom}
                      transition={{
                        duration: 250,
                      }}
                      config={{ filter: isDragOnlyFilter }}
                    >
                      <MapGraticule
                        border
                        pointerEvents="none"
                      />
                      <MapFeatures fill="var(--vp-c-neutral-inverse)">
                        {
                          ({ features }) => features.map((feature, index) => (
                            <MapFeature
                              key={getFeatureKey(feature, 'id', index)}
                              data={feature}
                              data-feature-key={String(getFeatureKey(feature, 'id', index))}
                              aria-label={getFeatureLabel(feature)}
                              role="button"
                              tabIndex={0}
                              style={{ cursor: 'pointer' }}
                              styles={featureStyles}
                              onClick={(event) => onFeatureClick(feature, context, event)}
                              onKeyDown={(event) => onFeatureKeyDown(feature, context, event)}
                            />
                          ))
                        }
                      </MapFeatures>
                      <MapMesh pointerEvents="none" />
                    </MapZoom>
                  </>
                )
              }
            </Map>
          </div>
        </div>
      )
    : null
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
    ?? feature.properties?.admin
    ?? feature.properties?.NAME
    ?? feature.id
    ?? 'Country',
  )
}

function escapeAttributeValue(value: string): string {
  return value.replaceAll('\\', '\\\\').replaceAll('"', '\\"')
}

function focusFeatureElement(element: SVGPathElement | null | undefined): void {
  if (!element) return

  try {
    element.focus({ preventScroll: true })
  } catch {
    element.focus()
  }
}

interface ProgrammaticZoomControlsProps {
  zoom: number
  onZoomIn: () => void
  onZoomOut: () => void
  onResetView: () => void
  onZoomToRandomCountry: (feature: D3MapFeature, index: number, context: MapContext) => void
}

function ProgrammaticZoomControls({
  zoom,
  onZoomIn,
  onZoomOut,
  onResetView,
  onZoomToRandomCountry,
}: ProgrammaticZoomControlsProps): JSX.Element | null {
  const context = useMapContext()

  if (!context) return null

  return (
    <foreignObject
      x={12}
      y={12}
      width={context.width - 24}
      height={36}
    >
      <div
        xmlns="http://www.w3.org/1999/xhtml"
        className="flex flex-wrap items-center gap-2"
      >
        <button
          type="button"
          className="rounded border bg-white/90 px-3 py-1 text-sm"
          onClick={onZoomOut}
        >
          -
        </button>
        <span className="text-sm text-[var(--vp-c-text-2)]">
          {zoom.toFixed(1)}
          x
        </span>
        <button
          type="button"
          className="rounded border bg-white/90 px-3 py-1 text-sm"
          onClick={onZoomIn}
        >
          +
        </button>
        <button
          type="button"
          className="rounded border bg-white/90 px-3 py-1 text-sm"
          disabled={!context.features.length}
          onClick={() => {
            const randomIndex = Math.floor(Math.random() * context.features.length)
            const feature = context.features[randomIndex]
            if (!feature) return
            onZoomToRandomCountry(feature, randomIndex, context)
          }}
        >
          Random
        </button>
        <button
          type="button"
          className="rounded border bg-white/90 px-3 py-1 text-sm"
          onClick={onResetView}
        >
          Reset
        </button>
      </div>
    </foreignObject>
  )
}
