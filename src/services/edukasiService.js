import api from '../lib/api'
import { ENDPOINTS } from '../lib/endpoints'

export const edukasiService = {
  get: () => api.get('/program')
}