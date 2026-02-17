import type { FeatureCollection, Polygon } from 'geojson'
import type { Topology } from 'topojson-specification'

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

export const sampleTopology: Topology = {
  type: 'Topology',
  transform: { scale: [1, 1], translate: [0, 0] },
  objects: {
    demo: {
      type: 'Polygon',
      arcs: [[0]],
      properties: { id: 'demo' },
    },
  },
  arcs: [
    [
      [0, 0],
      [10, 0],
      [0, 10],
      [-10, 0],
      [0, -10],
    ],
  ],
}
