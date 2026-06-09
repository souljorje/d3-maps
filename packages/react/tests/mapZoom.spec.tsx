import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest'

import type {
  MapContext,
  ZoomCommands,
  ZoomEvent,
  ZoomObject,
} from '@d3-maps/core'
import type {
  ComponentProps,
  RefObject,
} from 'react'

import type { MapZoomRef } from '../src/hooks/useMapZoom'

import {
  getFeatureZoomTransform,
  zoomIdentity,
} from '@d3-maps/core'
import {
  render,
  screen,
} from '@testing-library/react'
import {
  useContext,
  useRef,
} from 'react'

import { MapBase } from '../src/components/MapBase'
import { MapFeature } from '../src/components/MapFeature'
import { MapZoom } from '../src/components/MapZoom'
import { MapZoomContextValue, useMapZoom } from '../src/hooks/useMapZoom'
import { sampleGeoJson } from './fixtures'

const useInteractionSpy = vi.hoisted(() => vi.fn())

vi.mock('../src/hooks/useInteraction', async () => {
  const actual = await vi.importActual<typeof import('../src/hooks/useInteraction')>('../src/hooks/useInteraction')

  return {
    ...actual,
    useInteraction: (...args: Parameters<typeof actual.useInteraction>) => {
      useInteractionSpy(...args)
      return actual.useInteraction(...args)
    },
  }
})

const emptyFeature: ZoomObject = {
  type: 'Feature',
  properties: {},
  geometry: {
    type: 'Polygon',
    coordinates: [
      [
        [0, 0],
        [0, 0],
        [0, 0],
        [0, 0],
      ],
    ],
  },
} as const

describe('mapZoom', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('does not provide zoom context outside MapZoom', () => {
    let captured: unknown

    function Probe() {
      captured = useContext(MapZoomContextValue)
      return null
    }

    render(
      <MapBase fit={sampleGeoJson}>
        <Probe />
      </MapBase>,
    )

    expect(captured).toBe(false)
  })

  it('provides map zoom context for descendants', () => {
    let captured: unknown

    function Probe() {
      captured = useContext(MapZoomContextValue)
      return null
    }

    render(
      <MapBase fit={sampleGeoJson}>
        <MapZoom>
          <Probe />
        </MapZoom>
      </MapBase>,
    )

    expect(captured).toBe(true)
  })

  it('wires zoom behavior and forwards native D3 zoom events', () => {
    const onZoomStart = vi.fn()
    const onZoom = vi.fn()
    const onZoomEnd = vi.fn()
    const {
      zoomRef,
      zoomGroup,
    } = renderZoom({
      minZoom: 1,
      maxZoom: 6,
      config: { scaleExtent: [[1, 6]] },
      onZoomStart,
      onZoom,
      onZoomEnd,
    })

    expect(zoomRef.current?.zoomBehavior.scaleExtent()).toEqual([1, 6])

    const transform = zoomIdentity.scale(2)
    const event = {
      sourceEvent: new Event('wheel'),
      transform,
    } as ZoomEvent

    emitZoomEvent(zoomRef, 'start', event)
    emitZoomEvent(zoomRef, 'zoom', event)
    emitZoomEvent(zoomRef, 'end', event)

    expect(onZoomStart).toHaveBeenCalledWith(event)
    expect(onZoom).toHaveBeenCalledWith(event)
    expect(onZoomEnd).toHaveBeenCalledWith(event)
    expect(zoomGroup.getAttribute('transform')).toBe(transform.toString())
  })

  it('exposes transform and applies a native D3 zoom transform', () => {
    const {
      zoomRef,
      zoomGroup,
    } = renderZoom()
    const transform = zoomIdentity.translate(10, 20).scale(3)

    zoomRef.current?.transform(transform, undefined, false)

    expect(zoomGroup.getAttribute('transform')).toBe(transform.toString())
  })

  it('exposes scaleWith and scaleTo through D3 scale helpers', () => {
    const {
      zoomRef,
      zoomGroup,
    } = renderZoom()

    zoomRef.current?.scaleWith(0.5, undefined, false)
    expectScale(zoomGroup, 1.5)

    zoomRef.current?.scaleTo(3, undefined, false)
    expectScale(zoomGroup, 3)
  })

  it('proxies zoom commands through useMapZoom', () => {
    let zoom: ZoomCommands | undefined

    function Probe() {
      const zoomRef = useRef<MapZoomRef | null>(null)
      zoom = useMapZoom(zoomRef)

      return (
        <MapZoom
          ref={zoomRef}
          data-testid="map-zoom-group"
        />
      )
    }

    render(
      <MapBase fit={sampleGeoJson}>
        <Probe />
      </MapBase>,
    )

    const transform = zoomIdentity.scale(2.5)
    zoom?.transform(transform, undefined, false)

    expect(screen.getByTestId('map-zoom-group').getAttribute('transform')).toBe(transform.toString())
  })

  it('exposes zoomToFeature and resolves the feature transform through core', () => {
    const {
      context,
      zoomRef,
      zoomGroup,
    } = renderZoom()
    const feature = sampleGeoJson.features[0]
    const expectedTransform = getFeatureZoomTransform(context, feature, {
      minZoom: 1,
      maxZoom: 8,
      padding: 12,
    })

    expect(expectedTransform).toBeDefined()
    expect(zoomRef.current?.zoomToFeature(feature, {
      padding: 12,
      transition: false,
    })).toBe(true)
    expect(zoomGroup.getAttribute('transform')).toBe(expectedTransform?.toString())
  })

  it('returns false when zoomToFeature cannot resolve a transform', () => {
    const {
      zoomRef,
      zoomGroup,
    } = renderZoom()

    expect(zoomRef.current?.zoomToFeature(emptyFeature)).toBe(false)
    expect(zoomGroup.getAttribute('transform')).toBeNull()
  })

  it('exposes reset and applies the identity transform', () => {
    const {
      zoomRef,
      zoomGroup,
    } = renderZoom()

    zoomRef.current?.transform(zoomIdentity.translate(10, 20).scale(3), undefined, false)
    zoomRef.current?.reset(false)

    expect(zoomGroup.getAttribute('transform')).toBe(zoomIdentity.toString())
  })

  it('changing zoom props does not rerender stable feature children that only need zoom presence', () => {
    const { rerender } = render(
      <MapBase fit={sampleGeoJson}>
        <MapZoom minZoom={1}>
          <MapFeature d="M0,0L10,0" />
        </MapZoom>
      </MapBase>,
    )

    expect(useInteractionSpy).toHaveBeenCalledTimes(1)

    rerender(
      <MapBase fit={sampleGeoJson}>
        <MapZoom minZoom={2}>
          <MapFeature d="M0,0L10,0" />
        </MapZoom>
      </MapBase>,
    )

    expect(useInteractionSpy).toHaveBeenCalledTimes(1)
  })
})

