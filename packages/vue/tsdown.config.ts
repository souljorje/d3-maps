import vue from 'unplugin-vue/rolldown'

import { createTsDownConfig } from '../../tsdown.config.ts'

export default createTsDownConfig({
  tsconfig: './tsconfig.build.json',
  dts: {
    vue: true,
  },
  iife: {
    deps: {
      alwaysBundle: ['@d3-maps/core'],
    },
    outputOptions: {
      globals: {
        vue: 'Vue',
      },
    },
  },
  plugins: [vue({ isProduction: true })],
})
