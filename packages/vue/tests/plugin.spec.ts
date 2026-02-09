import { describe, expect, it } from 'vitest'
import { createApp } from 'vue'
import { Map, plugin } from '../src'

describe('@d3-maps/vue plugin', () => {
  it('registers the Map component', () => {
    const app = createApp({ template: '<div />' })
    app.use(plugin)

    expect(app.component('Map')).toBe(Map)
  })
})
