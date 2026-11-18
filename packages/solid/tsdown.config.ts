import { copyFile } from 'node:fs/promises'

import { createTsDownConfig } from '../../tsdown.config.ts'
import { solidCompiler } from './build/compiler.ts'

export default [
  {
    ...createTsDownConfig({ tsconfig: './tsconfig.build.json', plugins: [solidCompiler('dom')] }),
    exports: false,
    outDir: 'dist/client',
    hooks: {
      'build:done': async () => {
        await copyFile('../core/src/style.css', 'dist/style.css')
      },
    },
  },
  {
    ...createTsDownConfig({ tsconfig: './tsconfig.build.json', dts: false, plugins: [solidCompiler('ssr')] }),
    exports: false,
    outDir: 'dist/server',
  },
]
