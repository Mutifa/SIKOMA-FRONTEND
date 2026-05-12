//seperti satpam//

import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function RoleGuard({ children, allowedRoles }) {
  const { user, loading, isAuthenticated } = useAuth()
  const location = useLocation()

  // 🔥 tunggu auth selesai
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border" />
      </div>
    )
  }

  // 🔥 kalau belum login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // 🔥 kalau role tidak sesuai
  if (allowedRoles && !allowedRoles.includes(user.role)) {

    // if (user.role === 'admin_pusat') {
    //   return <Navigate to="/admin-pusat/dashboard" replace />
    // }

    if (user.role === 'admin_lapangan') {
      return <Navigate to="/dashboard" replace />
    }

    return <Navigate to="/" replace />
  }

  return children
}