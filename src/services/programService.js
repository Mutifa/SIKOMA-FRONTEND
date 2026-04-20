import api from '../lib/api'
import { ENDPOINTS } from '../lib/endpoints'

export const programService = {
  getAll: () => api.get(ENDPOINTS.PROGRAM.GET),

  create: (data) =>
    api.post(ENDPOINTS.PROGRAM.CREATE, data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),

  update: (id, data) =>
    api.post(ENDPOINTS.PROGRAM.UPDATE(id), data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),

  delete: (id) => api.delete(ENDPOINTS.PROGRAM.DELETE(id))
}