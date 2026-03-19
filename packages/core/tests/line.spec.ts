import { describe, expect, it } from 'vitest'

import { getLinePath } from '../src'
import { makeTestMapContext } from './fixtures'

const LINE_COORDINATES: [number, number][] = [
  [-122.4194, 37.7749],
  [-73.935242, 40.73061],
]
describe('getLinePath', () => {
  it('returns undefined when map context is missing', () => {
    expect(getLinePath(undefined, LINE_COORDINATES)).toBeUndefined()
  })

  it('returns undefined when less than two coordinates are provided', () => {
    const context = makeTestMapContext()

    expect(getLinePath(context, [LINE_COORDINATES[0]])).toBeUndefined()
  })

  it('renders a geographic LineString path', () => {
    const context = makeTestMapContext()

    const path = getLinePath(context, LINE_COORDINATES)
    const expectedPath = context.path({
      type: 'LineString',
      coordinates: LINE_COORDINATES,
    })

    expect(path).toBe(expectedPath)
  })
})
