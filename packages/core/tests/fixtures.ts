import { sampleGeoJson } from '~/tests/fixtures/mapData'

import { makeMapContext } from '../src'

export {
  sampleGeoJson,
  sampleGeoJsonTwoFeatures,
  sampleGeometryCollection,
  sampleGeometryCollectionFeature,
  samplePolygon,
  sampleTopology,
  sampleTopologyObjectKey,
  sampleTopologyTwoObjects,
} from '~/tests/fixtures/mapData'

export function makeTestMapContext(): ReturnType<typeof makeMapContext> {
  return makeMapContext({
    width: 400,
    height: 300,
    fit: sampleGeoJson,
  })
}
