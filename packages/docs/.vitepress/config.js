import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vitepress'

const REPO_ROOT = fileURLToPath(new URL('../../..', import.meta.url))
const PACKAGES_DIR = path.join(REPO_ROOT, 'packages')

function toPascalCase(value) {
  return value
    .replace(/(^\w|[-_]\w)/g, (match) => match.replace(/[-_]/, '').toUpperCase())
}

function safeReadDir(dirPath) {
  try {
    return fs.readdirSync(dirPath)
  } catch {
    return []
  }
}

function getExamples() {
  const examplesDir = path.join(PACKAGES_DIR, 'docs', '.vitepress', 'examples')
  const docsExamplesDir = path.join(PACKAGES_DIR, 'docs', 'examples')
  const files = safeReadDir(examplesDir)
    .filter((file) => file.endsWith('.vue'))
    .sort((a, b) => a.localeCompare(b))

  return files
    .map((file) => {
      const slug = path.basename(file, '.vue')
      const docsFile = path.join(docsExamplesDir, `${slug}.md`)
      if (!fs.existsSync(docsFile)) return null

      return {
        id: slug,
        slug,
        title: toPascalCase(slug).replace(/([a-z])([A-Z])/g, '$1 $2'),
        sourcePath: `@/packages/docs/.vitepress/examples/${file}`,
        docsPath: `/examples/${slug}`,
      }
    })
    .filter(Boolean)
}
const examples = getExamples()

const docsSidebar = [
  {
    text: 'Guide',
    items: [
      { text: 'Get Started', link: '/guide/' },
      { text: 'Core Concepts', link: '/guide/core-concepts/' },
      { text: 'Troubleshooting', link: '/guide/troubleshooting' },
    ],
  },
  {
    text: 'Components',
    items: [
      { text: 'Overview', link: '/components/' },
      { text: 'Map', link: '/components/map' },
      { text: 'MapFeatures', link: '/components/map-features' },
      { text: 'MapFeature', link: '/components/map-feature' },
      { text: 'MapMarker', link: '/components/map-marker' },
      { text: 'MapMesh', link: '/components/map-mesh' },
      { text: 'MapZoom', link: '/components/map-zoom' },
    ],
  },
  {
    text: 'Examples',
    items: [
      { text: 'Overview', link: '/examples' },
      ...examples.map((example) => ({
        text: example.title,
        link: example.docsPath,
      })),
    ],
  },
]

const apiSidebar = [
  {
    text: 'API',
    items: [
      { text: 'Core', link: '/api/core/' },
    ],
  },
]

export default defineConfig({
  base: process.env.VITEPRESS_BASE || '/',
  srcExclude: ['AGENTS.md', '**/AGENTS.md', '**/_*.md'],
  title: 'd3-maps',
  description: 'Reactive SVG maps powered by D3',
  head: [
    ['meta', { name: 'theme-color', content: '#ff6f26' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }],
    ['link', { rel: 'apple-touch-icon', sizes: '180x180', href: '/favicons/apple-touch-icon.png' }],
    ['link', { rel: 'icon', type: 'image/png', sizes: '96x96', href: '/favicons/favicon-96x96.png' }],
    ['link', { rel: 'manifest', href: '/favicons/site.webmanifest' }],
    ['link', { rel: 'shortcut icon', href: '/favicons/favicon.ico' }],
  ],
  themeConfig: {
    logo: '/d3-maps-logo.svg',
    nav: [
      { text: 'Guide', link: '/guide/' },
      { text: 'Examples', link: '/examples/' },
      { text: 'API', link: '/api/core' },
    ],
    sidebar: {
      '/api/': apiSidebar,
      '/': docsSidebar,
    },
    editLink: {
      pattern: 'https://github.com/souljorje/d3-maps/edit/main/packages/docs/:path',
      text: 'Edit this page on GitHub',
    },
    search: {
      provider: 'local',
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/souljorje/d3-maps' },
    ],
    footer: {
      message: 'MIT Licensed',
      copyright: 'Copyright © 2026-present Georgii Bukharov',
    },
    externalLinkIcon: true,
    examples,
  },
  vite: {
    plugins: [tailwindcss()],
    server: {
      fs: {
        allow: [REPO_ROOT],
      },
    },
    resolve: {
      dedupe: ['vue'],
      alias: {
        '@': REPO_ROOT,
        '@d3-maps/core/index.css': path.join(PACKAGES_DIR, 'core', 'src', 'index.css'),
        '@d3-maps/core': path.join(PACKAGES_DIR, 'core', 'src', 'index.ts'),
        '@d3-maps/vue': path.join(PACKAGES_DIR, 'vue', 'src', 'index.ts'),
      },
    },
  },
})
