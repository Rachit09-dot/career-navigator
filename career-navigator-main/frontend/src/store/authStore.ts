import { create } from 'zustand'

interface User {
  id: string
  name: string
  email: string
  profileComplete: boolean
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  login: (user: User, token: string) => void
  logout: () => void
  updateUser: (user: Partial<User>) => void
  initializeAuth: () => void
}

// Load auth data from localStorage on initialization
const loadAuthFromStorage = () => {
  try {
    const token = localStorage.getItem('token')
    const userStr = localStorage.getItem('user')
    
    if (token && userStr) {
      const user = JSON.parse(userStr)
      return { user, token, isAuthenticated: true }
    }
  } catch (error) {
    console.error('Error loading auth from storage:', error)
  }
  return { user: null, token: null, isAuthenticated: false }
}

export const useAuthStore = create<AuthState>((set) => ({
  ...loadAuthFromStorage(),
  login: (user, token) => {
    set({ user, token, isAuthenticated: true })
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(user))
  },
  logout: () => {
    set({ user: null, token: null, isAuthenticated: false })
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  },
  updateUser: (userData) =>
    set((state) => {
      const updatedUser = state.user ? { ...state.user, ...userData } : null
      if (updatedUser) {
        localStorage.setItem('user', JSON.stringify(updatedUser))
      }
      return { user: updatedUser }
    }),
  initializeAuth: () => {
    const authData = loadAuthFromStorage()
    set(authData)
  },
}))
