import api from '../lib/api'
import { ENDPOINTS } from '../lib/endpoints'

export const dashboardService = {
  getAdminPusat: () => api.get('/admin/dashboard'),
  getAdminLapangan: () => api.get('/lapangan/dashboard')
}