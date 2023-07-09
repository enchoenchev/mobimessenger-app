<script setup lang="ts">
import AuthLayout from '../layouts/AuthLayout.vue'
import { toTypedSchema } from '@vee-validate/zod'
import zod from 'zod'
import { useForm, useField } from 'vee-validate'
import { registerUser } from '@/services/api'
import {
  type RegisterRequest,
  type RegisterResponse,
  type ValidationResponse,
  type ValidationResponseField
} from '@/interfaces/general'
import { useUserStore } from '@/stores/user'
import router from '@/router'
import { reactive, ref } from 'vue'

const userStore = useUserStore()

const registerSchema = toTypedSchema(
  zod.object({
    name: zod.string({ required_error: 'Name is required.' }),
    email: zod
      .string({ required_error: 'Email address is required.' })
      .email('Email address is invalid.'),
    password: zod
      .string({ required_error: 'Password is required.' })
      .min(8, 'Password must be at least 8 characters.')
      .refine(
        (value) =>
          /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!#%*?&])[A-Za-z\d@$!%*?&]{8,}/.test(value),
        {
          message:
            'Password should contain at least one lowercase, one uppercase, one number and one special character.'
        }
      )
  })
)

const { handleSubmit, errors, resetForm } = useForm({
  validationSchema: registerSchema
})

const hasGeneralErrors = ref(false)
const generalErrorMessages: Array<string> = reactive([])

const { value: name, errorMessage: nameErrorMessage } = useField('name')
const { value: email, errorMessage: emailErrorMessage } = useField('email')
const { value: password, errorMessage: passwordErrorMessage } = useField('password')

const register = handleSubmit(async (values) => {
  try {
    const responseData: RegisterResponse = await registerUser(values as RegisterRequest)
    if (responseData.status == 'success' && responseData.token) {
      userStore.setUser(responseData.data.user)
      userStore.setToken(responseData.token)
      router.push({ name: 'home' })
    }
  } catch (error: any) {
    hasGeneralErrors.value = true
    if (error.name == 'AxiosError') {
      if (error.response.status == 422) {
        const validationResponse: ValidationResponse = error.response.data
        for (const item of validationResponse.data) {
          if (item.name == 'name') {
            generalErrorMessages.push(item.message)
          }
          if (item.name == 'email') {
            generalErrorMessages.push(item.message)
          }
          if (item.name == 'password') {
            generalErrorMessages.push(item.message)
          }
        }
      } else {
        generalErrorMessages.push(error.response.data.message)
      }
    } else {
      generalErrorMessages.push(error.message)
    }
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
            <v-form validate-on="submit lazy" @submit.prevent="register">
              <v-snackbar
                v-for="msg in generalErrorMessages"
                :key="msg"
                v-model="hasGeneralErrors"
                color="error"
                timeout="5000"
                location="top"
                >{{ msg }}</v-snackbar
              >
              <v-text-field
                v-model="name"
                label="Name"
                :error-messages="nameErrorMessage"
              ></v-text-field>
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
              <v-btn type="submit" block class="mt-6" text="Sign Up" color="indigo"></v-btn>
            </v-form>
            <div class="mt-6">
              <p class="text-body-2 text-center">
                Already have an account?
                <router-link :to="{ name: 'login' }" class="font-weight-bold">Sign In</router-link>
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
