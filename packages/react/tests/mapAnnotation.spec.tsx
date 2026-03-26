import {
  describe,
  expect,
  it,
} from 'vitest'

import {
  render,
  screen,
} from '@testing-library/react'

import {
  MapAnnotation,
  MapBase,
} from '../src'
import { sampleGeoJson } from './fixtures'

function midpointCurve(context: {
  moveTo: (x: number, y: number) => void
  lineTo: (x: number, y: number) => void
}) {
  let pointIndex = 0

  return {
    lineStart() {
      pointIndex = 0
    },
    lineEnd() {},
    point(x: number, y: number) {
      if (pointIndex === 0) {
        context.moveTo(x, y)
      } else {
        context.lineTo(x, y + 1)
      }

      pointIndex += 1
    },
  }
}

describe('mapAnnotation', () => {
  it('renders connector and content inside map context', () => {
    const { container } = render(
      <MapBase data={sampleGeoJson}>
        <MapAnnotation
          coordinates={[2.3522, 48.8566]}
          data-testid="annotation-line"
          stroke="#ff6f26"
        >
          <text>Paris</text>
        </MapAnnotation>
      </MapBase>,
    )

    expect(container.querySelector('[name="annotation"]')?.getAttribute('transform')).toMatch(/^translate/)
    expect(screen.getByTestId('annotation-line').getAttribute('name')).toBe('annotation-line')
    expect(screen.getByTestId('annotation-line').getAttribute('d')).toMatch(/^M/)
    expect(screen.getByTestId('annotation-line').getAttribute('stroke')).toBe('#ff6f26')
    expect(screen.getByText('Paris')).toBeTruthy()
    expect(container.querySelector('[name="annotation-content"]')?.getAttribute('transform')).toMatch(/^translate/)
    expect(container.querySelector('[name="annotation-content"]')?.getAttribute('transform')).not.toContain('rotate')
  })

  it('throws outside map context', () => {
    expect(() => render(
      <svg>
        <MapAnnotation
          coordinates={[2.3522, 48.8566]}
          data-testid="annotation-line"
        >
          <text>Paris</text>
        </MapAnnotation>
      </svg>,
    )).toThrowError('useMapContext must be used inside Map')
  })

  it('uses the provided D3 curve for the connector path', () => {
    const { rerender } = render(
      <MapBase data={sampleGeoJson}>
        <MapAnnotation
          coordinates={[2.3522, 48.8566]}
          data-testid="annotation-line"
          midpoint={[0, -40]}
        >
          <text>Paris</text>
        </MapAnnotation>
      </MapBase>,
    )

    const linearPath = screen.getByTestId('annotation-line').getAttribute('d')

    rerender(
      <MapBase data={sampleGeoJson}>
        <MapAnnotation
          coordinates={[2.3522, 48.8566]}
          data-testid="annotation-line"
          curve={midpointCurve}
          midpoint={[0, -40]}
        >
          <text>Paris</text>
        </MapAnnotation>
      </MapBase>,
    )

    expect(screen.getByTestId('annotation-line').getAttribute('d')).not.toBe(linearPath)
  })
})
