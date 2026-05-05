import { toMarkdownPath } from '../../packages/docs/.vitepress/shared/markdown-path.js'

function acceptsMarkdown(request: Request): boolean {
  return request.headers.get('accept')?.includes('text/markdown') ?? false
}

function isPageRoute(pathname: string): boolean {
  // Rewrite only page-like routes; leave assets and well-known files alone.
  if (pathname === '/') return true
  if (pathname.startsWith('/.well-known/')) return false
  if (pathname.endsWith('/')) return true
  if (pathname.endsWith('.html')) return true

  const lastSegment = pathname.split('/').filter(Boolean).at(-1)
  if (!lastSegment) return false

  return !lastSegment.includes('.')
}

function withAcceptVary(response: Response): Response {
  const nextResponse = new Response(response.body, response)
  nextResponse.headers.append('Vary', 'Accept')
  return nextResponse
}

export default async function markdownNegotiation(
  request: Request,
  context: { next: (request?: Request) => Promise<Response> },
): Promise<Response> {
  if (!acceptsMarkdown(request) || !['GET', 'HEAD'].includes(request.method)) {
    return context.next()
  }

  const url = new URL(request.url)
  if (!isPageRoute(url.pathname)) {
    return withAcceptVary(await context.next())
  }

  const markdownUrl = new URL(toMarkdownPath(url.pathname), url)
  markdownUrl.search = url.search

  const markdownResponse = await context.next(new Request(markdownUrl, {
    headers: request.headers,
    method: request.method,
  }))

  if (markdownResponse.status === 404) {
    // If no markdown sibling exists, fall back to the original page response.
    return withAcceptVary(await context.next())
  }

  return withAcceptVary(markdownResponse)
}
