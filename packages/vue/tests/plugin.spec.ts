import { describe, expect, it } from 'vitest'

import { createApp } from 'vue'

import {
  MapAnnotation,
  MapBase,
  MapLine,
  MapMesh,
  plugin,
} from '../src'

describe('@d3-maps/vue plugin', () => {
  it('registers the MapBase component', () => {
    const app = createApp({ template: '<div />' })
    app.use(plugin)

    expect(app.component('MapBase')).toBe(MapBase)
  })

  it('registers the MapMesh component', () => {
    const app = createApp({ template: '<div />' })
    app.use(plugin)

    expect(app.component('MapMesh')).toBe(MapMesh)
  })

  it('registers the MapLine component', () => {
    const app = createApp({ template: '<div />' })
    app.use(plugin)

    expect(app.component('MapLine')).toBe(MapLine)
  })

  it('registers the MapAnnotation component', () => {
    const app = createApp({ template: '<div />' })
    app.use(plugin)

    expect(app.component('MapAnnotation')).toBe(MapAnnotation)
  })
})
