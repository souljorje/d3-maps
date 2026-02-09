import vue from 'unplugin-vue/rolldown'
import { createTsDownConfig } from '../../tsdown.config.ts'

export default createTsDownConfig({
  globals: {
    vue: 'Vue',
  },
  plugins: [vue({ isProduction: true })],
  dts: { vue: true },
})
