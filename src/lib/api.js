import axios from 'axios'

const api = axios.create({
  baseURL: 'https://codemy.my.id/api',
  timeout: 15000,
  headers: {
    Accept: 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
})

// ===== REQUEST INTERCEPTOR =====
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// ===== RESPONSE INTERCEPTOR =====
api.interceptors.response.use(
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