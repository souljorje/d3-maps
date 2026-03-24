# MapAnnotation

Anchors arbitrary SVG content to a map point with a connector line path.  
Use when you need a callout, label, or badge offset from the original location

## Props

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `coordinates` | `[number, number]` | — | Anchor coordinates `[longitude, latitude]` |
| `length?` | `number` | `30` | Connector length in screen pixels |
| `angle?` | `number` | `-45` | Connector angle in degrees |
| `margin?` | `number` | `0` | Gap between the anchor point and the connector start |
| `curve?` | `CurveFactory \| CurveFactoryLineOnly` | `curveNatural` | See [`MapLine.curve`](/components/map-line#props) |
| `midpoint?` | `[lengthwise: number, crosswise: number]` | — | See [`MapLine.midpoint`](/components/map-line#props) |
| `styles?` | [MapObject['styles']](/api/core/mapObject#property-styles) | — | See [styling guide](/guide/core-concepts/#styling) |

`styles` and native attributes are bound to the connector `<path>`.  
Interaction state is tracked on the wrapper `<g>`.

## Usage

:::tabs key:framework

== Vue

```vue
<template>
  <MapBase :data="mapData">
    <MapFeatures />
    <MapAnnotation
      :coordinates="[2.3522, 48.8566]"
      :length="40"
      :angle="-90"
      :margin="2"
      :midpoint="[0, -50]"
      stroke="#ff6f26"
      :stroke-width="2"
    >
      <text
        font-size="12"
        text-anchor="middle"
        y="-6"
      >Paris</text>
    </MapAnnotation>
  </MapBase>
</template>

```

== React

```tsx
<MapBase data={mapData}>
  <MapFeatures />
  <MapAnnotation
    coordinates={[2.3522, 48.8566]}
    length={40}
    angle={-90}
    margin={2}
    midpoint={[0, -50]}
    stroke="#ff6f26"
    strokeWidth={2}
  >
    <text
      fontSize={12}
      textAnchor="middle"
      y={-6}
    >
      Paris
    </text>
  </MapAnnotation>
</MapBase>
```

:::

See [annotations example](/examples/annotations) for a few callout layouts
