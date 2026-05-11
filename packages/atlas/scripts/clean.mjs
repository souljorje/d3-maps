import { rm } from 'node:fs/promises'

import { fileUrl } from './utils.mjs'

await rm(fileUrl('dist'), { force: true, recursive: true })
