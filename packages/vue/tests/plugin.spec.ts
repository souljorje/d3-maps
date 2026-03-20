import { describe, expect, it } from 'vitest'

import { createApp } from 'vue'

import { MapBase, MapMesh, plugin } from '../src'

describe('@d3-maps/vue plugin', () => {
  it('registers the MapBase component', () => {
    const app = createApp({ template: '<div />' })
    app.use(plugin)

    expect(app.component('MapBase')).toBe(MapBase)
    expect(app.component('Map')).toBeUndefined()
  })

  it('registers the MapMesh component', () => {
    const app = createApp({ template: '<div />' })
    app.use(plugin)

    expect(app.component('MapMesh')).toBe(MapMesh)
  })
})
