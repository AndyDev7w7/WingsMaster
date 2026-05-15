import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { normalizeRole } from '../utils/formatters'

export function ProtectedRoute({ roles }) {
  const { user } = useAuth()
  const location = useLocation()

  if (!user) return <Navigate to="/login" state={{ from: location }} replace />

  const role = normalizeRole(user.role)
  if (roles?.length && !roles.includes(role)) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
