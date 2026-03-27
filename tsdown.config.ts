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
  copy,
  dts,
  entry,
  globals,
  iifeNoExternal,
  plugins,
}: {
  copy?: UserConfig['copy']
  dts?: UserConfig['dts']
  entry?: UserConfig['entry']
  globals?: Record<string, string>
  iifeNoExternal?: UserConfig['noExternal']
  plugins?: UserConfig['plugins']
} = {}) {
  return defineConfig([
    {
      ...BASE_CONFIG,
      copy,
      entry: entry ?? BASE_CONFIG.entry,
      dts: dts ?? true,
      plugins,
    },
    {
      ...IIFE_CONFIG,
      entry: entry ?? IIFE_CONFIG.entry,
      noExternal: iifeNoExternal,
      plugins,
      outputOptions: globals
        ? {
            extend: true,
            globals,
          }
        : {
            extend: true,
          },
    },
  ])
}
