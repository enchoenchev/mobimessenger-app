import type { User } from '@/interfaces/general'
import { defineStore } from 'pinia'

export type UserStoreState = {
  user: User | null
  token: string | null
}

export const useUserStore = defineStore({
  id: 'userStore',
  state: () =>
    ({
      user: null,
      token: null
    } as UserStoreState),
  getters: {
    getUser(state): User | null {
      return state.user
    },
    getToken(state): string | null {
      return state.token
    },
    isAuthenticated(state): boolean {
      return state.user !== null && state.token !== null
    }
  },
  actions: {
    setUser(user: User | null) {
      this.user = user
    },
    setToken(token: string | null) {
      this.token = token
    },
    clearUser() {
      this.user = null
    },
    clearToken() {
      this.token = null
    }
  },
  persist: true
})
