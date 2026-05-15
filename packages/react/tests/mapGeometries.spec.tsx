import { describe, expect, it } from 'vitest'

import { render, screen } from '@testing-library/react'

import {
  MapBase,
  MapGeometries,
  MapObject,
} from '../src'
import {
  sampleGeometryCollection,
  samplePolygon,
} from './fixtures'

describe('mapGeometries', () => {
  it('renders normalized geometry objects by default', () => {
    const { container } = render(
      <MapBase data={sampleGeometryCollection}>
        <MapGeometries />
      </MapBase>,
    )

    expect(container.querySelectorAll('path')).toHaveLength(2)
  })

  it('supports render-prop children', () => {
    const { container } = render(
      <MapBase data={sampleGeometryCollection}>
        <MapGeometries>
          {({ geometries }) => (
            <g
              data-testid="map-geometries-group"
              data-count={String(geometries.length)}
            >
              {
                geometries.map(({ key, d }) => (
                  <MapObject
                    key={key}
                    d={d}
                  />
                ))
              }
            </g>
          )}
        </MapGeometries>
      </MapBase>,
    )

    expect(screen.getByTestId('map-geometries-group').getAttribute('data-count')).toBe('2')
    expect(container.querySelectorAll('path')).toHaveLength(2)
  })

  it('renders a single geometry object', () => {
    const { container } = render(
      <MapBase data={samplePolygon}>
        <MapGeometries />
      </MapBase>,
    )

    expect(container.querySelectorAll('path')).toHaveLength(1)
  })
})
