import axios from 'axios'

// membuat instance axios dengan konfigurasi dasar
const api = axios.create({
  baseURL: 'https://codemy.my.id/api', // ganti dengan URL backend Anda
  timeout: 15000, // 15 detik timeout
  headers: {
    Accept: 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
})

// ===== REQUEST INTERCEPTOR =====
// Menambahkan token otentikasi ke header setiap permintaan jika tersedia
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token') // Jika token ada, tambahkan ke header Authorization
    if (token) { // Pastikan token tidak null atau undefined
      config.headers.Authorization = `Bearer ${token}` // Format umum untuk token Bearer
    }
    return config// Pastikan untuk mengembalikan config agar permintaan dapat dilanjutkan
  },
  (error) => {
    return Promise.reject(error) // Pastikan untuk menolak promise jika terjadi kesalahan pada request interceptor
  }
)

// ===== RESPONSE INTERCEPTOR =====
// Menangani kesalahan respons secara global, seperti menampilkan pesan error atau mengarahkan pengguna ke halaman login jika token tidak valid
api.interceptors.response.use(  // Respon sukses, cukup kembalikan data atau respon lengkap sesuai kebutuhan
  (res) => res,
  (err) => {
    // Suppress 404 - endpoint belum tersedia di backend
    if (err.response?.status !== 404) {
      console.error('API ERROR:', err.response?.data || err.message)
    }
    return Promise.reject(err)
  }
)

export default api