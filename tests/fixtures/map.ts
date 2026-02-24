import type {
  MapData,
  MapFeature,
} from '@d3-maps/core'

type GeoJsonMapData = Exclude<MapData, { type: 'Topology' }>
type TopologyMapData = Extract<MapData, { type: 'Topology' }>

const sampleFeature: MapFeature = {
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
}

export const sampleGeoJson: GeoJsonMapData = {
  type: 'FeatureCollection',
  features: [sampleFeature],
}

export const sampleGeoJsonTwoFeatures: GeoJsonMapData = {
  type: 'FeatureCollection',
  features: [
    ...sampleGeoJson.features,
    {
      type: 'Feature',
      id: 'demo-2',
      properties: { id: 'demo-2' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [20, 20],
            [20, 30],
            [30, 30],
            [30, 20],
            [20, 20],
          ],
        ],
      },
    } satisfies MapFeature,
  ],
}

export const sampleTopology: TopologyMapData = {
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
