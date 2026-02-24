import tsconfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vitest/config'

const sharedVitestConfig = defineConfig({
  plugins: [tsconfigPaths({ loose: true })],
  test: {
    coverage: {
      reporter: ['text', 'html'],
    },
  },
})

export default sharedVitestConfig
