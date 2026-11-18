import type { JSX } from '@solidjs/web'

import type { MapFeatureProps } from '../types'

import { MapElement } from './MapElement'

export function MapFeature(props: MapFeatureProps): JSX.Element {
  return <MapElement data-d3m="feature" {...props} />
}
