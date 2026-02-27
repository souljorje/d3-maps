import fs from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'

const REPO_ROOT = process.cwd()

function isExternalHref(href) {
  return /^(https?:|mailto:|tel:)/i.test(href)
}

function stripQueryAndHash(href) {
  const q = href.indexOf('?')
  const h = href.indexOf('#')
  const cut = Math.min(q === -1 ? href.length : q, h === -1 ? href.length : h)
  return href.slice(0, cut)
}

function toPosix(p) {
  return p.split(path.sep).join('/')
}

async function fileExists(p) {
  try {
    const st = await fs.stat(p)
    return st.isFile() || st.isDirectory()
  } catch {
    return false
  }
}

async function listFiles() {
  // Keep this explicit and predictable: these are the repo’s “knowledge base” entrypoints.
  const globs = [
    'AGENTS.md',
    '.github/AGENTS.md',
    '.agents/references',
    '.agents/specs',
    '.agents/skills/doc-gardening',
    'packages',
  ]

  /** @type {string[]} */
  const results = []

  async function walkDir(dir) {
    const entries = await fs.readdir(dir, { withFileTypes: true })
    for (const entry of entries) {
      const abs = path.join(dir, entry.name)
      const rel = path.relative(REPO_ROOT, abs)

      if (entry.isDirectory()) {
        // Skip common noisy dirs if present
        if (entry.name === 'node_modules' || entry.name === 'dist' || entry.name === '.turbo')
          continue
        await walkDir(abs)
        continue
      }

      if (!entry.isFile())
        continue

      // Skills bundles often contain example links that do not resolve in this repo.
      // Keep validation focused on repo-owned knowledge, plus explicitly-owned skills.
      if (rel.startsWith('.agents/skills/') && !rel.startsWith('.agents/skills/doc-gardening/'))
        continue

      if (entry.name === 'AGENTS.md' || entry.name.endsWith('.md'))
        results.push(rel)
    }
  }

  for (const g of globs) {
    const abs = path.join(REPO_ROOT, g)
    if (!await fileExists(abs))
      continue
    const st = await fs.stat(abs)
    if (st.isDirectory())
      await walkDir(abs)
    else
      results.push(g)
  }

  // De-dupe + stable order for deterministic output
  return Array.from(new Set(results)).sort()
}

function extractMarkdownLinks(markdown) {
  // Basic markdown link extractor: [text](href). Good enough for repo-authored docs.
  /** @type {{ href: string, index: number }[]} */
  const links = []
  const re = /\[[^\]]+\]\(([^)]+)\)/g
  let m
  while ((m = re.exec(markdown)) !== null) {
    links.push({ href: m[1].trim(), index: m.index })
  }
  return links
}

async function validateLinks(files) {
  /** @type {{ file: string, href: string, resolved: string }[]} */
  const broken = []

  for (const file of files) {
    const abs = path.join(REPO_ROOT, file)
    const markdown = await fs.readFile(abs, 'utf8')
    const dir = path.dirname(abs)
    const isDocs = toPosix(file).startsWith('packages/docs/')

    for (const { href } of extractMarkdownLinks(markdown)) {
      if (!href || href === '#')
        continue
      if (isExternalHref(href))
        continue

      const noHash = stripQueryAndHash(href)
      if (!noHash)
        continue

      // Ignore pure anchors like (#section)
      if (noHash.startsWith('#'))
        continue

      const decoded = decodeURI(noHash)

      // VitePress route links (site paths) are common in docs: map to files under packages/docs.
      if (decoded.startsWith('/') && isDocs) {
        const route = decoded.replace(/^\/+/, '')
        const routePath = route === '' ? 'index.md' : route.endsWith('/') ? `${route}index.md` : `${route}.md`
        const docsTargetAbs = path.join(REPO_ROOT, 'packages/docs', routePath)
        if (!await fileExists(docsTargetAbs)) {
          broken.push({
            file,
            href,
            resolved: toPosix(path.relative(REPO_ROOT, docsTargetAbs)),
          })
        }
        continue
      }

      // For non-doc files, treat /foo as repo-root relative.
      const isRepoRootAbs = decoded.startsWith('/')
      const baseAbs = isRepoRootAbs ? REPO_ROOT : dir
      const rawTargetAbs = isRepoRootAbs
        ? path.join(REPO_ROOT, decoded.slice(1))
        : path.resolve(dir, decoded)

      // For VitePress docs, links commonly omit extensions. Resolve those heuristically.
      const candidates = []
      candidates.push(rawTargetAbs)

      if (isDocs && !path.extname(decoded) && !decoded.endsWith('/')) {
        candidates.push(path.resolve(baseAbs, `${decoded}.md`))
        candidates.push(path.resolve(baseAbs, decoded, 'index.md'))
      }

      const ok = (await Promise.all(candidates.map(fileExists))).some(Boolean)
      if (!ok) {
        broken.push({
          file,
          href,
          resolved: toPosix(path.relative(REPO_ROOT, rawTargetAbs)),
        })
      }
    }
  }

  return broken
}

async function validateGitWorkflowHooksDoc() {
  const pkgPath = path.join(REPO_ROOT, 'package.json')
  const docPath = path.join(REPO_ROOT, '.agents/references/git-workflow.md')

  if (!await fileExists(pkgPath) || !await fileExists(docPath))
    return []

  const pkg = JSON.parse(await fs.readFile(pkgPath, 'utf8'))
  const hooks = Object.keys(pkg['simple-git-hooks'] || {}).sort()

  const doc = await fs.readFile(docPath, 'utf8')
  const docHooks = Array.from(doc.matchAll(/^\|\s*(pre-[a-z-]+)\s*\|/gim)).map((m) => m[1]).sort()

  const missingInDoc = hooks.filter((h) => !docHooks.includes(h))
  const extraInDoc = docHooks.filter((h) => !hooks.includes(h))

  /** @type {{ kind: string, detail: string }[]} */
  const problems = []
  if (missingInDoc.length)
    problems.push({ kind: 'git-workflow', detail: `Missing hooks in doc: ${missingInDoc.join(', ')}` })
  if (extraInDoc.length)
    problems.push({ kind: 'git-workflow', detail: `Doc mentions non-existent hooks: ${extraInDoc.join(', ')}` })

  return problems
}

const files = await listFiles()
const brokenLinks = await validateLinks(files)
const hookDocProblems = await validateGitWorkflowHooksDoc()

let hasProblems = false

if (brokenLinks.length) {
  hasProblems = true
  console.error('Broken markdown links:')
  for (const b of brokenLinks)
    console.error(`- ${b.file}: ${b.href} -> ${b.resolved}`)
  console.error('')
}

if (hookDocProblems.length) {
  hasProblems = true
  console.error('Doc drift checks:')
  for (const p of hookDocProblems)
    console.error(`- ${p.kind}: ${p.detail}`)
  console.error('')
}

if (hasProblems) {
  console.error('agents-check failed.')
  process.exitCode = 1
} else {
  console.log('agents-check ok.')
}
