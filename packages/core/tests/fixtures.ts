import { sampleGeoJson } from '~/tests/fixtures/map'

import { makeMapContext } from '../src'

export {
  sampleGeoJson,
  sampleTopology,
} from '~/tests/fixtures/map'

export function makeTestMapContext(): ReturnType<typeof makeMapContext> {
  return makeMapContext({
    width: 400,
    height: 300,
    data: sampleGeoJson,
  })
}
