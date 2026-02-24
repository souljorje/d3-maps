import { describe, expect, it } from 'vitest'

import {
  render,
  screen,
} from '@testing-library/react'

import {
  Map,
  MapMesh,
} from '../src'
import {
  sampleGeoJson,
  sampleTopology,
} from './fixtures'

describe('mapMesh', () => {
  it('renders mesh for topology data with default fill', () => {
    render(
      <Map data={sampleTopology}>
        <MapMesh
          data-testid="map-mesh"
          stroke="#000"
        />
      </Map>,
    )

    const mesh = screen.getByTestId('map-mesh')
    expect(mesh?.getAttribute('fill')).toBe('none')
  })

  it('does not render mesh for geojson data', () => {
    const { container } = render(
      <Map data={sampleGeoJson}>
        <MapMesh />
      </Map>,
    )

    expect(container.querySelector('path')).toBeNull()
  })
})
