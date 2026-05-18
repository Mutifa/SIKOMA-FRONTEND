import api from '../lib/api'

export const dashboardService = {
  getAdminPusat() {
    return api.get('/dashboard/admin-pusat')  // ✅ path baru
  },

  getAdminLapangan() {
    return api.get('/dashboard/admin-lapangan')  // ✅ path baru
  }
}