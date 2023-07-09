<script setup lang="ts">
import router from '@/router'
import { useUserStore } from '@/stores/user'
import { onMounted } from 'vue'

onMounted(() => {
  const userStore = useUserStore()
  userStore.clearUser()
  userStore.clearToken()
  router.push({ name: 'login' })
})
</script>
<template><div></div></template>
