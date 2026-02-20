import { describe, expect, it, vi } from 'vitest'

import { Map } from '../src/components/Map'
import { MapZoom } from '../src/components/MapZoom'
import { sampleGeoJson } from './fixtures'
import { render } from './testUtils'

const setupZoomSpy = vi.fn()
const applyZoomTransformSpy = vi.fn()
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
    applyZoomTransform: (...args: Parameters<typeof actual.applyZoomTransform>) => {
      applyZoomTransformSpy(...args)
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

    const { container, unmount } = render(
      <Map data={sampleGeoJson}>
        <MapZoom
          center={[11, 12]}
          zoom={2}
          minZoom={1}
          maxZoom={6}
          onZoomStart={onZoomStart}
          onZoom={onZoom}
          onZoomEnd={onZoomEnd}
        >
          <g data-testid="zoom-content" />
        </MapZoom>
      </Map>,
    )

    expect(setupZoomSpy).toHaveBeenCalled()
    expect(applyZoomTransformSpy).toHaveBeenCalled()
    expect(onZoomStart).toHaveBeenCalled()
    expect(onZoom).toHaveBeenCalled()
    expect(onZoomEnd).toHaveBeenCalled()

    const zoomGroup = container.querySelector('.d3-map-zoom')
    expect(zoomGroup?.getAttribute('transform')).toContain('translate')

    unmount()
  })
})
