import React, { createContext, useContext, useEffect, useState } from 'react'
import { authService } from '../services/authService'
import api from '../lib/api'

// BUAT CONTEXT
const AuthContext = createContext()

//  HOOK CUSTOM // mengambil data login dari authentication
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) { //keamanan
    throw new Error('useAuth harus dipakai dalam AuthProvider')
  }
  return context
}

//  PROVIDER
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  //  AUTO CHECK LOGIN SAAT APP LOAD
  useEffect(() => {
    const token = localStorage.getItem('token')
    const savedUser = localStorage.getItem('user')

    if (savedUser) {
      setUser(JSON.parse(savedUser)) // 🔥 penting
      setIsAuthenticated(true)
    }

    if (token) {
      checkAuth()
    } else {
      setLoading(false)
    }
  }, [])

  //  CEK AUTH (API: /me)
  const checkAuth = async () => {
    try {
      const role = localStorage.getItem('role')

      const endpoint =
        role === 'admin_pusat'
          ? '/admin_pusat/profile'
          : '/profile'

      const res = await api.get(endpoint)

      const userData = res.data

      setUser(userData)
      setIsAuthenticated(true)
    }
    catch (error) {
      console.error('CHECK AUTH ERROR:', error)

      const token = localStorage.getItem('token')
      const savedUser = localStorage.getItem('user')

      if (token && savedUser) {
        setUser(JSON.parse(savedUser)) // 🔥 ini kunci
        setIsAuthenticated(true)
      } else {
        setIsAuthenticated(false)
      }
    }

    finally {
      setLoading(false)
    }
  }

  //  LOGIN
  const login = async (email, password) => {
    try {

      // 🔥 PANGGIL API LOGIN
     const res = await authService.login({
  email,
  password
})

console.log('FULL RESPONSE:', res.data)
console.log('TOKEN:', res.data?.data?.token)

      console.log('LOGIN RESPONSE:', res.data)

      const userData = res.data.data.user
      const token = res.data.data.token
      const role = res.data.data.role

      // simpan user
      setUser({ ...userData, role })
      localStorage.setItem('user', JSON.stringify({ ...userData, role }))
      setIsAuthenticated(true)

      // simpan token
      if (token) {
        localStorage.setItem('token', token)
      }
      localStorage.setItem('role', role) // ✅ TAMBAH INI

      // redirect berdasarkan role
      // redirect dashboard baru
      let redirect = '/dashboard'

return {
  success: true,
  user: userData,
  role,
  redirect,
}

    } catch (error) {
      console.log('LOGIN ERROR:', error.response)

      return {
        success: false,
        message: error.response?.data?.message || 'Login gagal',
      }
    }
  }

  // LOGOUT
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
      localStorage.removeItem('role')
      localStorage.removeItem('user')

      // redirect ke login
      window.location.href = '/login'
    }
  }

  //  CEK ROLE
  const hasRole = (role) => {
    return user?.role === role
  }

  const hasAnyRole = (roles = []) => {
    return roles.includes(user?.role)
  }

  //  VALUE GLOBAL
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