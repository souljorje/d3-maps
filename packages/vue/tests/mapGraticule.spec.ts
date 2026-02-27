import { describe, expect, it, vi } from 'vitest'

import { mount } from '@vue/test-utils'
import { h } from 'vue'

import {
  Map,
  MapGraticule,
} from '../src'
import { sampleGeoJson } from './fixtures'

function mountWithMapGraticule(props: Record<string, unknown> = {}) {
  return mount(Map, {
    props: {
      data: sampleGeoJson,
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

  it('does not render outline path when background and border are absent', () => {
    const wrapper = mountWithMapGraticule()
    expect(wrapper.findAll('path')).toHaveLength(1)
  })

  it('renders outline path when only background is provided', () => {
    const wrapper = mountWithMapGraticule({
      background: '#fef3c7',
    })

    const [outlineFill, lines] = wrapper.findAll('path')

    expect(outlineFill.attributes('fill')).toBe('#fef3c7')
    expect(outlineFill.attributes('stroke')).toBeUndefined()
    expect(outlineFill.attributes('pointer-events')).toBe('none')
    expect(lines.attributes('data-testid')).toBe('map-graticule-lines')
    expect(wrapper.findAll('path')).toHaveLength(2)
  })

  it('renders background outline without inline color when background is true', () => {
    const wrapper = mountWithMapGraticule({
      background: true,
    })

    const [outlineFill, lines] = wrapper.findAll('path')

    expect(outlineFill.attributes('fill')).toBeUndefined()
    expect(lines.attributes('data-testid')).toBe('map-graticule-lines')
    expect(wrapper.findAll('path')).toHaveLength(2)
  })

  it('renders outline path when only border is provided', () => {
    const wrapper = mountWithMapGraticule({
      border: '#1e293b',
    })

    const [lines, outlineStroke] = wrapper.findAll('path')

    expect(lines.attributes('data-testid')).toBe('map-graticule-lines')
    expect(outlineStroke.attributes('fill')).toBe('none')
    expect(outlineStroke.attributes('stroke')).toBe('#1e293b')
    expect(wrapper.findAll('path')).toHaveLength(2)
  })

  it('renders border outline without inline color when border is true', () => {
    const wrapper = mountWithMapGraticule({
      border: true,
    })

    const [lines, outlineStroke] = wrapper.findAll('path')

    expect(lines.attributes('data-testid')).toBe('map-graticule-lines')
    expect(outlineStroke.attributes('stroke')).toBeUndefined()
    expect(wrapper.findAll('path')).toHaveLength(2)
  })

  it('renders fill-outline under lines and border-outline above lines', () => {
    const wrapper = mountWithMapGraticule({
      background: '#f8fafc',
      border: '#475569',
    })

    const [outlineFill, lines, outlineStroke] = wrapper.findAll('path')

    expect(outlineFill.attributes('fill')).toBe('#f8fafc')
    expect(lines.attributes('data-testid')).toBe('map-graticule-lines')
    expect(outlineStroke.attributes('fill')).toBe('none')
    expect(outlineStroke.attributes('stroke')).toBe('#475569')
  })

  it('applies map-object interaction styles on lines path', async () => {
    const onMouseup = vi.fn()

    const wrapper = mountWithMapGraticule({
      styles: {
        default: { opacity: 0.9 },
        hover: { opacity: 0.7 },
        active: { opacity: 0.5 },
      },
      onMouseup,
    })
    const lines = wrapper.find('path[data-testid="map-graticule-lines"]')

    expect((lines.element as SVGPathElement).style.opacity).toBe('0.9')

    await lines.trigger('mouseenter')
    expect((lines.element as SVGPathElement).style.opacity).toBe('0.7')

    await lines.trigger('mousedown')
    expect((lines.element as SVGPathElement).style.opacity).toBe('0.5')

    await lines.trigger('mouseleave')
    await lines.trigger('mouseup')
    expect((lines.element as SVGPathElement).style.opacity).toBe('0.7')
    expect(onMouseup).toHaveBeenCalledTimes(1)
  })

  it('refreshes forwarded attrs and listeners on parent re-render', async () => {
    const firstOnMouseup = vi.fn()
    const secondOnMouseup = vi.fn()
    let onMouseup = firstOnMouseup
    let stroke = '#334155'

    const wrapper = mount(Map, {
      props: {
        data: sampleGeoJson,
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

  it('renders graticule path outside map context without geometry', () => {
    const wrapper = mount(MapGraticule)
    const paths = wrapper.findAll('path')

    expect(paths).toHaveLength(1)
    expect(paths[0]?.attributes('d')).toBeUndefined()
  })
})
