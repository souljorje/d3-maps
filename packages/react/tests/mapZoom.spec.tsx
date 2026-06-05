import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest'

import type {
  ZoomBehaviorOptions,
  ZoomTransform,
} from '@d3-maps/core'
import type { RefObject } from 'react'

import type { MapZoomHandle } from '../src/components/MapZoom'

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
import { MapZoomContextValue } from '../src/hooks/internal/mapZoomContext'
import { sampleGeoJson } from './fixtures'

const setupZoomSpy = vi.hoisted(() => vi.fn())
const applyZoomTransformSpy = vi.hoisted(() => vi.fn(() => true))
const getFeatureZoomTransformSpy = vi.hoisted(() => vi.fn())
const scaleToSpy = vi.hoisted(() => vi.fn(() => true))
let zoomBehaviorOptions: ZoomBehaviorOptions | undefined
const useMapObjectSpy = vi.hoisted(() => vi.fn())

interface ApplyZoomTransformOptions {
  element: SVGElement | null | undefined
  behavior: unknown
  transform: ZoomTransform
  transition?: false | unknown
}

interface ScaleToOptions {
  element: SVGElement | null | undefined
  behavior: unknown
  scale: number
  transition?: false | unknown
}

vi.mock('@d3-maps/core', async () => {
  const actual = await vi.importActual<typeof import('@d3-maps/core')>('@d3-maps/core')

  return {
    ...actual,
    setupZoom: (...args: Parameters<typeof actual.setupZoom>) => {
      setupZoomSpy(...args)
    },
    applyZoomTransform: (options: ApplyZoomTransformOptions) => {
      return applyZoomTransformSpy(options)
    },
    scaleTo: (options: ScaleToOptions) => {
      return scaleToSpy(options)
    },
    getFeatureZoomTransform: (
      context: unknown,
      feature: unknown,
      options: unknown,
    ) => getFeatureZoomTransformSpy(context, feature, options),
    createZoomBehavior: (
      _context: Parameters<typeof actual.createZoomBehavior>[0],
      options: Parameters<typeof actual.createZoomBehavior>[1],
    ) => {
      zoomBehaviorOptions = options
      return {} as any
    },
  }
})

vi.mock('../src/hooks/useMapObject', async () => {
  const actual = await vi.importActual<typeof import('../src/hooks/useMapObject')>('../src/hooks/useMapObject')

  return {
    ...actual,
    useMapObject: (...args: Parameters<typeof actual.useMapObject>) => {
      useMapObjectSpy(...args)
      return actual.useMapObject(...args)
    },
  }
})

