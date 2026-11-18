import { defineConfig, mergeConfig } from 'vitest/config'

import sharedVitestConfig from '../../vitest.shared'
import { solidCompiler } from './build/compiler'

export default mergeConfig(sharedVitestConfig, defineConfig({
  plugins: [solidCompiler('dom', true)],
  resolve: { conditions: ['browser', 'development'] },
  ssr: {
    noExternal: ['solid-js', '@solidjs/web', '@solidjs/signals'],
    resolve: { conditions: ['browser', 'development'] },
  },
  test: {
    environment: 'jsdom',
    include: ['tests/**/*.client.spec.tsx'],
    server: { deps: { inline: [/solid-js/, /@solidjs\//] } },
  },
}))
