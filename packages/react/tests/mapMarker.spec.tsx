import { describe, expect, it } from 'vitest'

import {
  Map,
  MapMarker,
} from '../src'
import { sampleGeoJson } from './fixtures'
import { render } from './testUtils'

describe('mapMarker', () => {
  it('uses projection transform from context', () => {
    const { container, unmount } = render(
      <Map
        data={sampleGeoJson}
        width={400}
        height={300}
      >
        <MapMarker coordinates={[10, 10]} />
      </Map>,
    )

    const marker = container.querySelector('.d3-map g')
    expect(marker?.getAttribute('transform')).toMatch(/^translate\(/)
    unmount()
  })

  it('uses fallback transform without map context', () => {
    const { container, unmount } = render(
      <svg>
        <MapMarker coordinates={[10, 10]} />
      </svg>,
    )

    expect(container.querySelector('g')?.getAttribute('transform')).toBe('translate(0, 0)')
    unmount()
  })
})
