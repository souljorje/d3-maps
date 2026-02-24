import react from '@vitejs/plugin-react'
import {
  defineConfig,
  mergeConfig,
} from 'vitest/config'

import sharedVitestConfig from '../../vitest.shared'

export default mergeConfig(
  sharedVitestConfig,
  defineConfig({
    plugins: [react()],
    test: {
      environment: 'jsdom',
      globals: true,
      include: ['tests/**/*.spec.{ts,tsx}'],
      setupFiles: ['./tests/setup.ts'],
    },
  }),
)
