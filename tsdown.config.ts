import type { UserConfig } from 'tsdown'

import { defineConfig } from 'tsdown'

const BASE_CONFIG: Partial<UserConfig> = {
  entry: 'src/index.ts',
  platform: 'neutral',
}

const IIFE_CONFIG: Partial<UserConfig> = {
  ...BASE_CONFIG,
  clean: false,
  format: 'iife',
  globalName: 'D3Maps',
  minify: true,
  platform: 'browser',
}

export function createTsDownConfig({
  dts,
  globals,
  plugins,
}: {
  dts?: UserConfig['dts']
  globals?: Record<string, string>
  plugins?: UserConfig['plugins']
} = {}) {
  return defineConfig([
    {
      ...BASE_CONFIG,
      dts: dts ?? true,
      plugins,
    },
    {
      ...IIFE_CONFIG,
      plugins,
      outputOptions: {
        extend: true,
        globals: {
          ...globals,
          '@d3-maps/core': 'D3Maps',
        },
      },
    },
  ])
}
