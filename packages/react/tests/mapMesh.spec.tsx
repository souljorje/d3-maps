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
  sampleTopologyObjectKey,
  sampleTopologyTwoObjects,
} from './fixtures'

describe('mapMesh', () => {
  it('renders mesh for topology data with default fill', () => {
    render(
      <MapBase fit={sampleTopology}>
        <MapMesh
          data={sampleTopology}
          data-testid="map-mesh"
          stroke="#000"
        />
      </MapBase>,
    )

    const mesh = screen.getByTestId('map-mesh')
    expect(mesh?.getAttribute('fill')).toBe('none')
  })

  it('renders mesh path without topology data', () => {
    const { container } = render(
      <MapBase fit={sampleGeoJson}>
        <MapMesh />
      </MapBase>,
    )

    const path = container.querySelector('path')
    expect(path).toBeTruthy()
    expect(path?.getAttribute('d')).toBeNull()
  })

  it('supports topology overrides', () => {
    const { container } = render(
      <MapBase fit={sampleGeoJson}>
        <MapMesh
          data={sampleTopologyTwoObjects}
          objectKey={sampleTopologyObjectKey}
        />
      </MapBase>,
    )

    expect(container.querySelector('path')?.getAttribute('d')).toBeTruthy()
  })

  it('supports explicit objectKey overrides', () => {
    const { container } = render(
      <MapBase fit={sampleTopologyTwoObjects}>
        <MapMesh
          data={sampleTopologyTwoObjects}
          objectKey={sampleTopologyObjectKey}
        />
      </MapBase>,
    )

    expect(container.querySelector('path')?.getAttribute('d')).toBeTruthy()
  })
})
