import { describe, expect, it, vi } from 'vitest'

import { act } from 'react'

import {
  Map,
  MapFeature,
} from '../src'
import { sampleGeoJson } from './fixtures'
import { render } from './testUtils'

describe('mapFeature', () => {
  it('does not render without map context', () => {
    const { container, unmount } = render(
      <svg>
        <MapFeature data={sampleGeoJson.features[0]} />
      </svg>,
    )

    expect(container.querySelector('path')).toBeNull()
    unmount()
  })

  it('resolves styles across interaction states', () => {
    const onMouseUp = vi.fn()

    const { container, unmount } = render(
      <Map data={sampleGeoJson}>
        <MapFeature
          data={sampleGeoJson.features[0]}
          styles={{
            default: { opacity: 0.9 },
            hover: { opacity: 0.8 },
            active: { opacity: 0.7 },
          }}
          onMouseUp={onMouseUp}
        />
      </Map>,
    )

    const path = container.querySelector('path')
    expect(path?.style.opacity).toBe('0.9')

    act(() => {
      path?.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }))
    })
    expect(path?.style.opacity).toBe('0.8')

    act(() => {
      path?.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))
    })
    expect(path?.style.opacity).toBe('0.7')

    act(() => {
      path?.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }))
    })
    expect(path?.style.opacity).toBe('0.8')
    expect(onMouseUp).toHaveBeenCalledTimes(1)

    unmount()
  })
})
