import type { MapContext } from '@d3-maps/core'
import type { InjectionKey, PropType } from 'vue'

import {
  defineComponent,
  inject,
  provide,
} from 'vue'

const mapContextKey: InjectionKey<MapContext> = Symbol('MapContext')

export const MapProvider = defineComponent(
  (props, { slots }) => {
    provide(mapContextKey, props.context)
    return () => slots.default?.() ?? null
  },
  {
    props: {
      context: {
        type: Object as PropType<MapContext>,
        required: true,
      },
    },
  },
)

export const MapConsumer = defineComponent({
  name: 'MapConsumer',
  setup(_, { slots }) {
    const context = inject(mapContextKey)
    return () => {
      if (!slots.default) return null
      return slots.default(context ?? ({} as MapContext))
    }
  },
})

export function useMapContext(): MapContext | undefined {
  return inject(mapContextKey)
}
