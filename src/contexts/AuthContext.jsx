import React, { createContext, useContext, useEffect, useState } from 'react'
import { authService } from '../services/authService'

// 🔥 BUAT CONTEXT
const AuthContext = createContext()

// 🔥 HOOK CUSTOM
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth harus dipakai dalam AuthProvider')
  }
  return context
}

// 🔥 PROVIDER
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // 🔄 AUTO CHECK LOGIN SAAT APP LOAD
  useEffect(() => {
    checkAuth()
  }, [])

  // 🔐 CEK AUTH (API: /me)
  const checkAuth = async () => {
    try {
      const res = await authService.me()

      const userData = res.data

      setUser(userData)
      setIsAuthenticated(true)
    } catch (error) {
      setUser(null)
      setIsAuthenticated(false)
    } finally {
      setLoading(false)
    }
  }

  // 🔑 LOGIN
  const login = async (email, password) => {
    try {
      const res = await authService.login({ email, password })

      const userData = res.data.user

      // simpan user
      setUser(userData)
      setIsAuthenticated(true)

      // 🔥 OPTIONAL: simpan token kalau backend kirim
      if (res.data.token) {
        localStorage.setItem('token', res.data.token)
      }

      // 🔀 REDIRECT BERDASARKAN ROLE
      let redirect = '/'

      if (userData.role === 'AdminLapangan_pusat') {
        redirect = '/AdminPusat/Dashboard'
      } else if (userData.role === 'AdminLapangan_lapangan') {
        redirect = '/AdminLapangan/Dashboard'
      }

      return {
        success: true,
        user: userData,
        role: userData.role,
        redirect,
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login gagal',
      }
    }
  }

  // 🚪 LOGOUT
  const logout = async () => {
    try {
      await authService.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      // hapus semua state
      setUser(null)
      setIsAuthenticated(false)
      localStorage.removeItem('token')

      // redirect ke login
      window.location.href = '/login'
    }
  }

  // 🔐 CEK ROLE
  const hasRole = (role) => {
    return user?.role === role
  }

  const hasAnyRole = (roles = []) => {
    return roles.includes(user?.role)
  }

  // 🔥 VALUE GLOBAL
  const value = {
    user,
    loading,
    isAuthenticated,

    login,
    logout,
    checkAuth,

    hasRole,
    hasAnyRole,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}