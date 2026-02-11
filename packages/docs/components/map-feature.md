# MapFeature

Renders a single GeoJSON feature as an SVG `<path>`.

## Props

| Parameter | Type | Default value | Description |
| --- | --- | --- | --- |
| `data` | GeoJSON Feature | — | Rendered as an SVG path |
| `styles` | [MapObjectStyles](/api/core/mapObject#mapobjectstyles) | — | Style object with `default`, `hover`, and `active` states. |
| `fill` | `string` | — | SVG presentation prop. |
| `stroke` | `string` | — | SVG presentation prop. |

## Events

`mouseenter` `mouseleave` `mousedown` `mouseup` `focus` `blur`

## Usage

::: code-group

```vue [vue]
<template>
  <Map :data="mapData">
    <MapFeatures #default="{ features }">
      <MapFeature
        v-for="feature in features"
        :key="feature.id"
        :data="feature"
        :fill="feature.color"
        :styles="{
          default: {
            opacity: 0.9,
          },
          hover: {
            opacity: 0.8,
          },
          active: {
            stroke: 'green'
          },
        }"
      />
    </MapFeatures>
  </Map>
</template>
```

:::
