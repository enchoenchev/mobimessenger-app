import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import { type NavigationGuardNext, type RouteLocationNormalized } from 'vue-router'
import { useUserStore } from '@/stores/user'

const app = createApp(App)
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

app.use(pinia)
app.use(router)
app.use(vuetify)

router.beforeEach(
  (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
    const userStore = useUserStore(pinia)
    const isAuthenticated = userStore.isAuthenticated
    if (
      (!to.meta.authenticated && !to.meta.anonymous) ||
      (to.meta.authenticated && isAuthenticated) ||
      (to.meta.anonymous && !isAuthenticated)
    ) {
      next()
    } else if (to.meta.authenticated && !isAuthenticated) {
      next('/login')
    } else {
      next('/')
    }
  }
)

app.mount('#app')
