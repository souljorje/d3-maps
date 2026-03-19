# MapAnnotation

Anchors arbitrary SVG content to a map point with a connector path

Use it when you need a callout, label, or badge offset from the original location

## Props

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `coordinates` | `[number, number]` | — | Anchor coordinates in `[longitude, latitude]` |
| `length?` | `number` | `30` | Connector length in screen pixels |
| `angle?` | `number` | `-45` | Connector angle in degrees |
| `margin?` | `number` | `8` | Gap between the anchor point and the connector start |
| `styles?` | [MapObject['styles']](/api/core/mapObject#property-styles) | — | See [styling guide](/guide/core-concepts/#styling) |

Native SVG path attrs like `stroke`, `strokeWidth`, and `marker-end` are applied to the connector path

The annotation content is always user-provided slot or children content

`styles` also target the connector path, not the slotted content

## Usage

:::tabs key:framework

== Vue

```vue
<template>
  <Map :data="mapData">
    <MapFeatures />
    <MapAnnotation
      :coordinates="[2.3522, 48.8566]"
      :length="36"
      :angle="-35"
      :margin="10"
      stroke="#ff6f26"
      :stroke-width="2"
    >
      <text
        font-size="12"
        text-anchor="middle"
        y="-8"
      >Paris</text>
    </MapAnnotation>
  </Map>
</template>
```

== React

```tsx
<Map data={mapData}>
  <MapFeatures />
  <MapAnnotation
    coordinates={[2.3522, 48.8566]}
    length={36}
    angle={-35}
    margin={10}
    stroke="#ff6f26"
    strokeWidth={2}
  >
    <text
      fontSize={12}
      textAnchor="middle"
      y={-8}
    >
      Paris
    </text>
  </MapAnnotation>
</Map>
```

:::

See [annotation example](/examples/annotation) for a few callout layouts
