<script setup lang="ts">
import ChatLayout from '../layouts/ChatLayout.vue'
import socket from '@/services/socket'
import { onMounted, ref, reactive, watchEffect } from 'vue'
import { useUserStore } from '@/stores/user'
import type {
  Chat,
  ChatUserSession,
  ProtectedUser,
  ProtectedUsersResponse
} from '@/interfaces/general'
import { getAllProtectedUsers } from '@/services/api'

const userStore = useUserStore()

const avatar = ref('')
watchEffect(async () => {
  avatar.value = (await import('../assets/avatar.jpg')).default
})

const socketActive = ref(false)
const socketId = ref('')

const users: Array<ProtectedUser> = reactive([])
const activeUserSessions: Array<ChatUserSession> = reactive([])
const chats: Array<Chat> = reactive([])

onMounted(() => {
  getAllUsers()
  connect()

  socket.on('connect_error', (error) => {
    console.log(error.message)
  })

  socket.on('connect', () => {
    socketActive.value = socket.active
    socketId.value = socket.id
    socket.emit('get-chats')
  })

  socket.on('disconnect', () => {
    socketActive.value = false
    socketId.value = ''
    activeUserSessions.splice(0)
  })

  socket.on('active-user-sessions', (userSessions) => {
    activeUserSessions.splice(0)
    userSessions.forEach((userSession: ChatUserSession) => {
      activeUserSessions.push(userSession)
    })
  })

  socket.on('chats', (chatObjects) => {
    chats.splice(0)
    chatObjects.forEach((chat: Chat) => {
      chats.push(chat)
    })
  })

  // TODO - all other chat functionality
})

function connect() {
  socket.auth = {
    userId: userStore.getUser?._id,
    userName: userStore.getUser?.name,
    token: userStore.getToken
  }
  socket.connect()
}

function disconnect() {
  socket.disconnect()
}

function toggle() {
  if (socket.active) {
    disconnect()
  } else {
    connect()
  }
}

function getAllUsers() {
  users.splice(0)
  getAllProtectedUsers(userStore.getToken as string)
    .then((responseData: ProtectedUsersResponse) => {
      if (responseData.status == 'success') {
        for (const user of responseData.data.users) {
          if (!userStore.getUser || user._id != userStore.getUser?._id) {
            user.online = false
            for (const session of activeUserSessions) {
              if (session.user_id == user._id) {
                user.online = true
              }
            }
            users.push(user)
          }
        }
      }
    })
    .catch((error: any) => {
      console.log(error.message)
    })
}
</script>
<template>
  <ChatLayout>
    <template #verticalNavigation>
      <v-list>
        <v-list-item class="text-center" link :ripple="false">
          <v-icon size="large" icon="mdi-chat"></v-icon>
          <label class="text-caption">Chats</label>
        </v-list-item>
        <v-list-item class="text-center" link :ripple="false">
          <v-icon size="large" icon="mdi-account-group"></v-icon>
          <label class="text-caption">Groups</label>
        </v-list-item>
      </v-list>
    </template>
    <template #chatOrGroupList>
      <v-list>
        <v-list-item
          v-for="chat in chats"
          :key="chat._id"
          :title="chat.creator_id"
          link
          :ripple="false"
        ></v-list-item>
      </v-list>
    </template>

    <template #chatHistory>
      <!-- <div>Socket ID: {{ socketId }}</div>
      <div>Is socket connected: {{ socketActive }}</div>
      <div>
        <v-btn
          :text="socket.active ? 'Disconnect socket' : 'Connect socket'"
          color="indigo"
          @click="toggle"
        ></v-btn>
      </div> -->
    </template>

    <template #usersList>
      <v-list>
        <v-list-item
          v-for="user in users"
          :key="user._id"
          :title="user.name"
          link
          :ripple="false"
          :prepend-avatar="avatar"
          class="mt-1 mb-1"
          :disabled="!user.online"
        >
        </v-list-item>
      </v-list>
    </template>

    <template #chatFooter>
      <v-text-field
        bg-color="grey-lighten-1"
        class="rounded-pill overflow-hidden"
        density="compact"
        hide-details
        variant="solo"
      ></v-text-field>
    </template>
  </ChatLayout>
</template>

<style scoped>
nav.vertical-navigation .v-list-item {
  padding-left: 4px;
  padding-right: 4px;
}
</style>
