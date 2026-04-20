import api from '../lib/api'
import { ENDPOINTS } from '../lib/endpoints'

export const getStandar = () => api.get('/admin_pusat/standar-pelayanan')

export const createStandar = (data) =>
  api.post('/admin_pusat/standar-pelayanan', data)

export const updateStandar = (id, data) =>
  api.post(`/admin_pusat/standar-pelayanan/${id}`, data)

export const deleteStandar = (id) =>
  api.delete(`/admin_pusat/standar-pelayanan/${id}`)