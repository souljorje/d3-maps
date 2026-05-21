import { describe, expect, it, vi } from 'vitest'

import { mount } from '@vue/test-utils'
import { h } from 'vue'

import {
  MapBase,
  MapGraticule,
} from '../src'
import { sampleGeoJson } from './fixtures'

function mountWithMapGraticule(props: Record<string, unknown> = {}) {
  return mount(MapBase, {
    props: {
      fit: sampleGeoJson,
    },
    slots: {
      default: () =>
        h(MapGraticule, {
          'data-testid': 'map-graticule-lines',
          ...props,
        }),
    },
  })
}

describe('mapGraticule', () => {
  it('renders graticule lines inside map context', () => {
    const wrapper = mountWithMapGraticule({ stroke: '#334155' })
    const lines = wrapper.get('path[data-testid="map-graticule-lines"]')
    expect(lines.attributes('d')).toBeTruthy()
    expect(lines.attributes('fill')).toBe('none')
    expect(lines.attributes('stroke')).toBe('#334155')
  })

  it('renders only graticule lines', () => {
    const wrapper = mountWithMapGraticule()
    expect(wrapper.findAll('path')).toHaveLength(1)
  })

  it('refreshes forwarded attrs and listeners on parent re-render', async () => {
    const firstOnMouseup = vi.fn()
    const secondOnMouseup = vi.fn()
    let onMouseup = firstOnMouseup
    let stroke = '#334155'

    const wrapper = mount(MapBase, {
      props: {
        fit: sampleGeoJson,
        width: 600,
      },
      slots: {
        default: () =>
          h(MapGraticule, {
            'data-testid': 'map-graticule-lines',
            stroke,
            onMouseup,
          }),
      },
    })

    const initialLines = wrapper.get('path[data-testid="map-graticule-lines"]')
    expect(initialLines.attributes('stroke')).toBe('#334155')
    await initialLines.trigger('mouseup')
    expect(firstOnMouseup).toHaveBeenCalledTimes(1)
    expect(secondOnMouseup).toHaveBeenCalledTimes(0)

    onMouseup = secondOnMouseup
    stroke = '#0f172a'
    await wrapper.setProps({
      width: 610,
    })

    const updatedLines = wrapper.get('path[data-testid="map-graticule-lines"]')
    expect(updatedLines.attributes('stroke')).toBe('#0f172a')
    await updatedLines.trigger('mouseup')
    expect(firstOnMouseup).toHaveBeenCalledTimes(1)
    expect(secondOnMouseup).toHaveBeenCalledTimes(1)
  })

  it('throws without map context', () => {
    expect(() => mount(MapGraticule)).toThrowError('useMapContext must be used inside Map')
  })
})
