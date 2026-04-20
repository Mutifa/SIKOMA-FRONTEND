import api from '../lib/api'
import { ENDPOINTS } from '../lib/endpoints'

const kawasanService = {
  getAll: () => api.get(ENDPOINTS.KAWASAN.GET),
  create: (data) => api.post(ENDPOINTS.KAWASAN.CREATE, data),
  update: (id, data) => api.post(ENDPOINTS.KAWASAN.UPDATE(id), data),
  delete: (id) => api.delete(ENDPOINTS.KAWASAN.DELETE(id)),
}

export default kawasanService