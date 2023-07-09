<script setup lang="ts">
import { useTheme } from 'vuetify/lib/framework.mjs'

const theme = useTheme()

const toggleTheme = () => {
  const isDark: boolean = theme.global.name.value !== 'dark'
  theme.global.name.value = isDark ? 'dark' : 'light'
}
</script>
<template>
  <button @click="toggleTheme">{{ theme.global.name.value }} theme</button>
</template>
