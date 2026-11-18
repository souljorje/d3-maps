import { afterEach, describe, expect, it, vi } from 'vitest'

import type { MapZoomHandle } from '../src'

import { flushSync, mount, unmount } from 'svelte'

import { sampleGeoJsonTwoFeatures, sampleTopology } from '../../../tests/fixtures/mapData'
import { makeMapContext, MapSphere, useMapZoom, zoomIdentity } from '../src'
import CustomFeatures from './CustomFeatures.svelte'
import Harness from './Harness.svelte'

const cleanup: (() => Promise<void>)[] = []

afterEach(async () => {
  for (const dispose of cleanup.splice(0)) await dispose()
  document.body.replaceChildren()
})

function target(): HTMLDivElement {
  const element = document.createElement('div')
  document.body.append(element)
  return element
}

describe('svelte map components', () => {
  it('renders all layers and reacts to dimensions and provided context', () => {
    const props = $state({ width: 600, context: undefined as ReturnType<typeof makeMapContext> | undefined })
    const container = target()
    const component = mount(Harness, { target: container, props })
    cleanup.push(() => unmount(component))
    flushSync()
    const svg = container.querySelector('svg')!
    const feature = container.querySelector('[data-d3m="feature"]')!
    const oldPath = feature.getAttribute('d')
    expect(svg.getAttribute('viewBox')).toBe('0 0 600 300')
    expect(svg.getAttribute('aria-label')).toBe('Test map')
    expect(svg.classList.contains('custom-map')).toBe(true)
    expect(svg.hasAttribute('padding')).toBe(false)
    for (const layer of ['annotation', 'graticule', 'mesh', 'marker', 'line', 'sphere']) {
      expect(container.querySelector(`[data-d3m="${layer}"]`)).not.toBeNull()
    }
    props.width = 800
    flushSync()
    expect(svg.getAttribute('viewBox')).toBe('0 0 800 400')
    expect(feature.getAttribute('d')).not.toBe(oldPath)
    props.context = makeMapContext({ width: 320, height: 240 })
    flushSync()
    expect(svg.getAttribute('viewBox')).toBe('0 0 320 240')
  })

  it('preserves keyed feature elements and supports topology data', () => {
    const props = $state({ data: sampleGeoJsonTwoFeatures as typeof sampleGeoJsonTwoFeatures | typeof sampleTopology })
    const container = target()
    const component = mount(Harness, { target: container, props })
    cleanup.push(() => unmount(component))
    flushSync()
    const paths = [...container.querySelectorAll('[data-d3m="feature"]')]
    props.data = { ...sampleGeoJsonTwoFeatures, features: [...sampleGeoJsonTwoFeatures.features].reverse() }
    flushSync()
    expect([...container.querySelectorAll('[data-d3m="feature"]')]).toEqual(paths.reverse())
    props.data = sampleTopology
    flushSync()
    expect(container.querySelectorAll('[data-d3m="feature"]')).toHaveLength(1)
  })

  it('supports generic transformers and custom feature snippets', () => {
    const container = target()
    const component = mount(CustomFeatures, { target: container })
    cleanup.push(() => unmount(component))
    flushSync()
    expect(container.querySelectorAll('[data-score="42"]')).toHaveLength(2)
  })

  it('merges native styles, forwards events, and recovers after a global mouseup', () => {
    const onmouseenter = vi.fn()
    const container = target()
    const component = mount(Harness, { target: container, props: { onmouseenter } })
    cleanup.push(() => unmount(component))
    flushSync()
    const path = container.querySelector<SVGElement>('[data-testid="interactive"]')!
    expect(path.style.fill).toBe('orange')
    expect(path.style.opacity).toBe('0.9')
    path.dispatchEvent(new MouseEvent('mouseenter'))
    flushSync()
    expect(onmouseenter).toHaveBeenCalledOnce()
    expect(path.style.opacity).toBe('0.8')
    path.dispatchEvent(new FocusEvent('focus'))
    path.dispatchEvent(new MouseEvent('mousedown'))
    flushSync()
    expect(path.style.opacity).toBe('0.7')
    window.dispatchEvent(new MouseEvent('mouseup'))
    flushSync()
    expect(path.style.opacity).toBe('0.6')
    path.dispatchEvent(new FocusEvent('blur'))
    flushSync()
    expect(path.style.opacity).toBe('0.9')
  })

  it('exposes commands, updates zoom configuration, and disposes on unmount', async () => {
    let zoom: MapZoomHandle | undefined
    const onReady = (value: MapZoomHandle): void => { zoom = value }
    const props = $state({ maxZoom: 8, onReady })
    const container = target()
    const component = mount(Harness, { target: container, props })
    flushSync()
    const group = container.querySelector('[data-d3m="zoom"]')!
    const commands = useMapZoom(() => zoom)
    commands.transform(zoomIdentity.scale(2), false)
    expect(group.getAttribute('transform')).toContain('scale(2)')
    props.maxZoom = 4
    flushSync()
    expect(zoom?.getZoomBehavior()?.scaleExtent()).toEqual([1, 4])
    expect(group.getAttribute('transform')).toContain('scale(2)')
    commands.scaleWith(20, false)
    expect(group.getAttribute('transform')).toContain('scale(4)')
    commands.reset(false)
    expect(group.getAttribute('transform')).toContain('scale(1)')
    const behavior = zoom?.getZoomBehavior()
    await unmount(component)
    expect(behavior?.on('zoom')).toBeUndefined()
    expect(commands.zoomToFeature({ type: 'Sphere' })).toBe(false)
  })

  it('uses unique sphere clips and can disable clipping reactively', () => {
    const props = $state({ noClip: false })
    const container = target()
    const component = mount(Harness, { target: container, props })
    cleanup.push(() => unmount(component))
    flushSync()
    const clip = container.querySelector('clipPath')!
    const content = container.querySelector('[data-d3m="sphere-content"]')!
    expect(content.getAttribute('clip-path')).toBe(`url(#${clip.id})`)
    props.noClip = true
    flushSync()
    expect(container.querySelector('clipPath')).toBeNull()
    expect(content.hasAttribute('clip-path')).toBe(false)
  })

  it('reports missing map context', () => {
    expect(() => mount(MapSphere, { target: target() })).toThrow('useMapContext must be used inside MapBase')
  })
})
