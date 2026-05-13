import { describe, expect, it, vi } from 'vitest'

import {
  act,
  fireEvent,
  render,
  screen,
} from '@testing-library/react'
import {
  memo,
  useState,
} from 'react'

import {
  MapBase,
  MapFeature,
  MapZoom,
} from '../src'
import { useMapObject } from '../src/hooks/useMapObject'
import { sampleGeoJson } from './fixtures'

vi.mock('@d3-maps/core', async () => {
  const actual = await vi.importActual<typeof import('@d3-maps/core')>('@d3-maps/core')

  return {
    ...actual,
    applyZoom: () => {},
    createZoomBehavior: () => ({}),
    setupZoom: () => {},
  }
})

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
      <MapBase data={sampleGeoJson}>
        <MapZoom>
          <MapFeature
            data-testid="map-feature"
            data={sampleGeoJson.features[0]}
            styles={{
              default: { opacity: 0.9 },
              active: { opacity: 0.7 },
            }}
          />
        </MapZoom>
      </MapBase>,
    )

    const path = screen.getByTestId('map-feature')
    expect(path?.style.opacity).toBe('0.9')

    fireEvent.mouseDown(path)
    expect(path?.style.opacity).toBe('0.7')

    fireEvent.mouseUp(window)
    expect(path?.style.opacity).toBe('0.9')
  })

  it('does not rerender map object hook consumers when only zoom state changes', () => {
    const renderSpy = vi.fn()
    let setZoom: ((zoom: number) => void) | undefined

    const Probe = memo(() => {
      renderSpy()
      useMapObject<SVGGElement>({})
      return <g data-testid="map-object-probe" />
    })

    function Harness() {
      const [zoom, updateZoom] = useState(1)
      setZoom = updateZoom

      return (
        <MapBase data={sampleGeoJson}>
          <MapZoom zoom={zoom}>
            <Probe />
          </MapZoom>
        </MapBase>
      )
    }

    render(<Harness />)

    expect(renderSpy).toHaveBeenCalledTimes(1)

    act(() => {
      setZoom?.(2)
    })

    expect(renderSpy).toHaveBeenCalledTimes(1)
  })
})
