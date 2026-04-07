import axios from 'axios'

// Membuat instance axios (biar bisa dipakai berulang di seluruh project)
const api = axios.create({

  // Base URL API backend (Laravel)
  baseURL: 'http://127.0.0.1:8000/api',

  // Batas waktu request (15 detik)
  timeout: 15000,

  // Mengirim cookie (biasanya untuk auth/session Laravel Sanctum)
  withCredentials: true,

  // Header default untuk semua request
  headers: {
    Accept: 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
})


// ===== REQUEST INTERCEPTOR =====
api.interceptors.request.use((config) => {

  // Ambil token dari localStorage
  const token = localStorage.getItem('token')

  // Jika ada token → kirim ke header Authorization
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  // Kembalikan config yang sudah dimodifikasi
  return config
})


// ===== RESPONSE INTERCEPTOR =====
api.interceptors.response.use(

  // Jika response sukses → langsung return
  (res) => res,

  // Jika error → tangani di sini
  (err) => {

    // Menampilkan error ke console (debugging)
    console.error('API ERROR:', err.response?.data || err.message)

    // Lempar error supaya bisa ditangani di component
    return Promise.reject(err)
  }
)


// Export instance axios agar bisa digunakan di file lain
export default api