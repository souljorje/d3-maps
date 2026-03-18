import { describe, expect, it, vi } from 'vitest'

import {
  render,
  screen,
} from '@testing-library/react'

import { Map } from '../src/components/Map'
import { MapZoom } from '../src/components/MapZoom'
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
      zoomBehaviorOptions?.onZoomStart?.({ transform: { toString: () => 'translate(1,2) scale(3)' } })
      zoomBehaviorOptions?.onZoom?.({ transform: { toString: () => 'translate(3,4) scale(5)' } })
      zoomBehaviorOptions?.onZoomEnd?.({ transform: { toString: () => 'translate(3,4) scale(5)' } })
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
  it('wires zoom setup and transform updates', () => {
    const onZoomStart = vi.fn()
    const onZoom = vi.fn()
    const onZoomEnd = vi.fn()
    const config = { scaleExtent: [[1, 6]] as [[number, number]] }

    const { rerender } = render(
      <Map data={sampleGeoJson}>
        <MapZoom
          data-testid="map-zoom-group"
          center={[11, 12]}
          zoom={2}
          minZoom={1}
          maxZoom={6}
          config={config}
          onZoomStart={onZoomStart}
          onZoom={onZoom}
          onZoomEnd={onZoomEnd}
        >
          <g data-testid="zoom-content" />
        </MapZoom>
      </Map>,
    )

    expect(setupZoomSpy).toHaveBeenCalled()
    expect(setupZoomSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        center: [11, 12],
        zoom: 2,
      }),
    )
    expect(applyZoomSpy).not.toHaveBeenCalled()
    expect(onZoomStart).toHaveBeenCalled()
    expect(onZoom).toHaveBeenCalled()
    expect(onZoomEnd).toHaveBeenCalled()
    expect(zoomBehaviorOptions?.config).toEqual({ scaleExtent: [[1, 6]] })

    const zoomGroup = screen.getByTestId('map-zoom-group')
    expect(zoomGroup?.getAttribute('transform')).toContain('translate')

    rerender(
      <Map data={sampleGeoJson}>
        <MapZoom
          data-testid="map-zoom-group"
          center={[99, 100]}
          zoom={3}
          minZoom={1}
          maxZoom={6}
          config={config}
          onZoomStart={onZoomStart}
          onZoom={onZoom}
          onZoomEnd={onZoomEnd}
        >
          <g data-testid="zoom-content" />
        </MapZoom>
      </Map>,
    )

    expect(applyZoomSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        center: [99, 100],
        zoom: 3,
      }),
    )
  })
})
