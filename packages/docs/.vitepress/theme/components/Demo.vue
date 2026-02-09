<template>
  <div>
    <component :is="componentName" />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  componentName: string
}>()
</script>
