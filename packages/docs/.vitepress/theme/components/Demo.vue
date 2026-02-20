<template>
  <div class="my-4">
    <div class="flex justify-start aspect-video">
      <component
        :is="componentName"
      />
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
