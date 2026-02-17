import type { FeatureCollection, Polygon } from 'geojson'
import { makeMapContext } from '../src'

export const sampleGeoJson: FeatureCollection<Polygon> = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: { id: 'demo' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [0, 0],
            [0, 10],
            [10, 10],
            [10, 0],
            [0, 0],
          ],
        ],
      },
    },
  ],
}

export function makeTestMapContext(): ReturnType<typeof makeMapContext> {
  return makeMapContext({
    width: 400,
    height: 300,
    data: sampleGeoJson,
  })
}
