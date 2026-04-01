// src/components/protected-route.tsx
import { Navigate, Outlet, useLocation } from "react-router"

function useAuth() {
  // Replace this with your actual auth logic (context, store, etc.)
  const token = localStorage.getItem("token")
  return { isAuthenticated: !!token }
}

export default function ProtectedRoute() {
  const { isAuthenticated } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    // Preserve the attempted URL so you can redirect back after login
    return <Navigate to="/auth/login" state={{ from: location }} replace />
  }

  return <Outlet />
}
