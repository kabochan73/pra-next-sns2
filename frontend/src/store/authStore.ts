import { create } from 'zustand'
import apiClient from '@/lib/axios'

type User = {
  id: number
  name: string
  email: string
}

type AuthStore = {
  user: User | null
  token: string | null
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string, passwordConfirmation: string) => Promise<void>
  logout: () => Promise<void>
  fetchUser: () => Promise<void>
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,

  login: async (email, password) => {
    const res = await apiClient.post('/login', { email, password })
    const { user, token } = res.data
    localStorage.setItem('token', token)
    set({ user, token })
  },

  register: async (name, email, password, passwordConfirmation) => {
    const res = await apiClient.post('/register', {
      name,
      email,
      password,
      password_confirmation: passwordConfirmation,
    })
    const { user, token } = res.data
    localStorage.setItem('token', token)
    set({ user, token })
  },

  logout: async () => {
    await apiClient.post('/logout')
    localStorage.removeItem('token')
    set({ user: null, token: null })
  },

  fetchUser: async () => {
    const res = await apiClient.get('/me')
    set({ user: res.data })
  },
}))
