import { describe, expect, it, vi } from 'vitest'

import { renderToString } from '@solidjs/web'

import { sampleGeoJsonTwoFeatures } from '../../../tests/fixtures/mapData'
import { MapBase, MapFeature, MapFeatures } from '../src'
import { Harness } from './Harness'

describe('solid server rendering', () => {
  it('renders static SVG without DOM access or mounted behavior', () => {
    const onReady = vi.fn()
    const onFeaturesChange = vi.fn()
    expect(typeof window).toBe('undefined')
    const html = renderToString(() => <Harness onReady={onReady} onFeaturesChange={onFeaturesChange} />)
    expect(html).toContain('<svg')
    expect(html).toContain('viewBox="0 0 600 300"')
    expect(html).toContain('d3-map-zoom')
    expect(html).toContain('data-d3m="feature"')
    expect(html).toContain('data-d3m="annotation"')
    expect(html).toContain('clipPath')
    expect(html).toContain('opacity:0.9')
    expect(onReady).not.toHaveBeenCalled()
    expect(onFeaturesChange).not.toHaveBeenCalled()
  })

  it('renders generic feature customization on the server', () => {
    const html = renderToString(() => (
      <MapBase fit={sampleGeoJsonTwoFeatures}>
        <MapFeatures data={sampleGeoJsonTwoFeatures} transformer={(features) => features.map((feature) => ({ ...feature, score: 42 }))}>
          {({ features }) => features.map((feature) => <MapFeature d={feature.d} data-score={feature.score} />)}
        </MapFeatures>
      </MapBase>
    ))
    expect(html.match(/data-score="42"/g)).toHaveLength(2)
    expect(html).not.toContain('undefined')
  })
})
