import { describe, expect, it } from 'vitest'

import { renderToString } from 'react-dom/server'

import {
  MapAnnotation,
  MapBase,
  MapFeatures,
  MapZoom,
} from '../src'
import { sampleGeoJson } from './fixtures'

// eslint-disable-next-line test/prefer-lowercase-title
describe('SSR', () => {
  it('renders map component tree without DOM access errors', () => {
    const html = renderToString(
      <MapBase data={sampleGeoJson}>
        <MapZoom>
          <MapFeatures />
          <MapAnnotation coordinates={[2.3522, 48.8566]}>
            <text>Paris</text>
          </MapAnnotation>
        </MapZoom>
      </MapBase>,
    )

    expect(html).toContain('<svg')
    expect(html).toContain('d3-map-zoom')
    expect(html).toContain('name="annotation"')
  })
})
