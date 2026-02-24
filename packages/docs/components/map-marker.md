# MapMarker

Positions anything on the map based on coordinates

## Props

| Parameter | Type | Default value | Description |
| --- | --- | --- | --- |
| `coordinates?` | `[number, number]` | — | Marker coordinates in `[longitude, latitude]` format. |
| `styles?` | [MapObjectStyles](/api/core/mapObject#mapobjectstyles) | — | See [styling guide](/guide/core-concepts/#styling) |

## Events

<!--@include: ./_map-object-events.md-->

## Usage

:::tabs key:framework

== Vue

```vue
<template>
  <Map :data="mapData">
    <MapFeatures />
    <MapMesh stroke="slategray" />
    <MapMarker
      v-for="item in cities"
      :key="item.city"
      :coordinates="[item.lon, item.lat]"
    >
      <text
        font-size="14"
        y="-8"
        text-anchor="middle"
        fill="darkorange"
      >{{ item.city }}</text>
      <circle
        fill="darkorange"
        r="3"
      />
    </MapMarker>
  </Map>
</template>
```

== React

```tsx
<Map data={mapData}>
  <MapFeatures />
  <MapMesh stroke="slategray" />
  {cities.map((item) => (
    <MapMarker
      key={item.city}
      coordinates={[item.lon, item.lat]}
    >
      <text
        fontSize="16"
        y={-6}
        textAnchor="middle"
      >
        {item.city}
      </text>
      <circle
        fill="#ff6f26"
        r={3}
      />
    </MapMarker>
  ))}
</Map>
```

:::
