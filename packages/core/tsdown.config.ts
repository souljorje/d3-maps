import { createTsDownConfig } from '../../tsdown.config.ts'

export default createTsDownConfig({
  copy: [{
    from: 'src/index.css',
    rename: 'index.css',
  }],
  iifeNoExternal: [
    'd3-geo',
    'd3-selection',
    'd3-shape',
    'd3-zoom',
    'topojson-client',
  ],
})
