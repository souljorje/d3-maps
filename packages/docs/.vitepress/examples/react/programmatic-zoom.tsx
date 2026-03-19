import type {
  MapFeature as D3MapFeature,
  MapContext,
  MapData,
} from '@d3-maps/core'
import type { JSX } from 'react'

import {
  getFeatureKey,
  getObjectZoomView,
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

  function zoomToRandomCountry(): void {
    if (!mapContext?.features.length || !mapContext) return

    const randomIndex = Math.floor(Math.random() * mapContext.features.length)
    const feature = mapContext.features[randomIndex]

    if (!feature) return

    zoomToFeature(feature, mapContext)
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
              projectionConfig={{
                rotate: [[-11, 0]],
              }}
            >
              {
                (context) => (
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
