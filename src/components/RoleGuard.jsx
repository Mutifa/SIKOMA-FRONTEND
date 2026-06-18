//seperti satpam//

import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

// RoleGuard Component
// Melindungi rute berdasarkan peran pengguna
// Menampilkan loading saat memeriksa auth, redirect jika tidak sesuai
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

    // Contoh redirect berdasarkan role, sesuaikan dengan kebutuhan
    if (user.role === 'admin_lapangan') {
      return <Navigate to="/dashboard" replace />
    }
    return <Navigate to="/" replace />
  }

  return children
}