import vue from 'unplugin-vue/rolldown'

import { createTsDownConfig } from '../../tsdown.config.ts'

export default createTsDownConfig({
  globals: {
    vue: 'Vue',
    '@d3-maps/core': 'D3Maps',
  },
  plugins: [vue({ isProduction: true })],
  dts: { vue: true },
})
