import type { Topology } from 'topojson-specification'

import type { MapContext } from './map'

import { mesh } from 'topojson-client'

export interface MapMeshProps {
  data: Topology
  objectKey?: string
  filter?: Parameters<typeof mesh>[2]
}

/**
 * Renders a TopoJSON mesh path when topology data is provided.
 *
 * @see https://github.com/topojson/topojson-client#mesh
 */
export function renderMesh(
  context: MapContext,
  data: Topology,
  objectKey?: string,
  filter?: MapMeshProps['filter'],
): string | null {
  if (!objectKey) return context.path(mesh(data))
  if (!Object.hasOwn(data.objects, objectKey)) return null

  const topoObject = data.objects[objectKey] as Parameters<typeof mesh>[1]

  return context.path(mesh(data, topoObject, filter))
}
