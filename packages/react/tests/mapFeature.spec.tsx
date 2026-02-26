import { describe, expect, it, vi } from 'vitest'

import {
  fireEvent,
  render,
  screen,
} from '@testing-library/react'

import {
  Map,
  MapFeature,
} from '../src'
import { sampleGeoJson } from './fixtures'

describe('mapFeature', () => {
  it('renders path without map context', () => {
    const { container } = render(
      <svg>
        <MapFeature data={sampleGeoJson.features[0]} />
      </svg>,
    )

    const path = container.querySelector('path')
    expect(path).toBeTruthy()
    expect(path?.getAttribute('d')).toBeNull()
  })

  it('resolves styles across interaction states', () => {
    const onMouseUp = vi.fn()

    render(
      <Map data={sampleGeoJson}>
        <MapFeature
          data-testid="map-feature"
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

    const path = screen.getByTestId('map-feature')
    expect(path?.style.opacity).toBe('0.9')

    fireEvent.mouseOver(path)
    expect(path?.style.opacity).toBe('0.8')

    fireEvent.mouseDown(path)
    expect(path?.style.opacity).toBe('0.7')

    fireEvent.mouseUp(path)
    expect(path?.style.opacity).toBe('0.8')
    expect(onMouseUp).toHaveBeenCalledTimes(1)
  })
})
