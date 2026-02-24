import {
  defineConfig,
  mergeConfig,
} from 'vitest/config'

import sharedVitestConfig from '../../vitest.shared'

export default mergeConfig(
  sharedVitestConfig,
  defineConfig({
    test: {
      environment: 'node',
    },
  }),
)
