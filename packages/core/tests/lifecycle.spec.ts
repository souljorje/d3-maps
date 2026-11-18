// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest'

import { select } from 'd3-selection'

import { createZoomBinding, makeMapContext, zoomIdentity } from '../src'

const disposers: (() => void)[] = []

afterEach(() => {
  for (const dispose of disposers.splice(0)) dispose()
  document.body.replaceChildren()
})

function makeElements() {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  const group = document.createElementNS('http://www.w3.org/2000/svg', 'g')
  svg.append(group)
  document.body.append(svg)
  return { svg, group }
}

describe('zoom resource lifecycle', () => {
  it('updates options and callbacks without losing the current transform', () => {
    const { group } = makeElements()
    const context = makeMapContext()
    let maxZoom = 8
    let onZoom = vi.fn()
    const binding = createZoomBinding(() => context, group, () => ({ maxZoom, onZoom }))
    disposers.push(binding.dispose)
    const previousBehavior = binding.zoomBehavior

    binding.commands.transform(zoomIdentity.scale(2), false)
    expect(group.getAttribute('transform')).toContain('scale(2)')
    expect(onZoom).toHaveBeenCalledOnce()

    onZoom = vi.fn()
    maxZoom = 4
    binding.update()
    expect(previousBehavior.on('zoom')).toBeUndefined()
    expect(binding.zoomBehavior.scaleExtent()).toEqual([1, 4])
    expect(group.getAttribute('transform')).toContain('scale(2)')
    binding.commands.scaleTo(3, false)
    expect(onZoom).toHaveBeenCalledOnce()
  })

  it('retains a live behavior and its gesture callbacks while replacing zoom options', () => {
    const { group } = makeElements()
    const context = makeMapContext()
    const onZoom = vi.fn()
    let maxZoom = 8
    let config: { clickDistance: number } | undefined = { clickDistance: 12 }
    const binding = createZoomBinding(() => context, group, () => ({ maxZoom, config, onZoom }))
    disposers.push(binding.dispose)
    const activeBehavior = binding.zoomBehavior
    expect(activeBehavior.clickDistance()).toBe(12)

    maxZoom = 4
    config = undefined
    binding.update()

    expect(binding.zoomBehavior).toBe(activeBehavior)
    expect(activeBehavior.scaleExtent()).toEqual([1, 4])
    expect(activeBehavior.clickDistance()).toBe(0)

    // D3 dispatches the remaining events of an active gesture via its original behavior.
    const event = { transform: zoomIdentity.scale(3) }
    const listener = activeBehavior.on('zoom') as ((event: typeof event) => void) | undefined
    expect(listener).toBeTypeOf('function')
    listener?.(event)
    expect(group.getAttribute('transform')).toContain('scale(3)')
    expect(onZoom).toHaveBeenCalledWith(event)
  })

  it('does not remove newer bindings on the same SVG', () => {
    const { svg, group } = makeElements()
    const first = createZoomBinding(() => makeMapContext(), group)
    disposers.push(first.dispose)
    const second = createZoomBinding(() => makeMapContext(), group)
    disposers.push(second.dispose)

    first.dispose()
    expect(select(svg).on('wheel.zoom')).toBeTypeOf('function')
    first.commands.reset(false)
    second.commands.transform(zoomIdentity.scale(2), false)
    expect(group.getAttribute('transform')).toContain('scale(2)')
  })

  it('disposes only owned zoom listeners and makes commands inert', () => {
    const { svg, group } = makeElements()
    const onClick = vi.fn()
    select(svg).on('click.application', onClick)
    const binding = createZoomBinding(() => makeMapContext(), group)
    disposers.push(binding.dispose)
    const behavior = binding.zoomBehavior

    expect(select(svg).on('wheel.zoom')).toBeTypeOf('function')
    binding.dispose()
    binding.dispose()
    binding.update()

    expect(behavior.on('zoom')).toBeUndefined()
    expect(select(svg).on('wheel.zoom')).toBeUndefined()
    svg.dispatchEvent(new MouseEvent('click'))
    expect(onClick).toHaveBeenCalledOnce()
    expect(binding.commands.zoomToFeature({ type: 'Sphere' })).toBe(false)
  })
})
