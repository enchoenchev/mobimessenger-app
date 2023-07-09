export interface User {
  _id: string
  name: string
  email: string
  active: boolean
  created_at: string
  __v: number
}

export interface ProtectedUser {
  _id: string
  name: string
  online?: boolean
  created_at: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  name: string
  email: string
  password: string
}

export interface LoginResponse {
  status: string
  token: string
  data: {
    user: User
  }
}

export interface RegisterResponse {
  status: string
  token: string
  data: {
    user: User
  }
}

export interface ProtectedUsersResponse {
  status: string
  data: {
    users: Array<ProtectedUser>
  }
}

export interface ValidationResponse {
  status: string
  message: string
  data: Array<ValidationResponseField>
}

export interface ValidationResponseField {
  name: string
  message: string
  type: string
}

export interface ChatUserSession {
  user_id: string
  socket_id: string
}

export interface Chat {
  _id: string
  creator_id: string
  participent_id: string
  created_at: string
  messages: Array<Message>
}

export interface Message {
  _id: string
  sender_id: string
  recipient_id: string
  content: string
  chat?: Chat
  created_at: string
}
