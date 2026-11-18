// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest'

import { select } from 'd3-selection'

import { bindMapInteraction, bindMapZoom, makeMapContext, zoomIdentity } from '../src'

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

describe('mounted behavior bindings', () => {
  it('disposes element and global interaction listeners', () => {
    const { group } = makeElements()
    const onStateChange = vi.fn()
    const dispose = bindMapInteraction(group, onStateChange, true)
    disposers.push(dispose)
    group.dispatchEvent(new MouseEvent('mouseenter'))
    group.dispatchEvent(new FocusEvent('focus'))
    group.dispatchEvent(new MouseEvent('mousedown'))
    expect(onStateChange.mock.calls.map(([state]) => state)).toEqual(['hover', 'focus', 'active'])
    dispose()
    onStateChange.mockClear()
    group.dispatchEvent(new MouseEvent('mouseup'))
    window.dispatchEvent(new MouseEvent('mouseup'))
    expect(onStateChange).not.toHaveBeenCalled()
  })

  it('forwards current callbacks and preserves transforms while rebinding', () => {
    const { svg, group } = makeElements()
    const context = makeMapContext()
    let onZoom = vi.fn()
    const first = bindMapZoom(() => context, group, () => ({ onZoom }))
    disposers.push(first.dispose)
    first.commands.transform(zoomIdentity.scale(2), false)
    expect(group.getAttribute('transform')).toContain('scale(2)')
    expect(onZoom).toHaveBeenCalledOnce()
    onZoom = vi.fn()
    first.commands.scaleTo(3, false)
    expect(onZoom).toHaveBeenCalledOnce()

    const second = bindMapZoom(() => context, group)
    disposers.push(second.dispose)
    first.dispose()
    expect(select(svg).on('wheel.zoom')).toBeTypeOf('function')
    expect(group.getAttribute('transform')).toContain('scale(3)')
    first.commands.reset(false)
    expect(group.getAttribute('transform')).toContain('scale(3)')
    second.commands.reset(false)
    expect(group.getAttribute('transform')).toContain('scale(1)')
  })

  it('removes zoom listeners without removing unrelated listeners', () => {
    const { svg, group } = makeElements()
    const onClick = vi.fn()
    select(svg).on('click.application', onClick)
    const binding = bindMapZoom(() => makeMapContext(), group)
    disposers.push(binding.dispose)
    binding.dispose()
    binding.dispose()
    expect(select(svg).on('wheel.zoom')).toBeUndefined()
    svg.dispatchEvent(new MouseEvent('click'))
    expect(onClick).toHaveBeenCalledOnce()
    expect(binding.commands.zoomToFeature({ type: 'Sphere' })).toBe(false)
  })

  it('cleans window listeners when unmounted during a drag', () => {
    const { svg, group } = makeElements()
    const binding = bindMapZoom(() => makeMapContext(), group)
    disposers.push(binding.dispose)
    svg.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, view: window, button: 0 }))
    expect(select(window).on('mousemove.zoom')).toBeTypeOf('function')
    binding.dispose()
    expect(select(window).on('mousemove.zoom')).toBeUndefined()
    expect(select(window).on('mouseup.zoom')).toBeUndefined()
    expect(select(window).on('dragstart.drag')).toBeUndefined()
  })
})
