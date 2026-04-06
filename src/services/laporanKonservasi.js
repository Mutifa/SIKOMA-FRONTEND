import api from '../lib/api'
import { ENDPOINTS } from '../lib/endpoints'

export const laporanService = {
  get: () => api.get(ENDPOINTS.LAPORAN.GET),
  create: (data) => api.post(ENDPOINTS.LAPORAN.CREATE, data)
}