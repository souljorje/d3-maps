import { describe, expect, it } from 'vitest'

import {
  createSSRApp,
  h,
} from 'vue'
import { renderToString } from 'vue/server-renderer'

import {
  Map,
  MapAnnotation,
  MapFeatures,
  MapZoom,
} from '../src'
import { sampleGeoJson } from './fixtures'

// eslint-disable-next-line test/prefer-lowercase-title
describe('SSR', () => {
  it('renders map component tree without DOM access errors', async () => {
    const app = createSSRApp({
      render: () =>
        h(Map, { data: sampleGeoJson }, {
          default: () => h(MapZoom, null, {
            default: () => [
              h(MapFeatures),
              h(MapAnnotation, { coordinates: [2.3522, 48.8566] }, {
                default: () => h('text', 'Paris'),
              }),
            ],
          }),
        }),
    })
    const html = await renderToString(app)

    expect(html).toContain('<svg')
    expect(html).toContain('name="zoom"')
    expect(html).toContain('name="annotation"')
  })
})
