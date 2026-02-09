import { createTsDownConfig } from '../../tsdown.config.ts'

const globals = {
  'd3-geo': 'd3',
  'd3-selection': 'd3',
  'd3-zoom': 'd3',
  'topojson-client': 'topojson',
}

export default createTsDownConfig({
  globals,
  dts: {
    resolve: true,
  },
})
