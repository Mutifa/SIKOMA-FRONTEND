import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext.jsx'

const RoleGuard = ({ children, allowedRoles, fallbackPath = '/login' }) => {
  const { user, loading, isAuthenticated } = useAuth()
  const location = useLocation()

  console.log('RoleGuard:', { user, loading, isAuthenticated, allowedRoles, currentPath: location.pathname })

  // Show loading while checking authentication
  if (loading) {
    console.log('RoleGuard: Showing loading')
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    )
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated || !user) {
    console.log('RoleGuard: Not authenticated, redirecting to login')
    return <Navigate to={fallbackPath} state={{ from: location }} replace />
  }

  // Check if user has required role
  const hasRequiredRole = allowedRoles.includes(user.role)
  console.log('RoleGuard: Role check', { userRole: user.role, allowedRoles, hasRequiredRole })

  if (!hasRequiredRole) {
    // Redirect to appropriate dashboard based on user role
    const redirectPath = user.role === 'admin' ? '/admin' : 
                        user.role === 'superadmin' ? '/superadmin' : 
                        '/login'
    console.log('RoleGuard: Role not allowed, redirecting to:', redirectPath)
    return <Navigate to={redirectPath} replace />
  }

  console.log('RoleGuard: Access granted, rendering children')
  return children
}

export default RoleGuard
