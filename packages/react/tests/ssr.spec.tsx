import { describe, expect, it } from 'vitest'

import { renderToString } from 'react-dom/server'

import {
  Map,
  MapAnnotation,
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
          <MapAnnotation coordinates={[2.3522, 48.8566]}>
            <text>Paris</text>
          </MapAnnotation>
        </MapZoom>
      </Map>,
    )

    expect(html).toContain('<svg')
    expect(html).toContain('d3-map-zoom')
    expect(html).toContain('name="annotation"')
  })
})
