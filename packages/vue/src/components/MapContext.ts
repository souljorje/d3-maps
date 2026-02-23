import type { MapContext } from '@d3-maps/core'
import type { PropType } from 'vue'

import {
  defineComponent,
  provide,
} from 'vue'

import { mapContextKey } from '../hooks/useMapContext'

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
