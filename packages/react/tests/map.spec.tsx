import { describe, expect, it } from 'vitest'

import { Map } from '../src'
import { sampleGeoJson } from './fixtures'
import { render } from './testUtils'

describe('map', () => {
  it('renders default viewBox from map defaults', () => {
    const { container, unmount } = render(
      <Map data={sampleGeoJson} />,
    )

    expect(container.querySelector('svg')?.getAttribute('viewBox')).toBe('0 0 600 337.5')
    unmount()
  })

  it('renders render-prop children with map context', () => {
    const { container, unmount } = render(
      <Map
        data={sampleGeoJson}
        width={420}
      >
        {(context) => (
          <g data-size={`${context.width}x${context.height}`} />
        )}
      </Map>,
    )

    expect(container.querySelector('g')?.getAttribute('data-size')).toBe('420x236.25')
    unmount()
  })
})
