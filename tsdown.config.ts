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
  entry,
  globals,
  iifeEntry,
  plugins,
}: {
  dts?: UserConfig['dts']
  entry?: UserConfig['entry']
  globals?: Record<string, string>
  iifeEntry?: UserConfig['entry']
  plugins?: UserConfig['plugins']
} = {}) {
  return defineConfig([
    {
      ...BASE_CONFIG,
      entry: entry ?? BASE_CONFIG.entry,
      dts: dts ?? true,
      plugins,
    },
    {
      ...IIFE_CONFIG,
      entry: iifeEntry ?? entry ?? IIFE_CONFIG.entry,
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
