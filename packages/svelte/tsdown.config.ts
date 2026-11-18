import { copyFile } from 'node:fs/promises'

import { createTsDownConfig } from '../../tsdown.config.ts'

export default {
  ...createTsDownConfig({ tsconfig: './tsconfig.build.json', dts: false }),
  exports: false,
  entry: ['src/index.ts', 'src/context.ts'],
  unbundle: true,
  clean: false,
  deps: { neverBundle: [/\.svelte$/] },
  hooks: {
    'build:done': async () => {
      await copyFile('../core/src/style.css', 'dist/style.css')
    },
  },
}
