import { describe, expect, it } from 'vitest'

import { applyModifiers } from '../src'

interface Call { name: string, args: unknown[] }

function createRecorder() {
  const calls: Call[] = []
  const record = (name: string, ...args: unknown[]) => {
    calls.push({ name, args })
  }
  return { calls, record }
}

describe('applyModifiers', () => {
  it('normalizes single scalar arg', () => {
    const { calls, record } = createRecorder()
    const target = {
      setX(x: number) {
        record('setX', x)
      },
    }

    applyModifiers(target, { setX: 1 })
    applyModifiers(target, { setX: [2] })

    expect(calls).toEqual([
      { name: 'setX', args: [1] },
      { name: 'setX', args: [2] },
    ])
  })

  it('spreads multi-arg tuple', () => {
    const { calls, record } = createRecorder()
    const target = {
      setPair(x: number, y: string) {
        record('setPair', x, y)
      },
    }

    applyModifiers(target, { setPair: [1, 'a'] })

    expect(calls).toEqual([{ name: 'setPair', args: [1, 'a'] }])
  })

  it('passes single array arg as a single argument (wrapper required)', () => {
    const { calls, record } = createRecorder()
    const target = {
      setList(xs: string[]) {
        record('setList', xs)
      },
    }

    applyModifiers(target, { setList: [['a', 'b']] })

    expect(calls).toEqual([{ name: 'setList', args: [['a', 'b']] }])
  })
})
