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
  globals,
  iifeNoExternal,
  plugins,
  tsconfig,
}: {
  copy?: UserConfig['copy']
  dts?: UserConfig['dts']
  globals?: Record<string, string>
  iifeNoExternal?: UserConfig['noExternal']
  plugins?: UserConfig['plugins']
  tsconfig?: UserConfig['tsconfig']
} = {}) {
  return defineConfig([
    {
      ...BASE_CONFIG,
      copy,
      dts: {
        tsconfig,
        ...(typeof dts === 'object' ? dts : { enabled: dts ?? true }),
      },
      plugins,
      tsconfig,
    },
    {
      ...IIFE_CONFIG,
      noExternal: iifeNoExternal,
      plugins,
      tsconfig,
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
