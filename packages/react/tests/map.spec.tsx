import { describe, expect, it } from 'vitest'

import {
  render,
  screen,
} from '@testing-library/react'

import { Map } from '../src'
import { sampleGeoJson } from './fixtures'

describe('map', () => {
  it('renders default viewBox from map defaults', () => {
    render(
      <Map
        data={sampleGeoJson}
        data-testid="map-svg"
      />,
    )

    expect(screen.getByTestId('map-svg').getAttribute('viewBox')).toBe('0 0 600 337.5')
  })

  it('renders render-prop children with map context', () => {
    render(
      <Map
        data={sampleGeoJson}
        width={420}
        data-testid="map-svg"
      >
        {(context) => (
          <g
            data-testid="map-size-group"
            data-size={`${context.width}x${context.height}`}
          />
        )}
      </Map>,
    )

    expect(screen.getByTestId('map-size-group').getAttribute('data-size')).toBe('420x236.25')
  })
})
