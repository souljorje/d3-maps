<template>
  <div class="my-4">
    <div class="flex flex-col aspect-2/1">
      <Suspense>
        <component
          :is="componentName"
        />
        <template #fallback>
          Loading...
        </template>
      </Suspense>
    </div>
    <div
      v-if="$slots.default"
      class="mt-2"
    >
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
const { componentName } = defineProps<{
  componentName: string
}>()
</script>
