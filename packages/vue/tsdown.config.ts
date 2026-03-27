import vue from 'unplugin-vue/rolldown'

import { createTsDownConfig } from '../../tsdown.config.ts'

export default createTsDownConfig({
  copy: [{
    from: '../core/src/index.css',
    rename: 'index.css',
  }],
  dts: {
    tsconfig: './tsconfig.dts.json',
    vue: true,
  },
  iifeNoExternal: ['@d3-maps/core'],
  globals: {
    vue: 'Vue',
  },
  plugins: [vue({ isProduction: true })],
})
