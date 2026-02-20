import type {
  FeatureCollection,
  Polygon,
} from 'geojson'
import type { Topology } from 'topojson-specification'

export const sampleGeoJson: FeatureCollection<Polygon> = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      id: 'demo',
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
