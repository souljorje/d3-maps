---
title: API
---

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vitepress'

const router = useRouter()

onMounted(() => {
  router.go('/api/core/')
})
</script>

Redirecting to [Core API](/api/core/)...
