import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vitepress'
import llmstxt from 'vitepress-plugin-llms'
import { tabsMarkdownPlugin } from 'vitepress-plugin-tabs'

const REPO_ROOT = fileURLToPath(new URL('../../..', import.meta.url))
const PACKAGES_DIR = path.join(REPO_ROOT, 'packages')
const SITE_BASE = process.env.VITEPRESS_BASE || '/'
const SITE_URL = (process.env.VITEPRESS_SITE_URL || process.env.URL || process.env.DEPLOY_PRIME_URL)?.replace(/\/$/, '')
const SITEMAP_HOSTNAME = SITE_URL ? `${SITE_URL}/` : null
const DEFAULT_SITE_DESCRIPTION = 'Interactive SVG maps for React and Vue. Choropleths, markers, lines, zoom and more. Powered by D3.'

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

function withBase(assetPath) {
  return `${SITE_BASE.replace(/\/?$/, '/')}${assetPath.replace(/^\/+/, '')}`
}

function toCanonicalUrl(relativePath) {
  if (!SITE_URL) return null

  const canonicalPath = relativePath
    .replace(/(^|\/)index\.md$/, '$1')
    .replace(/\.md$/, '.html')

  return canonicalPath ? `${SITE_URL}/${canonicalPath}` : `${SITE_URL}/`
}

function toAbsoluteSiteUrl(assetPath) {
  if (!SITE_URL) return null
  return `${SITE_URL}/${assetPath.replace(/^\/+/, '')}`
}

function createHomeStructuredData() {
  if (!SITE_URL) return null

  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareSourceCode',
    name: 'd3-maps',
    description: DEFAULT_SITE_DESCRIPTION,
    url: `${SITE_URL}/`,
    codeRepository: 'https://github.com/souljorje/d3-maps',
    programmingLanguage: ['TypeScript', 'JavaScript'],
    applicationCategory: 'DeveloperApplication',
    license: 'https://opensource.org/license/mit/',
  }
}

