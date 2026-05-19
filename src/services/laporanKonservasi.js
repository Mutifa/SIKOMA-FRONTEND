import api from '../lib/api'
import { ENDPOINTS } from '../lib/endpoints'

export const laporanKonservasiService = {
  getAll() {
    return api.get('/laporan-konservasi')
  },
  getById(id) {
    return api.get(`/laporan-konservasi/${id}`)
  },
  create(data) {
    return api.post('/laporan-konservasi', data)
  },
  update(id, data) {
    return api.post(`/laporan-konservasi/${id}?_method=PUT`, data)
  },
  delete(id) {
    return api.delete(`/laporan-konservasi/${id}`)
  },
  validasi(id, data) {
    return api.put(`/laporan-konservasi/${id}/status`, data)
  }
}