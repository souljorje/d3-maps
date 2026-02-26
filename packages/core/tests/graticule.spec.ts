import {
  describe,
  expect,
  it,
} from 'vitest'

import {
  renderGraticule,
  renderOutline,
} from '../src'
import { makeTestMapContext } from './fixtures'

describe('graticule', () => {
  it('renders graticule path by default', () => {
    const context = makeTestMapContext()
    const path = renderGraticule(context)
    expect(path).toBeTruthy()
  })

  it('renders sphere outline path', () => {
    const context = makeTestMapContext()
    const path = renderOutline(context)
    expect(path).toBeTruthy()
  })

  it('applies step config to rendered lines', () => {
    const context = makeTestMapContext()
    const defaultPath = renderGraticule(context)
    const customPath = renderGraticule(context, {
      step: [[30, 30]],
    })

    expect(customPath).not.toBe(defaultPath)
  })

  it('applies precision config to rendered lines', () => {
    const context = makeTestMapContext()
    const coarsePath = renderGraticule(context, {
      precision: 10,
    })
    const precisePath = renderGraticule(context, {
      precision: 1,
    })

    expect(precisePath).not.toBe(coarsePath)
  })

  it('applies extent config to rendered lines', () => {
    const context = makeTestMapContext()
    const path = renderGraticule(context, {
      extent: [[[-90, -45], [90, 45]]],
    })

    expect(path).toBeTruthy()
  })
})
