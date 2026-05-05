import process from 'node:process'

const baseUrl = process.argv[2] || 'http://localhost:8888'

async function expectResponse(pathname, init, assert) {
  const response = await fetch(new URL(pathname, baseUrl), init)
  const body = await response.text()

  assert(response, body)
  console.log(`ok ${pathname}`)
}

await expectResponse('/', {}, (response) => {
  if (!response.ok) throw new Error(`Expected / to return 200, got ${response.status}`)

  const linkHeader = response.headers.get('link') || ''
  if (!linkHeader.includes('</.well-known/agent-skills/index.json>; rel=\"describedby\"')) {
    throw new Error('Missing agent-skills Link header on /')
  }
})

await expectResponse('/', {
  headers: { Accept: 'text/markdown' },
}, (response, body) => {
  const contentType = response.headers.get('content-type') || ''
  if (!contentType.includes('text/markdown')) {
    throw new Error(`Expected markdown content-type, got ${contentType || 'none'}`)
  }

  if (!body.includes('# d3-maps')) {
    throw new Error('Expected markdown body for /')
  }
})

await expectResponse('/index.html', {
  headers: { Accept: 'text/markdown' },
}, (response, body) => {
  const contentType = response.headers.get('content-type') || ''
  if (!contentType.includes('text/markdown')) {
    throw new Error(`Expected markdown content-type for /index.html, got ${contentType || 'none'}`)
  }

  if (!body.includes('# d3-maps')) {
    throw new Error('Expected markdown body for /index.html')
  }
})

await expectResponse('/robots.txt', {}, (_response, body) => {
  if (!body.includes('Content-Signal: ai-train=yes, search=yes, ai-input=yes')) {
    throw new Error('Missing Content-Signal in robots.txt')
  }
})

await expectResponse('/.well-known/agent-skills/index.json', {}, (response, body) => {
  const contentType = response.headers.get('content-type') || ''
  if (!contentType.includes('application/json')) {
    throw new Error(`Expected JSON content-type, got ${contentType || 'none'}`)
  }

  const json = JSON.parse(body)
  if (!Array.isArray(json.skills) || json.skills.length === 0) {
    throw new Error('Expected non-empty skills array')
  }
})
