import {
  describe,
  expect,
  it,
} from 'vitest'

import { renderSphere } from '../src'
import { makeTestMapContext } from './fixtures'

describe('sphere', () => {
  it('renders sphere outline path', () => {
    const context = makeTestMapContext()
    const path = renderSphere(context)
    expect(path).toBeTruthy()
  })
})
