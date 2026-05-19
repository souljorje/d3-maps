import type { MapDataSource } from './data'
import type { MapDataObjectProps } from './mapObject'

import { mesh } from 'topojson-client'

import { isTopology } from './data'

export type MapMeshData = ReturnType<typeof mesh>

export interface MapMeshProps<TStyle = unknown>
  extends MapDataObjectProps<TStyle> {}

/**
 * Returns a TopoJSON mesh when topology data is provided.
 */
export function makeMesh(
  data?: MapDataSource,
  objectKey?: string,
): MapMeshData | undefined {
  if (!data || !isTopology(data)) return undefined

  const resolvedObjectKey = objectKey ?? Object.keys(data.objects)[0]
  const topoObject = resolvedObjectKey == null
    ? undefined
    : data.objects[resolvedObjectKey] as Parameters<typeof mesh>[1]

  return mesh(data, topoObject) as MapMeshData
}
