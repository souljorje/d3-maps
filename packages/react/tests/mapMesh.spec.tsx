import { describe, expect, it } from 'vitest'

import {
  Map,
  MapMesh,
} from '../src'
import {
  sampleGeoJson,
  sampleTopology,
} from './fixtures'
import { render } from './testUtils'

describe('mapMesh', () => {
  it('renders mesh for topology data with default fill', () => {
    const { container, unmount } = render(
      <Map data={sampleTopology}>
        <MapMesh stroke="#000" />
      </Map>,
    )

    const mesh = container.querySelector('path')
    expect(mesh).not.toBeNull()
    expect(mesh?.getAttribute('fill')).toBe('none')
    unmount()
  })

  it('does not render mesh for geojson data', () => {
    const { container, unmount } = render(
      <Map data={sampleGeoJson}>
        <MapMesh />
      </Map>,
    )

    expect(container.querySelector('path')).toBeNull()
    unmount()
  })
})
