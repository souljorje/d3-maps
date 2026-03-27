---
title: API
---

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vitepress'

const router = useRouter()
const hasCoreApiDocs = Object.keys(import.meta.glob('./core/*.md')).length > 0

onMounted(() => {
  if (hasCoreApiDocs) router.go('/api/core/')
})
</script>

<p v-if="hasCoreApiDocs">
  Redirecting to <a href="/api/core/">Core API</a>...
</p>

<template v-else>
  <p>API reference is generated on deploy</p>
  <p>Run <code>pnpm typedoc</code> to inspect it locally</p>
</template>
