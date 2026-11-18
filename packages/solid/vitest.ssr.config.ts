import { defineConfig, mergeConfig } from 'vitest/config'

import sharedVitestConfig from '../../vitest.shared'
import { solidCompiler } from './build/compiler'

export default mergeConfig(sharedVitestConfig, defineConfig({
  plugins: [solidCompiler('ssr')],
  resolve: { conditions: ['node'] },
  test: {
    environment: 'node',
    include: ['tests/**/*.ssr.spec.tsx'],
  },
}))
