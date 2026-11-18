import { afterEach, describe, expect, it, vi } from 'vitest'

import type { JSX } from '@solidjs/web'
import type { Setter } from 'solid-js'

import type { MapContext, MapData, MapZoomHandle } from '../src'

import { render } from '@solidjs/web'
import { createRoot, createSignal, flush, For } from 'solid-js'

import { sampleGeoJsonTwoFeatures, sampleTopology } from '../../../tests/fixtures/mapData'
import { makeMapContext, MapBase, MapElement, MapFeature, MapFeatures, MapSphere, useMapContext, useMapZoom, zoomIdentity } from '../src'
import { Harness } from './Harness'

const cleanup: (() => void)[] = []

afterEach(() => {
  for (const dispose of cleanup.splice(0)) dispose()
  document.body.replaceChildren()
})

function mount(view: () => JSX.Element) {
  const container = document.createElement('div')
  document.body.append(container)
  const dispose = render(view, container)
  cleanup.push(dispose)
  flush()
  return { container, dispose }
}

describe('solid map components', () => {
  it('renders all layers and tracks viewport and supplied context changes', () => {
    let updateWidth!: Setter<number>
    let updateContext!: Setter<MapContext | undefined>
    const { container } = mount(() => {
      const [width, setWidth] = createSignal(600)
      const [context, setContext] = createSignal<MapContext>()
      updateWidth = setWidth
      updateContext = setContext
      return <Harness width={width()} context={context()} />
    })
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
    updateWidth(800)
    flush()
    expect(svg.getAttribute('viewBox')).toBe('0 0 800 400')
    expect(feature.getAttribute('d')).not.toBe(oldPath)
    updateContext(makeMapContext({ width: 320, height: 240 }))
    flush()
    expect(svg.getAttribute('viewBox')).toBe('0 0 320 240')
  })

  it('preserves keyed nodes across reordering and accepts topology data', () => {
    let update!: Setter<MapData>
    const { container } = mount(() => {
      const [data, setData] = createSignal<MapData>(sampleGeoJsonTwoFeatures)
      update = setData
      return <Harness data={data()} />
    })
    const paths = [...container.querySelectorAll('[data-d3m="feature"]')]
    update({ ...sampleGeoJsonTwoFeatures, features: [...sampleGeoJsonTwoFeatures.features].reverse() })
    flush()
    expect([...container.querySelectorAll('[data-d3m="feature"]')]).toEqual(paths.reverse())
    update(sampleTopology)
    flush()
    expect(container.querySelectorAll('[data-d3m="feature"]')).toHaveLength(1)
  })

  it('supports generic transformed features and render props', () => {
    const { container } = mount(() => (
      <MapBase fit={sampleGeoJsonTwoFeatures}>
        <MapFeatures data={sampleGeoJsonTwoFeatures} transformer={(features) => features.map((feature) => ({ ...feature, score: 42 }))} getKey={(feature) => `${feature.score}-${feature.id}`}>
          {({ features }) => <For each={features}>{(feature) => <MapFeature d={feature.d} data-score={feature.score} />}</For>}
        </MapFeatures>
      </MapBase>
    ))
    expect(container.querySelectorAll('[data-score="42"]')).toHaveLength(2)
  })

  it('combines styles, forwards events, and recovers after global mouseup', () => {
    const onMouseEnter = vi.fn()
    const { container } = mount(() => <Harness onMouseEnter={onMouseEnter} />)
    const path = container.querySelector<SVGElement>('[data-testid="interactive"]')!
    expect(path.style.fill).toBe('orange')
    expect(path.style.opacity).toBe('0.9')
    path.dispatchEvent(new MouseEvent('mouseenter'))
    flush()
    expect(onMouseEnter).toHaveBeenCalledOnce()
    expect(path.style.opacity).toBe('0.8')
    path.dispatchEvent(new FocusEvent('focus'))
    path.dispatchEvent(new MouseEvent('mousedown'))
    flush()
    expect(path.style.opacity).toBe('0.7')
    window.dispatchEvent(new MouseEvent('mouseup'))
    flush()
    expect(path.style.opacity).toBe('0.6')
    path.dispatchEvent(new FocusEvent('blur'))
    flush()
    expect(path.style.opacity).toBe('0.9')
  })

  it('forwards element refs and rebinds behavior when the tag changes', () => {
    let update!: Setter<'path' | 'g'>
    let element: SVGElement | undefined
    const { container } = mount(() => {
      const [tag, setTag] = createSignal<'path' | 'g'>('path')
      update = setTag
      return (
        <svg>
          <MapElement
            tag={tag()}
            ref={(value) => {
              element = value
            }}
            styles={{ hover: { opacity: 0.5 } }}
          />
        </svg>
      )
    })
    expect(element?.tagName).toBe('path')
    update('g')
    flush()
    expect(element?.tagName).toBe('g')
    element?.dispatchEvent(new MouseEvent('mouseenter'))
    flush()
    expect(container.querySelector('g')?.style.opacity).toBe('0.5')
  })

  it('updates zoom configuration, preserves transforms, and disposes commands', () => {
    let zoom: MapZoomHandle | undefined
    let update!: Setter<number>
    const { container, dispose } = mount(() => {
      const [maxZoom, setMaxZoom] = createSignal(8)
      update = setMaxZoom
      return (
        <Harness
          maxZoom={maxZoom()}
          onReady={(value) => {
            zoom = value
          }}
        />
      )
    })
    const commands = useMapZoom(() => zoom)
    const group = container.querySelector('[data-d3m="zoom"]')!
    commands.transform(zoomIdentity.scale(2), false)
    expect(group.getAttribute('transform')).toContain('scale(2)')
    update(4)
    flush()
    expect(zoom?.getZoomBehavior()?.scaleExtent()).toEqual([1, 4])
    expect(group.getAttribute('transform')).toContain('scale(2)')
    commands.scaleWith(20, false)
    expect(group.getAttribute('transform')).toContain('scale(4)')
    commands.reset(false)
    expect(group.getAttribute('transform')).toContain('scale(1)')
    const behavior = zoom?.getZoomBehavior()
    dispose()
    cleanup.splice(cleanup.indexOf(dispose), 1)
    expect(behavior?.on('zoom')).toBeUndefined()
    expect(commands.zoomToFeature({ type: 'Sphere' })).toBe(false)
  })

  it('uses distinct clip IDs and supports reactive clipping', () => {
    let update!: Setter<boolean>
    const { container } = mount(() => {
      const [noClip, setNoClip] = createSignal(false)
      update = setNoClip
      return (
        <MapBase>
          <MapSphere noClip={noClip()} />
          <MapSphere />
        </MapBase>
      )
    })
    const clips = [...container.querySelectorAll('clipPath')]
    expect(clips).toHaveLength(2)
    expect(clips[0]!.id).not.toBe(clips[1]!.id)
    const content = container.querySelector('[data-d3m="sphere-content"]')!
    expect(content.getAttribute('clip-path')).toBe(`url(#${clips[0]!.id})`)
    update(true)
    flush()
    expect(container.querySelectorAll('clipPath')).toHaveLength(1)
    expect(content.hasAttribute('clip-path')).toBe(false)
  })

  it('reports missing contexts', () => {
    createRoot((dispose) => {
      expect(useMapContext).toThrow('useMapContext must be used inside MapBase')
      expect(() => useMapZoom()).toThrow('useMapZoom must be used inside MapZoom or receive a target getter')
      dispose()
    })
  })
})
