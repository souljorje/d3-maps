import vue from '@vitejs/plugin-vue'
import {
  defineConfig,
  mergeConfig,
} from 'vitest/config'

import sharedVitestConfig from '../../vitest.shared'

export default mergeConfig(
  sharedVitestConfig,
  defineConfig({
    plugins: [vue()],
    test: {
      environment: 'jsdom',
      globals: true,
    },
  }),
)
