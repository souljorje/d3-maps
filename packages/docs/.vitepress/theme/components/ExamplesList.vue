<template>
  <ul>
    <li
      v-for="example in examples"
      :key="example.id"
    >
      <a :href="example.docsPath">
        {{ example.title }}
      </a>
    </li>
  </ul>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'

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
