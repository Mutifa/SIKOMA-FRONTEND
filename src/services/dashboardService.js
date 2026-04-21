import api from '../lib/api'
import { ENDPOINTS } from '../lib/endpoints'

export const dashboardService = {
  getAdminPusat() {
    return api.get(ENDPOINTS.DASHBOARD.ADMIN_PUSAT)
  },

  getAdminLapangan() {
    return api.get(ENDPOINTS.DASHBOARD.ADMIN_LAPANGAN)
  }
}