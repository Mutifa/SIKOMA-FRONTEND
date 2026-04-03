import React, { createContext, useContext, useState, useEffect } from 'react'
import api from '../lib/api.js'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  } 
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Check if user is authenticated on app load
  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      // Try to get user data from dashboard endpoint based on current path
      const currentPath = window.location.pathname
      let endpoint = ''
      
      if (currentPath.startsWith('/admin')) {
        endpoint = '/api/admin/dashboard'
      } else if (currentPath.startsWith('/superadmin')) {
        endpoint = '/api/superadmin/dashboard'
      } else {
        // If not on admin/superadmin path, just set loading to false
        setLoading(false)
        return
      }

      const response = await api.get(endpoint)
      if (response.data.user) {
        setUser(response.data.user)
        setIsAuthenticated(true)
      }
    } catch (error) {
      console.log('User not authenticated')
      setUser(null)
      setIsAuthenticated(false)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    try {
      // Get CSRF cookie first
      const response = await api.post('/login', {email, password})
      

      const userData = response.data.user
      
      console.log('Login response:', response.data)
      
      setUser(userData)
      setIsAuthenticated(true)
      setLoading(false)
      
   return {
  success: true,
  role: response.data.role,
  redirect: response.data.redirect,
  user: userData
}
    } catch (error) {
      console.error('Login error:', error)
      return {
        success: false,
        message: error.response?.data?.message || 'Login gagal'
      }
    }
  }

  const logout = async () => {
    try {
      await api.post('/api/auth/logout')
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setUser(null)
      setIsAuthenticated(false)
      window.location.href = '/login'
    }
  }

  const hasRole = (role) => {
    return user?.role === role
  }

  const hasAnyRole = (roles) => {
    return roles.includes(user?.role)
  }

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
    hasRole,
    hasAnyRole,
    checkAuth
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
