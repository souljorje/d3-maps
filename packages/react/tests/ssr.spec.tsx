import { describe, expect, it } from 'vitest'

import { renderToString } from 'react-dom/server'

import {
  Map,
  MapFeatures,
  MapZoom,
} from '../src'
import { sampleGeoJson } from './fixtures'

describe('sSR', () => {
  it('renders map component tree without DOM access errors', () => {
    const html = renderToString(
      <Map data={sampleGeoJson}>
        <MapZoom>
          <MapFeatures />
        </MapZoom>
      </Map>,
    )

    expect(html).toContain('<svg')
    expect(html).toContain('d3-map-zoom')
  })
})