describe('mapZoom', () => {
  beforeEach(() => {
    setupZoomSpy.mockClear()
    applyZoomTransformSpy.mockClear()
    applyZoomTransformSpy.mockReturnValue(true)
    getFeatureZoomTransformSpy.mockClear()
    getFeatureZoomTransformSpy.mockReturnValue(undefined)
    scaleToSpy.mockClear()
    scaleToSpy.mockReturnValue(true)
    useMapObjectSpy.mockClear()
    zoomBehaviorOptions = undefined
  })

  it('does not provide zoom context outside MapZoom', () => {
    function Probe() {
      return <text data-testid="zoom-value">{String(useContext(MapZoomContextValue))}</text>
    }

    render(
      <MapBase data={sampleGeoJson}>
        <Probe />
      </MapBase>,
    )

    expect(screen.getByTestId('zoom-value').textContent).toBe('undefined')
  })

  it('wires zoom setup and forwards native D3 zoom events', () => {
    const onZoomStart = vi.fn()
    const onZoom = vi.fn()
    const onZoomEnd = vi.fn()
    const config = { scaleExtent: [[1, 6]] as [[number, number]] }

    render(
      <MapBase data={sampleGeoJson}>
        <MapZoom
          data-testid="map-zoom-group"
          minZoom={1}
          maxZoom={6}
          config={config}
          onZoomStart={onZoomStart}
          onZoom={onZoom}
          onZoomEnd={onZoomEnd}
        >
          <g data-testid="zoom-content" />
        </MapZoom>
      </MapBase>,
    )

    expect(setupZoomSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        behavior: expect.any(Object),
        element: expect.any(SVGElement),
      }),
    )
    expect(zoomBehaviorOptions?.config).toEqual({ scaleExtent: [[1, 6]] })

    const event = { transform: createTransform(2) } as any
    zoomBehaviorOptions?.onZoomStart?.(event)
    zoomBehaviorOptions?.onZoom?.(event)
    zoomBehaviorOptions?.onZoomEnd?.(event)

    expect(onZoomStart).toHaveBeenCalledWith(event)
    expect(onZoom).toHaveBeenCalledWith(event)
    expect(onZoomEnd).toHaveBeenCalledWith(event)
    expect(screen.getByTestId('map-zoom-group').getAttribute('transform')).toContain('translate')
  })

  it('keeps the same zoom behavior when only callbacks change and uses the latest handlers', () => {
    const firstOnZoom = vi.fn()
    const nextOnZoom = vi.fn()

    const { rerender } = render(
      <MapBase data={sampleGeoJson}>
        <MapZoom onZoom={firstOnZoom} />
      </MapBase>,
    )

    expect(setupZoomSpy).toHaveBeenCalledTimes(1)

    rerender(
      <MapBase data={sampleGeoJson}>
        <MapZoom onZoom={nextOnZoom} />
      </MapBase>,
    )

    expect(setupZoomSpy).toHaveBeenCalledTimes(1)

    const event = { transform: createTransform(2) } as any
    zoomBehaviorOptions?.onZoom?.(event)

    expect(firstOnZoom).not.toHaveBeenCalled()
    expect(nextOnZoom).toHaveBeenCalledWith(event)
  })

  it('exposes zoomTo and applies a native D3 zoom transform', () => {
    let zoomRef: RefObject<MapZoomHandle | null> | undefined

    function Probe() {
      zoomRef = useRef<MapZoomHandle | null>(null)
      return (
        <MapZoom ref={zoomRef} />
      )
    }

    render(
      <MapBase data={sampleGeoJson}>
        <Probe />
      </MapBase>,
    )

    const transform = createTransform(3)

    expect(zoomRef?.current?.zoomTo(transform, { transition: false })).toBe(true)
    expect(applyZoomTransformSpy).toHaveBeenCalledWith(expect.objectContaining({
      element: expect.any(SVGElement),
      transform,
      transition: false,
    }))
  })

  it('exposes zoomBy and zoomToScale through D3 scale helpers', () => {
    let zoomRef: RefObject<MapZoomHandle | null> | undefined

    function Probe() {
      zoomRef = useRef<MapZoomHandle | null>(null)
      return (
        <MapZoom ref={zoomRef} />
      )
    }

    render(
      <MapBase data={sampleGeoJson}>
        <Probe />
      </MapBase>,
    )

    expect(zoomRef?.current?.zoomBy(0.5, { transition: false })).toBe(true)
    expect(zoomRef?.current?.zoomToScale(3, { transition: false })).toBe(true)
    expect(scaleToSpy).toHaveBeenCalledWith(expect.objectContaining({
      element: expect.any(SVGElement),
      scale: 1.5,
      transition: false,
    }))
    expect(scaleToSpy).toHaveBeenCalledWith(expect.objectContaining({
      scale: 3,
      transition: false,
    }))
  })

  it('exposes zoomToFeature and resolves the feature transform through core', () => {
    let zoomRef: RefObject<MapZoomHandle | null> | undefined

    function Probe() {
      zoomRef = useRef<MapZoomHandle | null>(null)
      return (
        <MapZoom ref={zoomRef} />
      )
    }

    render(
      <MapBase data={sampleGeoJson}>
        <Probe />
      </MapBase>,
    )

    const feature = sampleGeoJson.features[0]
    const transform = createTransform(4)
    getFeatureZoomTransformSpy.mockReturnValue(transform)

    expect(zoomRef?.current?.zoomToFeature(feature, {
      minZoom: 2,
      padding: 12,
      transition: false,
    })).toBe(true)

    expect(getFeatureZoomTransformSpy).toHaveBeenCalledWith(
      expect.any(Object),
      feature,
      expect.objectContaining({
        maxZoom: 8,
        minZoom: 2,
        padding: 12,
      }),
    )
    expect(applyZoomTransformSpy).toHaveBeenCalledWith(expect.objectContaining({
      transform,
      transition: false,
    }))
  })

  it('returns false when zoomToFeature cannot resolve a transform', () => {
    let zoomRef: RefObject<MapZoomHandle | null> | undefined

    function Probe() {
      zoomRef = useRef<MapZoomHandle | null>(null)
      return (
        <MapZoom ref={zoomRef} />
      )
    }

    render(
      <MapBase data={sampleGeoJson}>
        <Probe />
      </MapBase>,
    )

    expect(zoomRef?.current?.zoomToFeature(sampleGeoJson.features[0])).toBe(false)
    expect(applyZoomTransformSpy).not.toHaveBeenCalled()
  })

  it('exposes reset and applies the identity transform', () => {
    let zoomRef: RefObject<MapZoomHandle | null> | undefined

    function Probe() {
      zoomRef = useRef<MapZoomHandle | null>(null)
      return (
        <MapZoom ref={zoomRef} />
      )
    }

    render(
      <MapBase data={sampleGeoJson}>
        <Probe />
      </MapBase>,
    )

    expect(zoomRef?.current?.reset({ transition: false })).toBe(true)
    expect(applyZoomTransformSpy).toHaveBeenCalledWith(expect.objectContaining({
      transform: expect.objectContaining({
        k: 1,
        x: 0,
        y: 0,
      }),
      transition: false,
    }))
  })

  it('changing zoom props does not rerender stable feature children that only need zoom presence', () => {
    const { rerender } = render(
      <MapBase data={sampleGeoJson}>
        <MapZoom minZoom={1}>
          <MapFeature data={sampleGeoJson.features[0]} />
        </MapZoom>
      </MapBase>,
    )

    expect(useMapObjectSpy).toHaveBeenCalledTimes(1)

    rerender(
      <MapBase data={sampleGeoJson}>
        <MapZoom minZoom={2}>
          <MapFeature data={sampleGeoJson.features[0]} />
        </MapZoom>
      </MapBase>,
    )

    expect(useMapObjectSpy).toHaveBeenCalledTimes(1)
  })

  it('provides zoom context to descendants', () => {
    let zoomContext:
      | {
        maxZoom: number
        minZoom: number
      }
      | undefined

    function Probe() {
      zoomContext = useContext(MapZoomContextValue)
      return (
        <text data-testid="zoom-value">
          {`${zoomContext?.minZoom ?? 'none'}:${zoomContext?.maxZoom ?? 'none'}`}
        </text>
      )
    }

    render(
      <MapBase data={sampleGeoJson}>
        <MapZoom
          minZoom={2}
          maxZoom={9}
        >
          <Probe />
        </MapZoom>
      </MapBase>,
    )

    expect(screen.getByTestId('zoom-value').textContent).toBe('2:9')
    expect(zoomContext).toMatchObject({
      maxZoom: 9,
      minZoom: 2,
    })
  })
})

function createTransform(zoom: number): ZoomTransform {
  return {
    k: zoom,
    x: 0,
    y: 0,
    invert: () => [200, 150],
    toString: () => `translate(0,0) scale(${zoom})`,
  } as unknown as ZoomTransform
}
