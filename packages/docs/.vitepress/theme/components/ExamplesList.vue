<template>
  <ul>
    <li
      v-for="example in examples"
      :key="example.id"
    >
      <VPLink :href="example.docsPath">
        {{ example.title }}
      </VPLink>
    </li>
  </ul>
</template>

<script setup lang="ts">
import { useData } from 'vitepress'
import { VPLink } from 'vitepress/theme'
import { computed } from 'vue'

interface ExampleInfo {
  id: string
  title: string
  docsPath: string
}

const { site } = useData()

const examples = computed<ExampleInfo[]>(() => {
  const all = site.value.themeConfig?.examples
  return Array.isArray(all) ? all : []
})
</script>
