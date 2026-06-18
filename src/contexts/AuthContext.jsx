import React, {
  createContext,
  useContext,
  useEffect,
  useState
} from 'react'

import { authService } from '../services/authService'

// AuthContext & Provider
// Menyediakan state auth global untuk seluruh aplikasi
// Menangani login, logout, dan pengecekan auth secara otomatis saat aplikasi dibuka
const AuthContext = createContext()

// Fungsi untuk mengambil user dari localStorage dengan penanganan error parsing
const parseStoredUser = () => {
  try {
    const savedUser = localStorage.getItem('user')
    return savedUser ? JSON.parse(savedUser) : null
  } catch {
    localStorage.removeItem('user')
    return null
  }
}

const getProfileEndpoint = () => '/profile'

// Custom hook untuk mengakses AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth harus dipakai dalam AuthProvider')
  }
  return context
}

// AuthProvider component untuk membungkus aplikasi dan menyediakan state auth
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // =====================================================
  // AUTO CHECK LOGIN SAAT APP PERTAMA KALI DIBUKA
  // =====================================================
  useEffect(() => {
    const token = localStorage.getItem('token')
    const savedUser = token ? parseStoredUser() : null

    if (token) {
      if (savedUser) {
        setUser(savedUser)
        setIsAuthenticated(true) // 🔥 PERBAIKAN: Langsung set true agar RoleGuard tidak menendang user ke /login
        setLoading(false)        // 🔥 PERBAIKAN: Matikan loading karena data lokal sudah siap
      }

      // Jalankan verifikasi token ke backend secara background
      checkAuth()
      return
    }
// Jika tidak ada token, pastikan state auth di-reset
    localStorage.removeItem('role')
    localStorage.removeItem('user')
    setIsAuthenticated(false)
    setLoading(false)
  }, [])

  // =====================================================
  // CHECK AUTH
  // =====================================================
  const checkAuth = async () => {
    try {
      const role = localStorage.getItem('role') || parseStoredUser()?.role
      const endpoint = getProfileEndpoint(role)

      const res = await authService.me(endpoint)
      const userData = res.data.data || res.data

      const nextUser = {
        ...userData,
        role
      }
// Update state dan localStorage dengan data user terbaru
      setUser(nextUser)
      localStorage.setItem('user', JSON.stringify(nextUser))
      setIsAuthenticated(true)

} catch (error) {
      // Suppress 404 - endpoint profile belum ada di backend
      if (error.response?.status !== 404) {
        console.error('CHECK AUTH ERROR:', error)
      }

      // Hanya logout jika token benar-benar kedaluwarsa / tidak valid (status 401 / 403)
      if (error.response?.status === 401 || error.response?.status === 403) {
        setUser(null)
        setIsAuthenticated(false)
        localStorage.removeItem('token')
        localStorage.removeItem('role')
        localStorage.removeItem('user')
      }
    }finally {
      setLoading(false)
    }
  }

  // =====================================================
  // LOGIN
  // =====================================================
  const login = async (email, password) => {
    try {
      const res = await authService.login({ email, password })
      
      // Ambil data (sesuaikan struktur object response backend kamu)
      const userData = res.data.data?.user || res.data.user
      const token = res.data.data?.token || res.data.token
      const role = res.data.data?.role || res.data.role

      // Update state dan localStorage dengan data user terbaru
      setUser({ ...userData, role })
      localStorage.setItem('user', JSON.stringify({ ...userData, role }))
      setIsAuthenticated(true)

      if (token) localStorage.setItem('token', token)
      if (role) localStorage.setItem('role', role)

      // Kembalikan data user dan role untuk redirect atau kebutuhan lain di komponen login  
      return {
        success: true,
        user: userData,
        role,
        redirect: '/dashboard',
      }

    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login gagal',
      }
    }
  }

  // =====================================================
  // LOGOUT
  // =====================================================
  const logout = async () => {
    try {
      await authService.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setUser(null)
      setIsAuthenticated(false)
      localStorage.removeItem('token')
      localStorage.removeItem('role')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
  }
// =====================================================  
  const hasRole = (role) => user?.role === role
  const hasAnyRole = (roles = []) => roles.includes(user?.role)

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