import { describe, expect, it, vi } from 'vitest'

import {
  fireEvent,
  render,
  screen,
} from '@testing-library/react'

import {
  MapBase,
  MapElement,
} from '../src'
import { MapZoomPresenceContextValue } from '../src/hooks/internal/mapZoomContext'
import { sampleGeoJson } from './fixtures'

describe('mapElement', () => {
  it('resolves styles across interaction states', () => {
    const onMouseUp = vi.fn()

    render(
      <MapBase fit={sampleGeoJson}>
        <MapElement
          data-testid="map-element"
          d="M0,0L10,0"
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

    const path = screen.getByTestId('map-element')
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

  it('merges inline and interaction styles', () => {
    render(
      <MapBase fit={sampleGeoJson}>
        <MapElement
          data-testid="map-element-style"
          d="M0,0L10,0"
          style={{
            fill: 'darkorange',
            opacity: 0.95,
          }}
          styles={{
            default: { opacity: 0.9 },
            hover: { opacity: 0.8 },
          }}
        />
      </MapBase>,
    )

    const path = screen.getByTestId('map-element-style')
    expect(path.style.fill).toBe('darkorange')
    expect(path.style.opacity).toBe('0.9')

    fireEvent.mouseOver(path)
    expect(path.style.fill).toBe('darkorange')
    expect(path.style.opacity).toBe('0.8')
  })

  it('resets active state on global mouseup when element mouseup is missed', () => {
    render(
      <MapZoomPresenceContextValue.Provider value>
        <MapBase fit={sampleGeoJson}>
          <MapElement
            data-testid="map-element"
            d="M0,0L10,0"
            styles={{
              default: { opacity: 0.9 },
              active: { opacity: 0.7 },
            }}
          />
        </MapBase>
      </MapZoomPresenceContextValue.Provider>,
    )

    const path = screen.getByTestId('map-element')
    expect(path?.style.opacity).toBe('0.9')

    fireEvent.mouseDown(path)
    expect(path?.style.opacity).toBe('0.7')

    fireEvent.mouseUp(window)
    expect(path?.style.opacity).toBe('0.9')
  })
})
