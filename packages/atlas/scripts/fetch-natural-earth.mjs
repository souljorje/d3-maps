import { access } from 'node:fs/promises'

import { exec, fileUrl } from './utils.mjs'

const repoUrl = 'https://github.com/nvkelso/natural-earth-vector.git'
const target = fileUrl('data/raw/natural-earth-vector').pathname

async function exists(path) {
  try {
    await access(path)
    return true
  } catch {
    return false
  }
}

if (await exists(target)) {
  await exec('git', ['-C', target, 'pull', '--ff-only'])
} else {
  await exec('git', [
    'clone',
    '--depth',
    '1',
    '--filter=blob:none',
    '--sparse',
    repoUrl,
    target,
  ])

  await exec('git', [
    '-C',
    target,
    'sparse-checkout',
    'set',
    '110m_cultural',
    '50m_cultural',
    '10m_cultural',
  ])
}
