import type { MapData } from '@d3-maps/core'

import { Map, MapFeatures } from '@d3-maps/react'
import { useEffect, useState } from 'react'
import { withBase } from 'vitepress'

export default function BasicExample(): JSX.Element | null {
  const [mapData, setMapData] = useState<MapData>()

  useEffect(() => {
    let isCancelled = false

    async function loadMap(): Promise<void> {
      const response = await fetch(withBase('/example-data/countries-110m.json'))
      const payload = await response.json()

      if (!isCancelled) {
        setMapData(payload)
      }
    }

    loadMap()

    return () => {
      isCancelled = true
    }
  }, [])

  return mapData
    ? (
        <Map data={mapData}>
          <MapFeatures />
        </Map>
      )
    : null
}
