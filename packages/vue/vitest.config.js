import vue from '@vitejs/plugin-vue'
import tsconfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [tsconfigPaths({ loose: true }), vue()],
  test: {
    environment: 'jsdom',
    globals: true,
  },
})
