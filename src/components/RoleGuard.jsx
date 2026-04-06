import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function RoleGuard({ children, allowedRoles }) {
  const { user, loading, isAuthenticated } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border" />
      </div>
    )
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (!allowedRoles.includes(user.role)) {
    // redirect sesuai role
    if (user.role === 'admin_pusat') {
      return <Navigate to="/AdminPusat/Dashboard" replace />
    }

    if (user.role === 'admin_lapangan') {
      return <Navigate to="/AdminLapangan/Dashboard" replace />
    }

    return <Navigate to="/" replace />
  }

  return children
}