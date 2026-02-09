import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vitepress'

const guideSidebar = {
  text: 'Guide',
  items: [
    { text: 'Introduction', link: '/guide/' },
    { text: 'Getting Started', link: '/guide/getting-started' },
  ],
}

const apiSidebar = {
  text: 'API',
  items: [
    { text: 'Overview', link: '/api/' },
    { text: 'MapFeature', link: '/api/map-feature' },
    { text: 'MapFeatures', link: '/api/map-features' },
    { text: 'MapMarker', link: '/api/map-marker' },
    { text: 'MapZoom', link: '/api/map-zoom' },
    { text: 'Context', link: '/api/map-context' },
    { text: 'Consumer', link: '/api/map-consumer' },
  ],
}

const examplesSidebar = {
  text: 'Examples',
  items: [
    { text: 'Basic', link: '/examples/' },
    { text: 'Markers', link: '/examples/markers' },
    { text: 'Zoom and Drag', link: '/examples/zoom-and-drag' },
    { text: 'Choropleth Map', link: '/examples/choroplet-map' },
    { text: 'Bubble Map', link: '/examples/bubble-map' },
  ],
}

export default defineConfig({
  srcExclude: ['AGENTS.md'],
  title: 'd3-maps',
  description: 'Responsive SVG maps with Vue 3, Vite, and D3',
  head: [
    ['meta', { name: 'theme-color', content: '#3eaf7c' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }],
    ['link', { rel: 'apple-touch-icon', sizes: '180x180', href: '/favicons/apple-touch-icon.png' }],
    ['link', { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicons/favicon-32x32.png' }],
    ['link', { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicons/favicon-16x16.png' }],
    ['link', { rel: 'manifest', href: '/favicons/site.webmanifest' }],
    ['link', { rel: 'shortcut icon', href: '/favicons/favicon.ico' }],
    ['meta', { name: 'msapplication-TileColor', content: '#000' }],
    ['meta', { name: 'msapplication-config', content: '/favicons/browserconfig.xml' }],
  ],
  themeConfig: {
    logo: '/d3-maps-logo.png',
    nav: [
      { text: 'Guide', link: '/guide/' },
      { text: 'API', link: '/api/' },
      { text: 'Examples', link: '/examples/' },
    ],
    sidebar: [
      guideSidebar,
      apiSidebar,
      examplesSidebar,
    ],
    editLink: {
      pattern: 'https://github.com/souljorje/d3-maps/edit/main/packages/docs/:path',
      text: 'Edit this page on GitHub',
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/souljorje/d3-maps' },
    ],
    footer: {
      message: 'MIT Licensed',
      copyright: 'Copyright © 2020-present Georgii Bukharov',
    },
  },
  vite: {
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./', import.meta.url)),
        'd3-maps': fileURLToPath(new URL('../../d3-maps/src/index.ts', import.meta.url)),
        '@d3-maps/core': fileURLToPath(new URL('../../core/src/index.ts', import.meta.url)),
      },
    },
  },
})
