import { transform } from '@solidjs/compiler'

interface CompilerPlugin {
  name: string
  enforce: 'pre'
  transform: {
    order: 'pre'
    handler: (code: string, id: string) => { code: string, map: string | null } | undefined
  }
}

/** Solid 2's compiler contract is shared by the neutral library build and both test targets. */
export function solidCompiler(generate: 'dom' | 'ssr', dev = false): CompilerPlugin {
  return {
    name: `d3-maps-solid-${generate}`,
    enforce: 'pre',
    transform: {
      order: 'pre',
      handler(code, id) {
        if (!/\.tsx$/.test(id)) return
        const result = transform(code, { filename: id, generate, hydratable: true, dev, sourceMap: true })
        return { code: result.code, map: result.map ?? null }
      },
    },
  }
}
