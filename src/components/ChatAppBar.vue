<script setup lang="ts">
import type { User } from '@/interfaces/general'
import { ref, watchEffect } from 'vue'

const props = defineProps<{
  usersDrawer: boolean
  user: User
}>()

defineEmits(['setUsersDrawer'])

const avatar = ref('')
watchEffect(async () => {
  avatar.value = (await import('../assets/avatar.jpg')).default
})
</script>
<template>
  <v-app-bar :elevation="1" class="pr-2">
    <v-icon size="large" icon="mdi-forum" class="hidden-sm-and-down pl-7 pr-3"></v-icon>
    <v-toolbar-title>MobiMessenger</v-toolbar-title>

    <v-spacer></v-spacer>

    <v-btn icon="mdi-chat" class="ma-1 hidden-md-and-up hide-xs-and-down" :ripple="false"> </v-btn>
    <v-btn icon="mdi-account-group" class="ma-1 hidden-md-and-up hide-xs-and-down" :ripple="false">
    </v-btn>

    <v-menu location="bottom">
      <template #activator="{ props }">
        <v-list-item
          :append-avatar="avatar"
          :title="user.name"
          v-bind="props"
          link
          :ripple="false"
        ></v-list-item>
      </template>

      <v-list density="compact">
        <v-list-item
          prepend-icon="mdi-chat"
          title="Chats"
          value="chats"
          :ripple="false"
          class="hidden-sm-and-up"
        ></v-list-item>
        <v-list-item
          prepend-icon="mdi-account-group"
          title="Groups"
          value="groups"
          :ripple="false"
          class="hidden-sm-and-up"
        ></v-list-item>
        <v-divider class="hidden-sm-and-up"></v-divider>
        <v-list-item
          prepend-icon="mdi-account"
          title="My Account"
          value="account"
          :ripple="false"
        ></v-list-item>
        <v-list-item
          prepend-icon="mdi-logout"
          title="Logout"
          value="logout"
          :ripple="false"
          :to="{ name: 'logout' }"
        ></v-list-item>
      </v-list>
    </v-menu>

    <v-btn
      icon="mdi-menu"
      class="ma-1 hidden-lg-and-up"
      :ripple="false"
      @click.stop="$emit('setUsersDrawer', !props.usersDrawer)"
    ></v-btn>
  </v-app-bar>
</template>

<style scoped>
nav.vertical-navigation .v-list-item {
  padding-left: 4px;
  padding-right: 4px;
}
.v-app-bar .v-toolbar-title {
  flex-basis: 100px;
}
@media (max-width: 599px) {
  .hide-xs-and-down {
    display: none;
  }
}
</style>
