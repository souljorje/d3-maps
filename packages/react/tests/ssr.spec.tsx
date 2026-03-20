import { describe, expect, it } from 'vitest'

import { renderToString } from 'react-dom/server'

import {
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
        </MapZoom>
      </MapBase>,
    )

    expect(html).toContain('<svg')
    expect(html).toContain('d3-map-zoom')
  })
})
