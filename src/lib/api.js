import axios from 'axios'

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
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


