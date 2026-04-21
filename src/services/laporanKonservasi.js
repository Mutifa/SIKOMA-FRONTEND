import api from '../lib/api'
import { ENDPOINTS } from '../lib/endpoints'

export const laporanService = {
  getAll: () => api.get(ENDPOINTS.LAPORAN_ADMIN.GET),
  create: (data) => api.post(ENDPOINTS.LAPORAN_ADMIN.CREATE, data),
  update: (id, data) => api.put(ENDPOINTS.LAPORAN_ADMIN.UPDATE(id), data),
  delete: (id) => api.delete(ENDPOINTS.LAPORAN_ADMIN.DELETE(id)),
  updateStatus: (id, status) =>
    api.put(ENDPOINTS.LAPORAN_ADMIN.UPDATE_STATUS(id), { status })
}

export const laporanKonservasiService = {
  getAll: () => api.get(ENDPOINTS.ADMIN_LAPANGAN_LAPORAN.GET),

 create: (data) =>
  api.post('/admin_lapangan/laporanKonservasi', data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }),

  delete: (id) =>
    api.delete(ENDPOINTS.ADMIN_LAPANGAN_LAPORAN.DELETE(id))
}