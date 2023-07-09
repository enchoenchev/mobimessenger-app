<script setup lang="ts">
import { ref, type Ref } from 'vue'
import { useDisplay } from 'vuetify'
import ChatAppBar from '@/components/ChatAppBar.vue'
import { useUserStore } from '@/stores/user'
import type { User } from '@/interfaces/general'

const userStore = useUserStore()
const user: User = userStore.getUser as User
const { mdAndUp, lgAndUp } = useDisplay()
const usersDrawer: Ref<boolean> = ref(lgAndUp)
</script>
<template>
  <v-app>
    <v-layout>
      <ChatAppBar
        :users-drawer="usersDrawer"
        :user="user"
        @set-users-drawer="
          (value) => {
            usersDrawer = value
          }
        "
      ></ChatAppBar>

      <v-navigation-drawer class="vertical-navigation" rail rail-width="60" :permanent="mdAndUp">
        <slot name="verticalNavigation"></slot>
      </v-navigation-drawer>

      <v-navigation-drawer width="240" permanent>
        <slot name="chatOrGroupList"></slot>
      </v-navigation-drawer>

      <v-main>
        <slot name="chatHistory"></slot>
      </v-main>

      <v-navigation-drawer v-model="usersDrawer" location="right" width="240" :permanent="lgAndUp">
        <slot name="usersList"></slot>
      </v-navigation-drawer>

      <v-footer app height="72">
        <slot name="chatFooter"></slot>
      </v-footer>
    </v-layout>
  </v-app>
</template>
