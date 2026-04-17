import api from '../lib/api'
import { ENDPOINTS } from '../lib/endpoints'

export const authService = {
  login: (data) => api.post(ENDPOINTS.AUTH.LOGIN, data),
  logout: () => api.post(ENDPOINTS.AUTH.LOGOUT),
  me: () => api.get(ENDPOINTS.AUTH.ME),
}