function resolveMetaTitle(pageData) {
  if (pageData.frontmatter.layout === 'home')
    return 'Interactive SVG maps for React and Vue · d3-maps'

  return pageData.title
    ? `${pageData.title} · d3-maps`
    : 'd3-maps'
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

function sanitizeSidebarItems(items) {
  return items
    .map((item) => {
      if (!item.link && !item.items) return null
      if (item.link?.includes('#')) return null
      if (item.link?.startsWith('/examples/') && item.link !== '/examples') return null
      // The LLM plugin resolves sidebar links against markdown source pages only
      if (item.link?.endsWith('.txt')) return null

      if (!item.items) return item

      const nestedItems = sanitizeSidebarItems(item.items)
      if (nestedItems.length === 0 && !item.link) return null

      return {
        ...item,
        items: nestedItems,
      }
    })
    .filter(Boolean)
}

const docsSidebar = [
  {
    text: 'Guide',
    items: [
      { text: 'Get Started', link: '/guide/' },
      { text: 'Core Concepts',
        link: '/guide/core-concepts/',
        collapsed: true,
        items: [
          { text: 'Data', link: '/guide/core-concepts#data' },
          { text: 'Data transformation', link: '/guide/core-concepts#data-transformation' },
          { text: 'Projection', link: '/guide/core-concepts#projection' },
          { text: 'Features', link: '/guide/core-concepts#features' },
          { text: 'Mesh', link: '/guide/core-concepts#mesh' },
          { text: 'Sphere and Graticule', link: '/guide/core-concepts#sphere-and-graticule' },
          { text: 'Zoom', link: '/guide/core-concepts#zoom' },
          { text: 'Markers', link: '/guide/core-concepts#markers' },
          { text: 'Styling', link: '/guide/core-concepts#styling' },
          { text: 'Responsiveness', link: '/guide/core-concepts#responsiveness' },
        ] },
      { text: 'Atlas', link: '/guide/atlas' },
      { text: 'Architecture', link: '/guide/architecture' },
      { text: 'Troubleshooting', link: '/guide/troubleshooting' },
      { text: 'Migrate from react-simple-maps', link: '/guide/migration-from-react-simple-maps' },
    ],
  },
  {
    text: 'Components',
    collapsed: true,
    items: [
      { text: 'Overview', link: '/components/' },
      { text: 'MapBase', link: '/components/map-base' },
      { text: 'MapFeatures', link: '/components/map-features' },
      { text: 'MapFeature', link: '/components/map-feature' },
      { text: 'MapElement', link: '/components/map-element' },
      { text: 'MapAnnotation', link: '/components/map-annotation' },
      { text: 'MapLine', link: '/components/map-line' },
      { text: 'MapMarker', link: '/components/map-marker' },
      { text: 'MapMesh', link: '/components/map-mesh' },
      { text: 'MapGraticule', link: '/components/map-graticule' },
      { text: 'MapZoom', link: '/components/map-zoom' },
    ],
  },
  {
    text: 'Helpers',
    collapsed: true,
    items: [
      { text: 'Overview', link: '/helpers/' },
      { text: 'useCreateMapContext', link: '/helpers/use-create-map-context' },
      { text: 'useMapContext', link: '/helpers/use-map-context' },
      { text: 'useMapZoom', link: '/helpers/use-map-zoom' },
      { text: 'useInteraction', link: '/helpers/use-interaction' },
      { text: 'getFeatureKey', link: '/helpers/get-feature-key' },
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
  {
    text: 'API',
    items: [
      { text: 'Core', link: '/api/core/' },
    ],
  },
  {
    text: 'LLMs',
    items: [
      { text: 'llms.txt', link: '/llms.txt' },
      { text: 'llms-full.txt', link: '/llms-full.txt' },
    ],
  },
]

const llmsSidebar = [
  { text: 'Home', link: '/' },
  ...sanitizeSidebarItems(docsSidebar),
]

export default defineConfig({
  base: SITE_BASE,
  srcExclude: ['AGENTS.md', '**/AGENTS.md', '**/_*.md'],
  title: 'd3-maps',
  titleTemplate: ':title · d3-maps',
  cleanUrls: true,
  description: DEFAULT_SITE_DESCRIPTION,
  ...(SITEMAP_HOSTNAME
    ? {
        sitemap: {
          hostname: SITEMAP_HOSTNAME,
        },
      }
    : {}),
  head: [
    ['meta', { name: 'theme-color', content: '#ff6f26' }],
    ['meta', { name: 'mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:site_name', content: 'd3-maps' }],
    ['meta', { property: 'og:image', content: toAbsoluteSiteUrl('/d3-maps-logo.svg') || withBase('/d3-maps-logo.svg') }],
    ['meta', { property: 'og:image:alt', content: 'd3-maps logo' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:image', content: toAbsoluteSiteUrl('/d3-maps-logo.svg') || withBase('/d3-maps-logo.svg') }],
    ['meta', { name: 'twitter:image:alt', content: 'd3-maps logo' }],
    ['link', { rel: 'apple-touch-icon', sizes: '180x180', href: withBase('/favicons/apple-touch-icon.png') }],
    ['link', { rel: 'icon', type: 'image/png', sizes: '96x96', href: withBase('/favicons/favicon-96x96.png') }],
    ['link', { rel: 'manifest', href: withBase('/favicons/site.webmanifest') }],
    ['link', { rel: 'shortcut icon', href: withBase('/favicons/favicon.ico') }],
  ],
  transformPageData(pageData) {
    const canonicalUrl = toCanonicalUrl(pageData.relativePath)
    const pageTitle = resolveMetaTitle(pageData)
    const pageDescription = pageData.description || pageData.frontmatter.description || DEFAULT_SITE_DESCRIPTION

    pageData.frontmatter.head ??= []
    if (canonicalUrl) {
      pageData.frontmatter.head.push(['link', { rel: 'canonical', href: canonicalUrl }])
    }

    pageData.frontmatter.head.push(['meta', { property: 'og:title', content: pageTitle }])
    pageData.frontmatter.head.push(['meta', { property: 'og:description', content: pageDescription }])
    pageData.frontmatter.head.push(['meta', { name: 'twitter:title', content: pageTitle }])
    pageData.frontmatter.head.push(['meta', { name: 'twitter:description', content: pageDescription }])

    if (canonicalUrl) {
      pageData.frontmatter.head.push(['meta', { property: 'og:url', content: canonicalUrl }])
    }
  },
  transformHead({ page }) {
    if (!SITE_URL || page !== 'index.md') return []

    const structuredData = createHomeStructuredData()
    if (!structuredData) return []

    return [
      ['script', { type: 'application/ld+json' }, JSON.stringify(structuredData)],
    ]
  },
  buildEnd(siteConfig) {
    if (!SITE_URL) return

    const robots = `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`
    fs.writeFileSync(path.join(siteConfig.outDir, 'robots.txt'), robots)
  },
  themeConfig: {
    logo: '/d3-maps-logo.svg',
    nav: [
      { text: 'Guide', link: '/guide/' },
      { text: 'Examples', link: '/examples/' },
      { text: 'API', link: '/api/core/' },
    ],
    sidebar: {
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
  markdown: {
    config(md) {
      md.use(tabsMarkdownPlugin)
    },
  },
  vite: {
    plugins: [
      tailwindcss(),
      llmstxt({
        domain: SITE_URL,
        injectLLMHint: false,
        excludeIndexPage: false,
        ignoreFiles: ['AGENTS.md', '**/AGENTS.md', '**/_*.md'],
        ignoreFilesPerOutput: {
          llmsTxt: ['examples/*.md', 'api/core/**'],
          llmsFullTxt: ['examples/*.md', 'api/core/**'],
          pages: ['examples/*.md', 'api/core/**'],
        },
        customLLMsTxtTemplate: '# {title}\n\n{description}\n\n## Table of Contents\n\n{toc}\n',
        sidebar: llmsSidebar,
      }),
    ],
    server: {
      fs: {
        allow: [REPO_ROOT],
      },
    },
    resolve: {
      dedupe: ['vue'],
      alias: [
        {
          find: '@',
          replacement: REPO_ROOT,
        },
        {
          find: /^@d3-maps\/(\w+)\/(.+)$/,
          replacement: `${PACKAGES_DIR.replace(/\\/g, '/')}/$1/src/$2`,
        },
        {
          find: /^@d3-maps\/(\w+)$/,
          replacement: `${PACKAGES_DIR.replace(/\\/g, '/')}/$1/src/index.ts`,
        },
      ],
    },
  },
})
