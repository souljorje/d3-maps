import { describe, expect, it } from 'vitest'

import {
  fireEvent,
  render,
  screen,
} from '@testing-library/react'

import {
  Map,
  MapFeature,
  MapFeatures,
} from '../src'
import { sampleGeoJson } from './fixtures'

describe('mapFeatures', () => {
  it('renders features by default', () => {
    const { container } = render(
      <Map data={sampleGeoJson}>
        <MapFeatures />
      </Map>,
    )

    expect(container.querySelectorAll('path').length).toBe(1)
  })

  it('supports render-prop children', () => {
    const { container } = render(
      <Map data={sampleGeoJson}>
        <MapFeatures>
          {({ features }) => (
            <g
              data-testid="map-features-group"
              data-count={String(features.length)}
            >
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

    expect(screen.getByTestId('map-features-group').getAttribute('data-count')).toBe('1')
    expect(container.querySelectorAll('path').length).toBe(1)
  })

  it('forwards styles to default-rendered features', () => {
    const { container } = render(
      <Map data={sampleGeoJson}>
        <MapFeatures
          styles={{
            default: { opacity: 0.9 },
            hover: { opacity: 0.7 },
          }}
        />
      </Map>,
    )

    const path = container.querySelector('path')
    expect(path?.style.opacity).toBe('0.9')

    fireEvent.mouseOver(path as Element)
    expect(path?.style.opacity).toBe('0.7')
  })

  it('accepts native svg attrs on features group', () => {
    const { container } = render(
      <Map data={sampleGeoJson}>
        <MapFeatures fill="darkorange" />
      </Map>,
    )

    expect(container.querySelector('g[name="features"]')?.getAttribute('fill')).toBe('darkorange')
  })
})
