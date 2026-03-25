import { describe, expect, it, vi } from 'vitest'

import type { ZoomTransform } from '@d3-maps/core'

import {
  render,
  screen,
} from '@testing-library/react'

import { MapBase } from '../src/components/MapBase'
import { MapZoom } from '../src/components/MapZoom'
import { useMapZoom } from '../src/hooks/useMapZoom'
import { sampleGeoJson } from './fixtures'

const setupZoomSpy = vi.fn()
const applyZoomSpy = vi.fn()
let zoomBehaviorOptions: any

vi.mock('@d3-maps/core', async () => {
  const actual = await vi.importActual<typeof import('@d3-maps/core')>('@d3-maps/core')

  return {
    ...actual,
    setupZoom: (...args: Parameters<typeof actual.setupZoom>) => {
      setupZoomSpy(...args)
      const transform = createTransform(args[0].center, args[0].zoom)
      zoomBehaviorOptions?.onZoomStart?.({ transform })
      zoomBehaviorOptions?.onZoom?.({ transform })
      zoomBehaviorOptions?.onZoomEnd?.({ transform })
    },
    applyZoom: (...args: Parameters<typeof actual.applyZoom>) => {
      applyZoomSpy(...args)
    },
    createZoomBehavior: (
      _context: Parameters<typeof actual.createZoomBehavior>[0],
      options: Parameters<typeof actual.createZoomBehavior>[1],
    ) => {
      zoomBehaviorOptions = options
      return {} as any
    },
  }
})

describe('mapZoom', () => {
  it('returns undefined outside MapZoom', () => {
    function Probe() {
      return <text data-testid="zoom-value">{String(useMapZoom())}</text>
    }

    render(
      <MapBase data={sampleGeoJson}>
        <Probe />
      </MapBase>,
    )

    expect(screen.getByTestId('zoom-value').textContent).toBe('undefined')
  })

  it('wires zoom setup and transform updates', () => {
    const onZoomStart = vi.fn()
    const onZoom = vi.fn()
    const onZoomEnd = vi.fn()
    const config = { scaleExtent: [[1, 6]] as [[number, number]] }
    const transition = { duration: 250 }

    const { rerender } = render(
      <MapBase data={sampleGeoJson}>
        <MapZoom
          data-testid="map-zoom-group"
          center={[11, 12]}
          zoom={2}
          minZoom={1}
          maxZoom={6}
          transition={transition}
          config={config}
          onZoomStart={onZoomStart}
          onZoom={onZoom}
          onZoomEnd={onZoomEnd}
        >
          <g data-testid="zoom-content" />
        </MapZoom>
      </MapBase>,
    )

    expect(setupZoomSpy).toHaveBeenCalled()
    expect(setupZoomSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        center: [11, 12],
        transition,
        zoom: 2,
      }),
    )
    expect(applyZoomSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        center: [11, 12],
        transition,
        zoom: 2,
      }),
    )
    expect(onZoomStart).toHaveBeenCalled()
    expect(onZoom).toHaveBeenCalled()
    expect(onZoomEnd).toHaveBeenCalled()
    expect(zoomBehaviorOptions?.config).toEqual({ scaleExtent: [[1, 6]] })

    const zoomGroup = screen.getByTestId('map-zoom-group')
    expect(zoomGroup?.getAttribute('transform')).toContain('translate')

    rerender(
      <MapBase data={sampleGeoJson}>
        <MapZoom
          data-testid="map-zoom-group"
          center={[99, 100]}
          zoom={3}
          minZoom={1}
          maxZoom={6}
          transition={transition}
          config={config}
          onZoomStart={onZoomStart}
          onZoom={onZoom}
          onZoomEnd={onZoomEnd}
        >
          <g data-testid="zoom-content" />
        </MapZoom>
      </MapBase>,
    )

    expect(applyZoomSpy).toHaveBeenLastCalledWith(
      expect.objectContaining({
        center: [99, 100],
        transition,
        zoom: 3,
      }),
    )
  })

  it('exposes live zoom state', () => {
    let zoomApi: ReturnType<typeof useMapZoom> | undefined
    const onZoomToObject = vi.fn()

    function Probe() {
      zoomApi = useMapZoom()
      return (
        <text data-testid="zoom-value">
          {`${zoomApi?.zoom ?? 'none'}:${zoomApi?.center?.[0] ?? 'none'}`}
        </text>
      )
    }

    const { rerender } = render(
      <MapBase data={sampleGeoJson}>
        <MapZoom center={[20, 30]} zoom={2}>
          <Probe />
        </MapZoom>
      </MapBase>,
    )

    expect(screen.getByTestId('zoom-value').textContent).toBe('2:20')
    expect(zoomApi).toMatchObject({
      maxZoom: 8,
      minZoom: 1,
      zoom: 2,
    })

    zoomApi?.zoomToObject(sampleGeoJson.features[0], onZoomToObject)

    expect(onZoomToObject).toHaveBeenCalledWith(expect.objectContaining({
      center: expect.any(Array),
      zoom: expect.any(Number),
    }))

    rerender(
      <MapBase data={sampleGeoJson}>
        <MapZoom center={[40, 50]} zoom={3}>
          <Probe />
        </MapZoom>
      </MapBase>,
    )

    expect(screen.getByTestId('zoom-value').textContent).toBe('3:40')
  })
})

function createTransform(
  center: [number, number] | undefined,
  zoom: number | undefined,
): ZoomTransform {
  const resolvedCenter = center ?? [300, 150]
  const resolvedZoom = zoom ?? 1

  return {
    k: resolvedZoom,
    x: 0,
    y: 0,
    invert: () => resolvedCenter,
    toString: () => `translate(0,0) scale(${resolvedZoom})`,
  } as unknown as ZoomTransform
}
