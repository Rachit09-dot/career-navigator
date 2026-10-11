import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // Only redirect to onboarding if user explicitly lands on /onboarding
  // Do NOT force redirect from dashboard — causes infinite loop when
  // backend returns profileComplete:false for existing users
  if (location.pathname === '/onboarding') {
    return <>{children}</>
  }

  return <>{children}</>
}
