import type {
  MapDataItem,
  MapFeatureData,
} from '@d3-maps/core'

type GeoJsonMapData = Exclude<MapDataItem, { type: 'Topology' }>
type TopologyMapData = Extract<MapDataItem, { type: 'Topology' }>

const sampleFeature: MapFeatureData = {
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
    } satisfies MapFeatureData,
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

export const sampleTopologyTwoObjects: TopologyMapData = {
  type: 'Topology',
  transform: { scale: [1, 1], translate: [0, 0] },
  objects: {
    single: {
      type: 'Polygon',
      arcs: [[0]],
      properties: { id: 'single' },
    },
    pair: {
      type: 'GeometryCollection',
      geometries: [
        {
          type: 'Polygon',
          arcs: [[0]],
          properties: { id: 'pair-1' },
        },
        {
          type: 'Polygon',
          arcs: [[1]],
          properties: { id: 'pair-2' },
        },
      ],
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
    [
      [20, 20],
      [10, 0],
      [0, 10],
      [-10, 0],
      [0, -10],
    ],
  ],
}
