## Features

A feature is a geographic entity such as a country or state.  

[MapObjects](/components/map-objects) renders the full collection, while [MapObject](/components/map-object) is the low-level primitive for custom single-object rendering. The slot or render-function form exposes per-object rendering control.

:::tabs key:framework

== Vue

```vue{7-15} [vue]
<template>
  <MapBase
    :data="data"
    :data-transformer="dataTransformer"
    :projection="geoEquirectangular"
  >
    <MapObjects>
      <template #default="{ objects }">
        <MapObject
          v-for="object in objects"
          :key="object.key"
          :d="object.d"
        />
      </template>
    </MapObjects>
  </MapBase>
</template>
```

== React

```tsx{6-17} [react]
<MapBase
  data={data}
  dataTransformer={dataTransformer}
  projection={geoEquirectangular}
>
  <MapObjects>
    {({ objects }) => (
      <>
        {objects.map((object) => (
          <MapObject
            key={object.key}
            d={object.d}
          />
        ))}
      </>
    )}
  </MapObjects>
</MapBase>
```

:::
