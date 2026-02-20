import { describe, expect, it } from 'vitest'

import {
  Map,
  MapFeature,
  MapFeatures,
} from '../src'
import { sampleGeoJson } from './fixtures'
import { render } from './testUtils'

describe('mapFeatures', () => {
  it('renders features by default', () => {
    const { container, unmount } = render(
      <Map data={sampleGeoJson}>
        <MapFeatures />
      </Map>,
    )

    expect(container.querySelectorAll('path').length).toBe(1)
    unmount()
  })

  it('supports render-prop children', () => {
    const { container, unmount } = render(
      <Map data={sampleGeoJson}>
        <MapFeatures>
          {({ features }) => (
            <g data-count={String(features.length)}>
              {
                features.map((feature) => (
                  <MapFeature
                    key={String(feature.id)}
                    data={feature}
                  />
                ))
              }
            </g>
          )}
        </MapFeatures>
      </Map>,
    )

    expect(container.querySelector('[data-count]')?.getAttribute('data-count')).toBe('1')
    expect(container.querySelectorAll('path').length).toBe(1)
    unmount()
  })
})
