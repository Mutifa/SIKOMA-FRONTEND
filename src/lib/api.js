import axios from 'axios'

const api = axios.create({
  // Gunakan proxy Vite saat dev (baseURL kosong). Untuk production, set VITE_API_BASE_URL.
  baseURL: import.meta.env.VITE_API_BASE_URL || '',
  timeout: 15000,
  withCredentials: true,
  headers: {
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response) {
      console.error('API error:', err.response.status, err.response.data)
    } else {
      console.error('API error:', err.message)
    }
    return Promise.reject(err)
  }
)

export default api


