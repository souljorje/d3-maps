import {
  MapAnnotation,
  MapBase,
  MapFeatures,
  MapMarker,
} from '@d3-maps/react'
import { use } from 'react'

interface City {
  name: string
  coordinates: [number, number]
  color: string
}

const cities: City[] = [
  {
    name: 'Paris',
    coordinates: [2.3522, 48.8566],
    color: '#ff6f26',
  },
  {
    name: 'New York',
    coordinates: [-73.935242, 40.73061],
    color: '#60a5fa',
  },
]

const mapDataPromise = import('@d3-maps/atlas/world/countries/countries-110m').then((m) => m.default)

export default function AnnotationExample(): JSX.Element {
  const mapData = use(mapDataPromise)

  return (
    <MapBase>
      <MapFeatures data={mapData} />
      {cities.map((city) => (
        <MapAnnotation
          key={city.name}
          coordinates={city.coordinates}
          stroke={city.color}
          length={35}
          angle={-165}
          margin={2}
          midpoint={[0, -50]}
          strokeWidth={2}
        >
          <text
            y={-6}
            textAnchor="middle"
            fontSize={12}
            fill={city.color}
          >
            {city.name}
          </text>
        </MapAnnotation>
      ))}
      {cities.map((city) => (
        <MapMarker
          key={`${city.name}-marker`}
          coordinates={city.coordinates}
        >
          <circle
            fill={city.color}
            r={3}
          />
        </MapMarker>
      ))}
    </MapBase>
  )
}
