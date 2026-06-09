import { describe, expect, it } from 'vitest'

import { createApp } from 'vue'

import {
  MapAnnotation,
  MapBase,
  MapElement,
  MapFeature,
  MapFeatures,
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

  it('registers the MapFeatures component', () => {
    const app = createApp({ template: '<div />' })
    app.use(plugin)

    expect(app.component('MapFeatures')).toBe(MapFeatures)
  })

  it('registers the MapElement component', () => {
    const app = createApp({ template: '<div />' })
    app.use(plugin)

    expect(app.component('MapElement')).toBe(MapElement)
  })

  it('registers the MapFeature component', () => {
    const app = createApp({ template: '<div />' })
    app.use(plugin)

    expect(app.component('MapFeature')).toBe(MapFeature)
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
