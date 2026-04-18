import api from '../lib/api'
import { ENDPOINTS } from '../lib/endpoints'

export const profilPerusahaanService = {
  get() {
    return api.get(ENDPOINTS.WEBSITE.GET)
  },

  update(data) {
    return api.post(ENDPOINTS.WEBSITE.UPDATE, data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  }
}