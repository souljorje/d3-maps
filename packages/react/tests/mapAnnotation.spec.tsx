import { describe, expect, it } from 'vitest'

import {
  render,
  screen,
} from '@testing-library/react'

import {
  Map,
  MapAnnotation,
} from '../src'
import { sampleGeoJson } from './fixtures'

describe('mapAnnotation', () => {
  it('renders connector and content inside map context', () => {
    const { container } = render(
      <Map data={sampleGeoJson}>
        <MapAnnotation
          coordinates={[2.3522, 48.8566]}
          data-testid="annotation-path"
          stroke="#ff6f26"
        >
          <text>Paris</text>
        </MapAnnotation>
      </Map>,
    )

    expect(screen.getByTestId('annotation-path').getAttribute('d')).toMatch(/^M/)
    expect(screen.getByText('Paris')).toBeTruthy()
    expect(container.querySelector('[name="annotation-content"]')?.getAttribute('transform')).toMatch(/^translate/)
    expect(container.querySelector('[name="annotation-content"]')?.getAttribute('transform')).not.toContain('rotate')
  })

  it('does not render outside map context', () => {
    render(
      <svg>
        <MapAnnotation
          coordinates={[2.3522, 48.8566]}
          data-testid="annotation-path"
        >
          <text>Paris</text>
        </MapAnnotation>
      </svg>,
    )

    expect(screen.queryByTestId('annotation-path')).toBeNull()
    expect(screen.queryByText('Paris')).toBeNull()
  })
})
