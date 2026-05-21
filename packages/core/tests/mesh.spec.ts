import {
  describe,
  expect,
  it,
} from 'vitest'

import { renderMesh } from '../src'
import {
  makeTestMapContext,
  sampleTopology,
  sampleTopologyObjectKey,
  sampleTopologyTwoObjects,
} from './fixtures'

describe('mesh', () => {
  const context = makeTestMapContext()

  it('returns null for empty input', () => {
    expect(renderMesh(context)).toBeNull()
  })

  it('renders a mesh path for topology input', () => {
    const path = renderMesh(context, sampleTopology)

    expect(path).toBeTruthy()
  })

  it('renders the requested topology object', () => {
    const defaultPath = renderMesh(context, sampleTopologyTwoObjects)
    const selectedPath = renderMesh(context, sampleTopologyTwoObjects, sampleTopologyObjectKey)

    expect(defaultPath).toBeTruthy()
    expect(selectedPath).toBeTruthy()
    expect(selectedPath).not.toBe(defaultPath)
  })
})
