import { describe, expect, it } from 'vitest'
import { createApp } from 'vue'
import { Map, MapMesh, plugin } from '../src'

describe('@d3-maps/vue plugin', () => {
  it('registers the Map component', () => {
    const app = createApp({ template: '<div />' })
    app.use(plugin)

    expect(app.component('Map')).toBe(Map)
  })

  it('registers the MapMesh component', () => {
    const app = createApp({ template: '<div />' })
    app.use(plugin)

    expect(app.component('MapMesh')).toBe(MapMesh)
  })
})
