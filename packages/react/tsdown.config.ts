import { createTsDownConfig } from '../../tsdown.config.ts'

export default createTsDownConfig({
  globals: {
    react: 'React',
    'react-dom': 'ReactDOM',
    'react/jsx-runtime': 'ReactJSXRuntime',
    '@d3-maps/core': 'D3Maps',
  },
  dts: {
    resolve: true,
  },
})
