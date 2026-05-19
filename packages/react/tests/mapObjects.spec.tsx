import { describe, expect, it } from 'vitest'

import type { MapObjectData } from '@d3-maps/core'

import {
  fireEvent,
  render,
  screen,
} from '@testing-library/react'

import {
  isFeature,
  MapBase,
  MapObject,
  MapObjects,
} from '../src'
import {
  sampleGeoJson,
  sampleGeometryCollection,
  sampleGeometryCollectionFeature,
  sampleTopologyObjectKey,
  sampleTopologyTwoObjects,
} from './fixtures'

describe('mapObjects', () => {
  it('renders normalized objects by default', () => {
    const { container } = render(
      <MapBase data={sampleGeometryCollection}>
        <MapObjects />
      </MapBase>,
    )

    expect(container.querySelectorAll('path')).toHaveLength(2)
  })

  it('supports render-prop children', () => {
    const { container } = render(
      <MapBase
        data={sampleTopologyTwoObjects}
        objectKey={sampleTopologyObjectKey}
      >
        <MapObjects>
          {({ objects }) => (
            <g
              data-testid="map-objects-group"
              data-count={String(objects.length)}
            >
              {
                objects.map(({ key, d }: MapObjectData) => (
                  <MapObject
                    key={key}
                    d={d}
                  />
                ))
              }
            </g>
          )}
        </MapObjects>
      </MapBase>,
    )

    expect(screen.getByTestId('map-objects-group').getAttribute('data-count')).toBe('2')
    expect(container.querySelectorAll('path')).toHaveLength(2)
  })

  it('forwards styles to default-rendered objects', () => {
    const { container } = render(
      <MapBase data={sampleGeoJson}>
        <MapObjects
          styles={{
            default: { opacity: 0.9 },
            hover: { opacity: 0.7 },
          }}
        />
      </MapBase>,
    )

    const path = container.querySelector('path')
    expect(path?.style.opacity).toBe('0.9')

    fireEvent.mouseOver(path as Element)
    expect(path?.style.opacity).toBe('0.7')
  })

  it('supports explicit layer data overrides', () => {
    const { container } = render(
      <MapBase data={sampleGeoJson}>
        <MapObjects
          data={sampleTopologyTwoObjects}
          objectKey={sampleTopologyObjectKey}
        />
      </MapBase>,
    )

    expect(container.querySelectorAll('path')).toHaveLength(2)
  })

  it('supports layer-level data transformers', () => {
    const { container } = render(
      <MapBase
        data={sampleTopologyTwoObjects}
        objectKey={sampleTopologyObjectKey}
      >
        <MapObjects dataTransformer={(objects) => objects.slice(0, 1)} />
      </MapBase>,
    )

    expect(container.querySelectorAll('path')).toHaveLength(1)
  })

  it('supports custom object keys', () => {
    render(
      <MapBase data={sampleGeoJson}>
        <MapObjects
          getKey={(item, index) => isFeature(item)
            ? item.properties?.id ?? `custom-${index}`
            : undefined}
        >
          {({ objects }) => (
            <g data-testid="map-object-keys">
              {objects.map(({ key }) => (
                <g
                  key={key}
                  data-key={String(key)}
                />
              ))}
            </g>
          )}
        </MapObjects>
      </MapBase>,
    )

    expect(screen.getByTestId('map-object-keys').querySelector('[data-key="demo"]')).not.toBeNull()
  })

  it('preserves feature geometry collections as single objects', () => {
    const { container } = render(
      <MapBase data={sampleGeometryCollectionFeature}>
        <MapObjects />
      </MapBase>,
    )

    expect(container.querySelectorAll('path')).toHaveLength(1)
  })

  it('accepts native svg attrs on the objects group', () => {
    const { container } = render(
      <MapBase data={sampleGeoJson}>
        <MapObjects fill="darkorange" />
      </MapBase>,
    )

    expect(container.querySelector('g[name="objects"]')?.getAttribute('fill')).toBe('darkorange')
  })

  it('supports layer objectKey overrides', () => {
    const { container } = render(
      <MapBase data={sampleTopologyTwoObjects}>
        <MapObjects objectKey={sampleTopologyObjectKey} />
      </MapBase>,
    )

    expect(container.querySelectorAll('path')).toHaveLength(2)
  })
})
