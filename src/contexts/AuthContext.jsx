import React, {
  createContext, // Digunakan untuk membuat context baru
  useContext, // Digunakan untuk mengakses context di komponen lain
  useEffect, // Digunakan untuk side effect (cek login saat app pertama kali dibuka)
  useState // Digunakan untuk menyimpan state user, loading, dll
} from 'react'

import { authService } from '../services/authService'
import api from '../lib/api'


// =======================================================
// MEMBUAT AUTH CONTEXT
// =======================================================
// Context ini dipakai untuk menyimpan:
// - data user login
// - status login
// - function login/logout
// =======================================================
const AuthContext = createContext()


// =======================================================
// CUSTOM HOOK
// =======================================================
// useAuth() dipakai agar component lebih mudah
// mengambil data auth tanpa menulis:
// useContext(AuthContext)
// berulang kali
// =======================================================
export const useAuth = () => {

  const context = useContext(AuthContext)

  // Keamanan:
  // memastikan useAuth hanya dipakai
  // di dalam <AuthProvider>
  if (!context) {
    throw new Error(
      'useAuth harus dipakai dalam AuthProvider'
    )
  }

  return context
}


// =======================================================
// AUTH PROVIDER
// =======================================================
// Provider utama untuk membungkus seluruh aplikasi
// agar semua page bisa mengakses auth
// =======================================================
export const AuthProvider = ({ children }) => {

  // =====================================================
  // STATE
  // =====================================================

  // Menyimpan data user login
  const [user, setUser] = useState(null)

  // Status loading auth
  const [loading, setLoading] = useState(true)

  // Status apakah user sudah login
  const [isAuthenticated, setIsAuthenticated] = useState(false)


  // =====================================================
  // AUTO CHECK LOGIN SAAT APP PERTAMA KALI DIBUKA
  // =====================================================
  useEffect(() => {

    // Ambil token dari localStorage
    const token = localStorage.getItem('token')

    // Ambil data user dari localStorage
    const savedUser = localStorage.getItem('user')

    // Jika user tersimpan → langsung set user
    if (savedUser) {

      setUser(JSON.parse(savedUser))

      setIsAuthenticated(true)

    }

    // Jika ada token → cek auth ke backend
if (savedUser) {

  setUser(JSON.parse(savedUser))

  setIsAuthenticated(true)

}

setLoading(false)

  }, [])


  // =====================================================
  // CHECK AUTH
  // =====================================================
  // Mengecek apakah token masih valid
  // dengan request ke backend
  // =====================================================
  const checkAuth = async () => {

    try {

      // Ambil role dari localStorage
      const role = localStorage.getItem('role')

      // Menentukan endpoint profile
      const endpoint =
        role === 'admin_pusat'
          ? '/admin_pusat/profile'
          : '/profile'

      // Request ke backend
      const res = await api.get(endpoint)

      const userData = res.data

      // Simpan user + role
      setUser({
        ...userData,
        role
      })

      setIsAuthenticated(true)

    } catch (error) {

      console.error(
        'CHECK AUTH ERROR:',
        error
      )

      // Fallback:
      // jika backend gagal tapi localStorage masih ada
      const token = localStorage.getItem('token')

      const savedUser = localStorage.getItem('user')

      if (token && savedUser) {

        setUser(JSON.parse(savedUser))

        setIsAuthenticated(true)

      } else {

        setIsAuthenticated(false)

      }

    } finally {

      // Loading selesai
      setLoading(false)

    }

  }


  // =====================================================
  // LOGIN
  // =====================================================
  // Mengirim email + password ke backend
  // =====================================================
  const login = async (email, password) => {

    try {

      // Request login ke backend
      const res = await authService.login({
        email,
        password
      })

      console.log('FULL RESPONSE:', res.data)

      // Ambil data dari response backend
      const userData = res.data.data.user

      const token = res.data.data.token

      const role = res.data.data.role

      // Simpan user ke state
      setUser({
        ...userData,
        role
      })

      // Simpan user ke localStorage
      localStorage.setItem(
        'user',
        JSON.stringify({
          ...userData,
          role
        })
      )

      setIsAuthenticated(true)

      // Simpan token
      if (token) {

        localStorage.setItem('token', token)

      }

      // Simpan role
      localStorage.setItem('role', role)

      // Redirect universal dashboard
      const redirect = '/dashboard'

      return {
        success: true,
        user: userData,
        role,
        redirect,
      }

    } catch (error) {

      console.log(
        'LOGIN ERROR:',
        error.response
      )

      return {
        success: false,
        message:
          error.response?.data?.message ||
          'Login gagal',
      }

    }

  }


  // =====================================================
  // LOGOUT
  // =====================================================
  const logout = async () => {

    try {

      // Request logout ke backend
      await authService.logout()

    } catch (error) {

      console.error(
        'Logout error:',
        error
      )

    } finally {

      // Reset semua state
      setUser(null)

      setIsAuthenticated(false)

      // Hapus localStorage
      localStorage.removeItem('token')

      localStorage.removeItem('role')

      localStorage.removeItem('user')

      // Redirect ke login
      window.location.href = '/login'

    }

  }


  // =====================================================
  // CEK ROLE USER
  // =====================================================

  // Mengecek apakah role user sama
  const hasRole = (role) => {

    return user?.role === role

  }

  // Mengecek apakah role user termasuk dalam array role
  const hasAnyRole = (roles = []) => {

    return roles.includes(user?.role)

  }


  // =====================================================
  // VALUE CONTEXT
  // =====================================================
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


  // =====================================================
  // RETURN PROVIDER semua page bisa tahu: siapa yang login
  // =====================================================
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

