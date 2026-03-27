import { createTsDownConfig } from '../../tsdown.config.ts'

export default createTsDownConfig({
  copy: [{
    from: '../core/src/index.css',
    rename: 'index.css',
  }],
  dts: {
    tsconfig: './tsconfig.dts.json',
  },
  iifeNoExternal: [
    '@d3-maps/core',
    'react/jsx-runtime',
  ],
  globals: {
    react: 'React',
  },
})
