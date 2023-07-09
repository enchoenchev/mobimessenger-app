<script setup lang="ts"></script>
<template>
  <BasicLayout>
    <v-container
      class="justify-center align-center d-flex"
      fill-height
      style="min-height: 100vh; flex-direction: column"
    >
      <span class="text-h3 text-center">Page Not Found</span>
      <router-link :to="{ name: 'home' }" class="mt-10 font-weight-bold"
        >Back to homepage</router-link
      >
    </v-container>
  </BasicLayout>
</template>
