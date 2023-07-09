import axios from 'axios'
import type {
  ProtectedUsersResponse,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse
} from '@/interfaces/general'

const BASE_URL = import.meta.env.VITE_AUTH_SERVICE_BASE_URL

const authenticationApi = axios.create({
  baseURL: BASE_URL,
  withCredentials: false
})

authenticationApi.defaults.headers.common['Content-Type'] = 'application/json'

authenticationApi.interceptors.response.use(
  (response) => {
    return response
  },
  async (error) => {
    return Promise.reject(error)
  }
)

export const loginUser = async (user: LoginRequest) => {
  const response = await authenticationApi.post<LoginResponse>('/login', user)
  return response.data
}

export const registerUser = async (user: RegisterRequest) => {
  const response = await authenticationApi.post<RegisterResponse>('/register', user)
  return response.data
}

export const getAllProtectedUsers = async (token: string) => {
  if (token) {
    authenticationApi.defaults.headers.common['Authorization'] = 'Bearer: ' + token
  }
  const response = await authenticationApi.get<ProtectedUsersResponse>('/users')
  return response.data
}
