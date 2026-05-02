import vue from 'unplugin-vue/rolldown'

import { createTsDownConfig } from '../../tsdown.config.ts'

export default createTsDownConfig({
  tsconfig: './tsconfig.build.json',
  dts: {
    vue: true,
  },
  plugins: [vue({ isProduction: true })],
})
