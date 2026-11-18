import { describe, expect, it, vi } from 'vitest'

import { render } from 'svelte/server'

import CustomFeatures from './CustomFeatures.svelte'
import Harness from './Harness.svelte'

describe('svelte server rendering', () => {
  it('renders static SVG without accessing the DOM or attaching behavior', () => {
    const onReady = vi.fn()
    const onFeaturesChange = vi.fn()
    expect(typeof window).toBe('undefined')
    const { body } = render(Harness, { props: { onReady, onFeaturesChange } })
    expect(body).toContain('<svg')
    expect(body).toContain('viewBox="0 0 600 300"')
    expect(body).toContain('d3-map-zoom')
    expect(body).toContain('data-d3m="feature"')
    expect(body).toContain('data-d3m="annotation"')
    expect(body).toContain('clipPath')
    expect(body).toContain('opacity: 0.9')
    expect(onReady).not.toHaveBeenCalled()
    expect(onFeaturesChange).not.toHaveBeenCalled()
  })

  it('renders transformed feature snippets on the server', () => {
    const { body } = render(CustomFeatures)
    expect(body.match(/data-score="42"/g)).toHaveLength(2)
    expect(body).not.toContain('undefined')
  })
})