function renderZoom(
  props: Partial<ComponentProps<typeof MapZoom>> = {},
): {
  context: MapContext
  zoomRef: RefObject<MapZoomRef | null>
  zoomGroup: SVGElement
} {
  let context: MapContext | undefined
  let zoomRef: RefObject<MapZoomRef | null> | undefined

  function Probe() {
    zoomRef = useRef<MapZoomRef | null>(null)

    return (
      <MapZoom
        ref={zoomRef}
        data-testid="map-zoom-group"
        {...props}
      />
    )
  }

  render(
    <MapBase fit={sampleGeoJson}>
      {(mapContext) => {
        context = mapContext
        return <Probe />
      }}
    </MapBase>,
  )

  return {
    context: context as MapContext,
    zoomRef: zoomRef as RefObject<MapZoomRef | null>,
    zoomGroup: getZoomGroup(),
  }
}

function emitZoomEvent(
  zoomRef: RefObject<MapZoomRef | null>,
  type: 'start' | 'zoom' | 'end',
  event: ZoomEvent,
): void {
  const listener = zoomRef.current?.zoomBehavior.on(type) as ((event: ZoomEvent) => void) | undefined
  listener?.(event)
}

function expectScale(element: Element, scale: number): void {
  const match = element.getAttribute('transform')?.match(/scale\(([^)]+)\)/)
  expect(Number(match?.[1])).toBeCloseTo(scale)
}

function getZoomGroup(): SVGElement {
  const element = screen.getByTestId('map-zoom-group')
  if (!(element instanceof SVGElement)) {
    throw new TypeError('Expected map zoom group to be an SVG element')
  }

  return element
}
