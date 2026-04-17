import api from '../lib/api'
import { ENDPOINTS } from '../lib/endpoints'

export const informasiService = {
  get: () => api.get(ENDPOINTS.INFORMASI.GET),
}