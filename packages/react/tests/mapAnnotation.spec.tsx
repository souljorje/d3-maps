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

  it('does not render outside map context', () => {
    render(
      <svg>
        <MapAnnotation
          coordinates={[2.3522, 48.8566]}
          data-testid="annotation-line"
        >
          <text>Paris</text>
        </MapAnnotation>
      </svg>,
    )

    expect(screen.queryByTestId('annotation-line')).toBeNull()
    expect(screen.queryByText('Paris')).toBeNull()
  })
})
