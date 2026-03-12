import type { InjectionKey } from 'vue'

import { inject } from 'vue'

export const insideZoomKey: InjectionKey<boolean> = Symbol('InsideZoom')

export function useInsideZoom(): boolean {
  return inject(insideZoomKey, false)
}
