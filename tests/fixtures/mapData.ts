import type { MapData } from '@d3-maps/core'

type Topology = Extract<MapData, { type: 'Topology' }>

const sampleFeature: GeoJSON.Feature = {
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

export const sampleGeoJson: GeoJSON.FeatureCollection = {
  type: 'FeatureCollection',
  features: [sampleFeature],
}

export const sampleGeoJsonTwoFeatures: GeoJSON.FeatureCollection = {
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
    } satisfies GeoJSON.Feature,
  ],
}

export const samplePolygon: GeoJSON.Polygon = {
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
}

export const sampleGeometryCollection: GeoJSON.GeometryCollection = {
  type: 'GeometryCollection',
  geometries: [
    samplePolygon,
    {
      type: 'LineString',
      coordinates: [
        [0, 0],
        [10, 10],
      ],
    },
  ],
}

export const sampleGeometryCollectionFeature: GeoJSON.Feature = {
  type: 'Feature',
  id: 'geometry-collection-feature',
  properties: { id: 'geometry-collection-feature' },
  geometry: sampleGeometryCollection,
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

export const sampleTopologyTwoObjects: Topology = {
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

export const sampleTopologyObjectKey = 'pair' as const
