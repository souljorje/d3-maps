import type { ReactElement } from 'react'

import { act } from 'react'
import { createRoot } from 'react-dom/client'

interface RenderResult {
  container: HTMLDivElement
  unmount: () => void
}

export function render(ui: ReactElement): RenderResult {
  const container = document.createElement('div')
  document.body.append(container)

  const root = createRoot(container)

  act(() => {
    root.render(ui)
  })

  return {
    container,
    unmount: () => {
      act(() => {
        root.unmount()
      })
      container.remove()
    },
  }
}
