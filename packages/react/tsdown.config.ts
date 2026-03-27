import { createTsDownConfig } from '../../tsdown.config.ts'

export default createTsDownConfig({
  copy: [{
    from: '../core/src/index.css',
    rename: 'index.css',
  }],
  tsconfig: './tsconfig.build.json',
  iifeNoExternal: [
    '@d3-maps/core',
    'react/jsx-runtime',
  ],
  globals: {
    react: 'React',
  },
})
