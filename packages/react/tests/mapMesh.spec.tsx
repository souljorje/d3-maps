import { describe, expect, it } from 'vitest'

import {
  render,
  screen,
} from '@testing-library/react'

import {
  MapBase,
  MapMesh,
} from '../src'
import {
  sampleGeoJson,
  sampleTopology,
} from './fixtures'

describe('mapMesh', () => {
  it('renders mesh for topology data with default fill', () => {
    render(
      <MapBase data={sampleTopology}>
        <MapMesh
          data-testid="map-mesh"
          stroke="#000"
        />
      </MapBase>,
    )

    const mesh = screen.getByTestId('map-mesh')
    expect(mesh?.getAttribute('fill')).toBe('none')
  })

  it('renders mesh path without topology geometry', () => {
    const { container } = render(
      <MapBase data={sampleGeoJson}>
        <MapMesh />
      </MapBase>,
    )

    const path = container.querySelector('path')
    expect(path).toBeTruthy()
    expect(path?.getAttribute('d')).toBeNull()
  })
})
