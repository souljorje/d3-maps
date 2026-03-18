import type {
  MapFeature as D3MapFeature,
  MapContext,
  MapData,
  ZoomEvent,
} from '@d3-maps/core'
import type { JSX } from 'react'

import {
  getFeatureKey,
  makeMapContext,
} from '@d3-maps/core'
import {
  Map,
  MapFeature,
  MapFeatures,
  MapGraticule,
  MapMesh,
  MapZoom,
} from '@d3-maps/react'
import {
  useEffect,
  useMemo,
  useState,
} from 'react'
import { withBase } from 'vitepress'

const initialZoom = 1
const minZoom = 1
const maxZoom = 8
const zoomStep = 0.5

export default function ProgrammaticZoomExample(): JSX.Element | null {
  const [mapData, setMapData] = useState<MapData>()
  const [center, setCenter] = useState<[number, number]>()
  const [focusPoint, setFocusPoint] = useState<[number, number]>()
  const [zoom, setZoom] = useState(initialZoom)
  const [activeCountryLabel, setActiveCountryLabel] = useState('World')

  const mapContext = useMemo(() => {
    return mapData
      ? makeMapContext({
          data: mapData,
        })
      : undefined
  }, [mapData])

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
    setView(zoom + zoomStep)
  }

  function zoomOut(): void {
    setView(zoom - zoomStep)
  }

  function resetView(): void {
    setCenter(undefined)
    setFocusPoint(undefined)
    setView(initialZoom)
    setActiveCountryLabel('World')
  }

  function setView(nextZoom: number): void {
    const fittedZoom = clampZoom(nextZoom)

    if (focusPoint && mapContext) {
      setCenter(getCenterForFocusPoint(focusPoint, fittedZoom, mapContext))
    } else {
      setCenter(undefined)
    }

    setZoom(fittedZoom)
  }

  function zoomToRandomCountry(): void {
    if (!mapContext?.features.length || !mapContext) return

    const randomIndex = Math.floor(Math.random() * mapContext.features.length)
    const feature = mapContext.features[randomIndex]

    if (!feature) return

    zoomToFeature(feature, mapContext)
  }

  function zoomToFeature(feature: D3MapFeature, context: MapContext): void {
    const { path, width, height } = context
    const [[x0, y0], [x1, y1]] = path.bounds(feature)
    const boundsWidth = x1 - x0
    const boundsHeight = y1 - y0

    if (!Number.isFinite(boundsWidth) || !Number.isFinite(boundsHeight) || boundsWidth <= 0 || boundsHeight <= 0) {
      return
    }

    const nextFocusPoint: [number, number] = [
      (x0 + x1) / 2,
      (y0 + y1) / 2,
    ]
    const fittedZoom = clampZoom(0.9 / Math.max(boundsWidth / width, boundsHeight / height))
    setFocusPoint(nextFocusPoint)
    setCenter(getCenterForFocusPoint(nextFocusPoint, fittedZoom, context))
    setZoom(fittedZoom)
    setActiveCountryLabel(getFeatureLabel(feature))
  }

  function syncViewport(event: ZoomEvent, context: MapContext): void {
    setCenter([event.transform.x, event.transform.y])
    setFocusPoint(event.transform.invert([
      context.width / 2,
      context.height / 2,
    ]) as [number, number])
    setZoom(event.transform.k)
  }

  return mapData
    ? (
        <div className="grid gap-3">
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
            >
              {
                (context) => (
                  <MapZoom
                    center={center}
                    zoom={zoom}
                    minZoom={minZoom}
                    maxZoom={maxZoom}
                    config={{ filter: isDragOnlyFilter }}
                    onZoomEnd={(event) => syncViewport(event, context)}
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
                            style={{ cursor: 'pointer' }}
                            onClick={() => zoomToFeature(feature, context)}
                          />
                        ))
                      }
                    </MapFeatures>
                    <MapMesh pointerEvents="none" />
                  </MapZoom>
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

function getCenterForFocusPoint(
  value: [number, number],
  nextZoom: number,
  context: MapContext,
): [number, number] {
  const { width, height } = context

  return clampCenter([
    (width / 2) - (nextZoom * value[0]),
    (height / 2) - (nextZoom * value[1]),
  ], nextZoom, context)
}

function clampCenter(
  value: [number, number],
  nextZoom: number,
  context: MapContext,
): [number, number] {
  const { width, height } = context

  return [
    clamp(value[0], width * (1 - nextZoom), 0),
    clamp(value[1], height * (1 - nextZoom), 0),
  ]
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
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
