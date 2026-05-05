import { toMarkdownPath } from '../shared/markdown-path'

const WEB_MCP_ABORT_CONTROLLER = '__d3MapsWebMcpAbortController'

async function readMarkdown(pathname) {
  const markdownPath = toMarkdownPath(pathname)
  const response = await fetch(markdownPath, {
    headers: { Accept: 'text/markdown' },
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch ${markdownPath}`)
  }

  return {
    url: new URL(markdownPath, window.location.origin).toString(),
    markdown: await response.text(),
  }
}

function registerTool(modelContext, controller, tool) {
  modelContext.registerTool(tool, { signal: controller.signal })
}

export function registerWebMcpTools(router) {
  if (typeof window === 'undefined') return

  const { modelContext } = window.navigator
  if (!modelContext?.registerTool) return

  window[WEB_MCP_ABORT_CONTROLLER]?.abort()
  const controller = new AbortController()
  window[WEB_MCP_ABORT_CONTROLLER] = controller

  registerTool(modelContext, controller, {
    name: 'open_docs_page',
    description: 'Open a d3-maps documentation page on this site.',
    inputSchema: {
      type: 'object',
      properties: {
        path: {
          type: 'string',
          description: 'Same-site docs path like /guide, /examples/markers, or /api/core.',
        },
      },
      required: ['path'],
      additionalProperties: false,
    },
    execute: async ({ path }) => {
      const url = new URL(path, window.location.origin)
      if (url.origin !== window.location.origin) {
        throw new Error('Only same-site paths are supported')
      }

      const nextPath = url.pathname + url.search + url.hash
      router.go(nextPath)
      return { url: new URL(nextPath, window.location.origin).toString() }
    },
  })

  registerTool(modelContext, controller, {
    name: 'read_docs_markdown',
    description: 'Read the markdown version of the current or requested d3-maps docs page.',
    inputSchema: {
      type: 'object',
      properties: {
        path: {
          type: 'string',
          description: 'Optional same-site docs path. Defaults to the current page.',
        },
      },
      additionalProperties: false,
    },
    annotations: { readOnlyHint: true },
    execute: async ({ path } = {}) => readMarkdown(path || window.location.pathname),
  })

  registerTool(modelContext, controller, {
    name: 'read_llms_index',
    description: 'Read the site llms index for d3-maps docs.',
    inputSchema: {
      type: 'object',
      properties: {
        full: {
          type: 'boolean',
          description: 'When true, fetch llms-full.txt. Otherwise fetch llms.txt.',
        },
      },
      additionalProperties: false,
    },
    annotations: { readOnlyHint: true },
    execute: async ({ full = false } = {}) => {
      const pathname = full ? '/llms-full.txt' : '/llms.txt'
      const response = await fetch(pathname)

      if (!response.ok) {
        throw new Error(`Failed to fetch ${pathname}`)
      }

      return {
        url: new URL(pathname, window.location.origin).toString(),
        content: await response.text(),
      }
    },
  })

  window.addEventListener('beforeunload', () => window[WEB_MCP_ABORT_CONTROLLER]?.abort(), { once: true })
}
