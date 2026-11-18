import { svelte } from '@sveltejs/vite-plugin-svelte'
import { defineConfig, mergeConfig } from 'vitest/config'

import sharedVitestConfig from '../../vitest.shared'

export default mergeConfig(sharedVitestConfig, defineConfig({
  plugins: [svelte({ hot: false })],
  resolve: { conditions: ['browser'] },
  test: {
    environment: 'jsdom',
    include: ['tests/**/*.spec.svelte.ts'],
  },
}))
