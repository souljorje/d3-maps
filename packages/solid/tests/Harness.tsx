import type { JSX } from '@solidjs/web'

import type { MapContext, MapData, MapFeatureRendered, MapZoomHandle } from '../src'

import { sampleGeoJsonTwoFeatures, sampleTopology } from '../../../tests/fixtures/mapData'
import {
  MapAnnotation,
  MapBase,
  MapElement,
  MapFeatures,
  MapGraticule,
  MapLine,
  MapMarker,
  MapMesh,
  MapSphere,
  MapZoom,
} from '../src'

export interface HarnessProps {
  width?: number
  data?: MapData
  context?: MapContext
  maxZoom?: number
  noClip?: boolean
  onReady?: (zoom: MapZoomHandle) => void
  onFeaturesChange?: (features: MapFeatureRendered[]) => void
  onMouseEnter?: (event: MouseEvent) => void
}

export function Harness(props: HarnessProps): JSX.Element {
  return (
    <MapBase width={props.width ?? 600} context={props.context} fit={props.data ?? sampleGeoJsonTwoFeatures} padding={10} aria-label="Test map" class="custom-map">
      <MapSphere noClip={props.noClip} fill="white" stroke="black">
        <MapZoom maxZoom={props.maxZoom ?? 8} onReady={props.onReady}>
          <MapFeatures data={props.data ?? sampleGeoJsonTwoFeatures} onFeaturesChange={props.onFeaturesChange} styles={{ default: { fill: 'gray' } }} />
          <MapGraticule />
          <MapMesh data={sampleTopology} objectKey="demo" />
          <MapMarker coordinates={[5, 5]}><circle r={3} /></MapMarker>
          <MapLine coordinates={[[0, 0], [10, 10]]} />
          <MapAnnotation coordinates={[5, 5]} length={40} angle={45} margin={4}><text>Anchor</text></MapAnnotation>
          <MapElement
            data-testid="interactive"
            d="M0,0L1,1"
            tabindex={0}
            style={{ fill: 'orange', opacity: 0.95 }}
            styles={{ default: { opacity: 0.9 }, hover: { opacity: 0.8 }, active: { opacity: 0.7 }, focus: { opacity: 0.6 } }}
            onMouseEnter={props.onMouseEnter}
          />
        </MapZoom>
      </MapSphere>
      <MapSphere noClip />
    </MapBase>
  )
}
