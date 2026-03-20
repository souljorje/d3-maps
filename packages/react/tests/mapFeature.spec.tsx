import { describe, expect, it, vi } from 'vitest'

import {
  fireEvent,
  render,
  screen,
} from '@testing-library/react'

import {
  MapBase,
  MapFeature,
} from '../src'
import { InsideZoomContext } from '../src/hooks/useInsideZoom'
import { sampleGeoJson } from './fixtures'

describe('mapFeature', () => {
  it('throws without map context', () => {
    expect(() => render(
      <svg>
        <MapFeature data={sampleGeoJson.features[0]} />
      </svg>,
    )).toThrowError('useMapContext must be used inside Map')
  })

  it('resolves styles across interaction states', () => {
    const onMouseUp = vi.fn()

    render(
      <MapBase data={sampleGeoJson}>
        <MapFeature
          data-testid="map-feature"
          data={sampleGeoJson.features[0]}
          tabIndex={0}
          styles={{
            default: { opacity: 0.9 },
            focus: { opacity: 0.85 },
            hover: { opacity: 0.8 },
            active: { opacity: 0.7 },
          }}
          onMouseUp={onMouseUp}
        />
      </MapBase>,
    )

    const path = screen.getByTestId('map-feature')
    expect(path?.style.opacity).toBe('0.9')

    fireEvent.focus(path)
    expect(path?.style.opacity).toBe('0.85')

    fireEvent.mouseOver(path)
    expect(path?.style.opacity).toBe('0.85')

    fireEvent.mouseDown(path)
    expect(path?.style.opacity).toBe('0.7')

    fireEvent.mouseUp(path)
    expect(path?.style.opacity).toBe('0.85')
    expect(onMouseUp).toHaveBeenCalledTimes(1)

    fireEvent.mouseOut(path)
    expect(path?.style.opacity).toBe('0.85')

    fireEvent.blur(path)
    expect(path?.style.opacity).toBe('0.9')
  })

  it('resets active state on global mouseup when element mouseup is missed', () => {
    render(
      <InsideZoomContext.Provider value={true}>
        <MapBase data={sampleGeoJson}>
          <MapFeature
            data-testid="map-feature"
            data={sampleGeoJson.features[0]}
            styles={{
              default: { opacity: 0.9 },
              active: { opacity: 0.7 },
            }}
          />
        </MapBase>
      </InsideZoomContext.Provider>,
    )

    const path = screen.getByTestId('map-feature')
    expect(path?.style.opacity).toBe('0.9')

    fireEvent.mouseDown(path)
    expect(path?.style.opacity).toBe('0.7')

    fireEvent.mouseUp(window)
    expect(path?.style.opacity).toBe('0.9')
  })
})
