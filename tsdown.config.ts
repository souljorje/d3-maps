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

function resolveDtsConfig(
  dts: UserConfig['dts'],
  tsconfig: UserConfig['tsconfig'],
): UserConfig['dts'] {
  if (dts === false) return false
  if (!tsconfig) return dts ?? true
  if (!dts || dts === true) {
    return { tsconfig }
  }
  return {
    tsconfig,
    ...dts,
  }
}

export function createTsDownConfig({
  copy,
  dts,
  entry,
  globals,
  iifeNoExternal,
  plugins,
  tsconfig,
}: {
  copy?: UserConfig['copy']
  dts?: UserConfig['dts']
  entry?: UserConfig['entry']
  globals?: Record<string, string>
  iifeNoExternal?: UserConfig['noExternal']
  plugins?: UserConfig['plugins']
  tsconfig?: UserConfig['tsconfig']
} = {}) {
  return defineConfig([
    {
      ...BASE_CONFIG,
      copy,
      entry: entry ?? BASE_CONFIG.entry,
      dts: resolveDtsConfig(dts, tsconfig),
      plugins,
      tsconfig,
    },
    {
      ...IIFE_CONFIG,
      entry: entry ?? IIFE_CONFIG.entry,
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
