import { describe, expect, it } from 'vitest'

import type { MapFeature } from '@d3-maps/core'

import {
  fireEvent,
  render,
  screen,
} from '@testing-library/react'

import {
  isFeature,
  MapBase,
  MapFeatures,
  MapObject,
} from '../src'
import {
  sampleGeoJson,
  sampleGeometryCollection,
  sampleGeometryCollectionFeature,
  sampleTopologyObjectKey,
  sampleTopologyTwoObjects,
} from './fixtures'

describe('mapFeatures', () => {
  it('renders normalized features by default', () => {
    const { container } = render(
      <MapBase fit={sampleGeometryCollection}>
        <MapFeatures data={sampleGeometryCollection} />
      </MapBase>,
    )

    expect(container.querySelectorAll('path')).toHaveLength(2)
  })

  it('supports render-prop children', () => {
    const { container } = render(
      <MapBase
        fit={sampleTopologyTwoObjects}
        fitObjectKey={sampleTopologyObjectKey}
      >
        <MapFeatures
          data={sampleTopologyTwoObjects}
          objectKey={sampleTopologyObjectKey}
        >
          {({ features }) => (
            <g
              data-testid="map-features-group"
              data-count={String(features.length)}
            >
              {
                features.map(({ key, d }: MapFeature) => (
                  <MapObject
                    key={key}
                    d={d}
                  />
                ))
              }
            </g>
          )}
        </MapFeatures>
      </MapBase>,
    )

    expect(screen.getByTestId('map-features-group').getAttribute('data-count')).toBe('2')
    expect(container.querySelectorAll('path')).toHaveLength(2)
  })

  it('forwards styles to default-rendered objects', () => {
    const { container } = render(
      <MapBase fit={sampleGeoJson}>
        <MapFeatures
          data={sampleGeoJson}
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
      <MapBase fit={sampleGeoJson}>
        <MapFeatures
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
        fit={sampleTopologyTwoObjects}
        fitObjectKey={sampleTopologyObjectKey}
      >
        <MapFeatures
          data={sampleTopologyTwoObjects}
          objectKey={sampleTopologyObjectKey}
          transformer={(objects) => objects.slice(0, 1)}
        />
      </MapBase>,
    )

    expect(container.querySelectorAll('path')).toHaveLength(1)
  })

  it('supports custom object keys', () => {
    render(
      <MapBase fit={sampleGeoJson}>
        <MapFeatures
          data={sampleGeoJson}
          getKey={(item, index) => isFeature(item)
            ? item.properties?.id ?? `custom-${index}`
            : undefined}
        >
          {({ features }) => (
            <g data-testid="map-object-keys">
              {features.map(({ key }) => (
                <g
                  key={key}
                  data-key={String(key)}
                />
              ))}
            </g>
          )}
        </MapFeatures>
      </MapBase>,
    )

    expect(screen.getByTestId('map-object-keys').querySelector('[data-key="demo"]')).not.toBeNull()
  })

  it('preserves feature geometry collections as single objects', () => {
    const { container } = render(
      <MapBase fit={sampleGeometryCollectionFeature}>
        <MapFeatures data={sampleGeometryCollectionFeature} />
      </MapBase>,
    )

    expect(container.querySelectorAll('path')).toHaveLength(1)
  })

  it('accepts native svg attrs on the objects group', () => {
    const { container } = render(
      <MapBase fit={sampleGeoJson}>
        <MapFeatures
          data={sampleGeoJson}
          fill="darkorange"
        />
      </MapBase>,
    )

    expect(container.querySelector('g[name="features"]')?.getAttribute('fill')).toBe('darkorange')
  })

  it('supports explicit layer objectKey overrides', () => {
    const { container } = render(
      <MapBase fit={sampleTopologyTwoObjects}>
        <MapFeatures
          data={sampleTopologyTwoObjects}
          objectKey={sampleTopologyObjectKey}
        />
      </MapBase>,
    )

    expect(container.querySelectorAll('path')).toHaveLength(2)
  })
})
