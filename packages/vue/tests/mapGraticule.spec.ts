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
    const lines = wrapper.find('path[data-testid="map-graticule-lines"]')

    expect(lines.exists()).toBe(true)
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

  it('emits map-object events from lines path', async () => {
    const onMouseenter = vi.fn()
    const onMouseleave = vi.fn()
    const onMousedown = vi.fn()
    const onMouseup = vi.fn()
    const onFocus = vi.fn()
    const onBlur = vi.fn()
    const wrapper = mountWithMapGraticule({
      onMouseenter,
      onMouseleave,
      onMousedown,
      onMouseup,
      onFocus,
      onBlur,
    })
    const lines = wrapper.find('path[data-testid="map-graticule-lines"]')

    await lines.trigger('mouseenter')
    await lines.trigger('mouseleave')
    await lines.trigger('mousedown')
    await lines.trigger('mouseup')
    await lines.trigger('focus')
    await lines.trigger('blur')

    expect(onMouseenter).toHaveBeenCalled()
    expect(onMouseleave).toHaveBeenCalled()
    expect(onMousedown).toHaveBeenCalled()
    expect(onMouseup).toHaveBeenCalled()
    expect(onFocus).toHaveBeenCalled()
    expect(onBlur).toHaveBeenCalled()
  })
})
