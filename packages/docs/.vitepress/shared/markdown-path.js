export function normalizeDocsPath(pathname) {
  if (!pathname || pathname === '/') return '/'
  return pathname.replace(/\/+$/, '') || '/'
}

export function toMarkdownPath(pathname) {
  const normalizedPath = normalizeDocsPath(pathname)
  if (normalizedPath === '/') return '/index.md'

  const withoutLeadingSlash = normalizedPath
    .replace(/^\/+/, '')
    .replace(/\.html$/, '')

  return `/${withoutLeadingSlash}.md`
}
