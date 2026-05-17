import api from '../lib/api'
import { ENDPOINTS } from '../lib/endpoints'

export const kontenService = {

  getAll: () =>
    api.get(ENDPOINTS.KONTEN.GET),

  getDetail: (id) =>
    api.get(`/admin_pusat/program/${id}`),

  create: (data) =>
    api.post(ENDPOINTS.KONTEN.CREATE, data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }),

  update: (id, data) =>
    api.post(ENDPOINTS.KONTEN.UPDATE(id), data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }),

  delete: (id) =>
    api.delete(ENDPOINTS.KONTEN.DELETE(id))

}