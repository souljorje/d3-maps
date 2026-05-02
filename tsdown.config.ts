import type { UserConfig } from 'tsdown'

import { defineConfig } from 'tsdown'

const BASE_CONFIG: Partial<UserConfig> = {
  exports: true,
  entry: 'src/index.ts',
  platform: 'neutral',
}

export function createTsDownConfig({
  dts,
  plugins,
  tsconfig,
}: {
  dts?: UserConfig['dts']
  plugins?: UserConfig['plugins']
  tsconfig?: UserConfig['tsconfig']
} = {}) {
  return defineConfig({
    ...BASE_CONFIG,
    dts: {
      tsconfig,
      ...(typeof dts === 'object' ? dts : { enabled: dts ?? true }),
    },
    plugins,
    tsconfig,
  })
}
