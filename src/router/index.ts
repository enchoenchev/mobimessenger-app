import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '@/pages/LoginPage.vue'
import RegisterPage from '@/pages/RegisterPage.vue'
import LogoutPage from '@/pages/LogoutPage.vue'
import ChatPage from '@/pages/ChatPage.vue'
import Error404Page from '@/pages/Error404Page.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: ChatPage,
      meta: {
        authenticated: true
      }
    },
    {
      path: '/login',
      name: 'login',
      component: LoginPage,
      meta: {
        anonymous: true
      }
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterPage,
      meta: {
        anonymous: true
      }
    },
    {
      path: '/logout',
      name: 'logout',
      component: LogoutPage,
      meta: {
        authenticated: true
      }
    },
    {
      path: '/:catchAll(.*)*',
      component: () => Error404Page
    }
  ]
})

export default router
