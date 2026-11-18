import type { JSX } from '@solidjs/web'

import type { MapSphereProps } from '../types'

import { renderSphere } from '@d3-maps/core'
import { createMemo, createUniqueId, omit, Show } from 'solid-js'

import { useMapContext } from '../context'

export function MapSphere(props: MapSphereProps): JSX.Element {
  const context = useMapContext()
  const clipId = `d3m-sphere-${createUniqueId()}`
  const d = createMemo(() => renderSphere(context()) ?? undefined)
  const attributes = omit(props, 'noClip', 'fill', 'stroke', 'children')

  return (
    <g data-d3m="sphere" {...attributes}>
      <Show when={!props.noClip}>
        <defs><clipPath id={clipId}><path d={d()} /></clipPath></defs>
      </Show>
      <path d={d()} data-d3m="sphere-background" fill={props.fill ?? 'none'} pointer-events="none" stroke="none" />
      <g clip-path={props.noClip ? undefined : `url(#${clipId})`} data-d3m="sphere-content">
        {props.children}
      </g>
      <path d={d()} data-d3m="sphere-border" fill="none" pointer-events="none" stroke={props.stroke ?? 'none'} />
    </g>
  )
}
