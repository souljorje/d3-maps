import type {
  FeatureCollection,
  Polygon,
} from 'geojson'

export const sampleGeoJson: FeatureCollection<Polygon> = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      id: 'demo-1',
      properties: { id: 'demo-1' },
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

export const sampleGeoJsonTwoFeatures: FeatureCollection<Polygon> = {
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
    },
  ],
}
