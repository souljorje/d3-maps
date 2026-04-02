import type { UserConfig } from 'tsdown'

import { defineConfig } from 'tsdown'

const BASE_CONFIG: Partial<UserConfig> = {
  exports: true,
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
  iife,
  plugins,
  tsconfig,
}: {
  dts?: UserConfig['dts']
  iife?: Partial<UserConfig>
  plugins?: UserConfig['plugins']
  tsconfig?: UserConfig['tsconfig']
} = {}) {
  const configs: UserConfig[] = [{
    ...BASE_CONFIG,
    dts: {
      tsconfig,
      ...(typeof dts === 'object' ? dts : { enabled: dts ?? true }),
    },
    plugins,
    tsconfig,
  }]

  if (iife) {
    configs.push({
      ...IIFE_CONFIG,
      plugins,
      tsconfig,
      ...iife,
    })
  }

  return defineConfig(configs)
}
