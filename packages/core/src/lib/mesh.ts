import type { Topology } from 'topojson-specification'

import type { MapContext } from './map'
import type { MapObjectProps } from './object'

import { mesh } from 'topojson-client'

import { isTopology } from './data'

export interface MapMeshProps<TStyle = unknown>
  extends MapObjectProps<TStyle> {
  data?: Topology
  objectKey?: string
}

/**
 * Renders a TopoJSON mesh path when topology data is provided.
 */
export function renderMesh(
  context: MapContext,
  data?: Topology,
  objectKey?: string,
): string | null {
  if (!data || !isTopology(data)) return null

  const resolvedObjectKey = objectKey ?? Object.keys(data.objects)[0]
  const topoObject = resolvedObjectKey == null
    ? undefined
    : data.objects[resolvedObjectKey] as Parameters<typeof mesh>[1]

  return context.path(mesh(data, topoObject))
}
