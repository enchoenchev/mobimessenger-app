<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script setup lang="ts">
import AuthLayout from '../layouts/AuthLayout.vue'
import { toTypedSchema } from '@vee-validate/zod'
import zod from 'zod'
import { useForm, useField } from 'vee-validate'
import { loginUser } from '@/services/api'
import { type LoginRequest, type LoginResponse } from '@/interfaces/general'
import { useUserStore } from '@/stores/user'
import router from '@/router'
import { ref } from 'vue'

const userStore = useUserStore()

const loginSchema = toTypedSchema(
  zod.object({
    email: zod
      .string({ required_error: 'Email address is required.' })
      .email('Email address is invalid.'),
    password: zod
      .string({ required_error: 'Password is required.' })
      .min(8, 'Password must be at least 8 characters.')
  })
)

const { handleSubmit, errors, resetForm } = useForm({
  validationSchema: loginSchema
})

const hasGeneralError = ref(false)
const generalErrorMessage = ref('')

const { value: email, errorMessage: emailErrorMessage } = useField('email')
const { value: password, errorMessage: passwordErrorMessage } = useField('password')

const login = handleSubmit(async (values) => {
  try {
    const responseData: LoginResponse = await loginUser(values as LoginRequest)
    if (responseData.status == 'success' && responseData.token) {
      userStore.setUser(responseData.data.user)
      userStore.setToken(responseData.token)
      router.push({ name: 'home' })
    }
  } catch (error: any) {
    hasGeneralError.value = true
    generalErrorMessage.value =
      error.name == 'AxiosError' ? error.response.data.message : error.message
  }
  resetForm()
})
</script>

<template>
  <AuthLayout>
    <v-container fill-height style="min-height: 100vh">
      <v-row class="justify-center align-center" style="height: 80%">
        <div class="auth-container ma-4">
          <div class="text-h3 mb-10 text-center app-title">MobiMessenger</div>
          <v-sheet class="mx-auto">
            <v-form validate-on="submit lazy" @submit.prevent="login">
              <v-snackbar v-model="hasGeneralError" color="error" timeout="5000" location="top">{{
                generalErrorMessage
              }}</v-snackbar>
              <v-text-field
                v-model="email"
                label="Email"
                :error-messages="emailErrorMessage"
              ></v-text-field>
              <v-text-field
                v-model="password"
                label="Password"
                type="password"
                :error-messages="passwordErrorMessage"
              ></v-text-field>
              <v-btn type="submit" block class="mt-6" text="Sign In" color="indigo"></v-btn>
            </v-form>
            <div class="mt-6">
              <p class="text-body-2 text-center">
                Don't have an account?
                <router-link :to="{ name: 'register' }" class="font-weight-bold"
                  >Sign Up</router-link
                >
              </p>
            </div>
          </v-sheet>
        </div>
      </v-row>
    </v-container>
  </AuthLayout>
</template>
<style scoped>
.auth-container {
  max-width: 400px;
}
.v-sheet {
  background: none;
}
@media (max-width: 600px) {
  .auth-container {
    width: 100%;
  }
}
@media (max-width: 400px) {
  .auth-container .app-title {
    font-size: 2.5rem !important;
  }
}
@media (max-width: 320px) {
  .auth-container .app-title {
    font-size: 1.8rem !important;
  }
}
</style>
