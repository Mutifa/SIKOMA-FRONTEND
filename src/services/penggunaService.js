import api from '../lib/api'

export const penggunaService = {

  // Ambil semua pengguna
  getAll: () =>
    api.get('/pengguna'),

  // Ambil detail pengguna
  getById: (id) =>
    api.get(`/pengguna/${id}`),

  // Tambah pengguna
  create: (data) =>
    api.post('/pengguna', data),

  // Update pengguna
  update: (id, data) =>
    api.put(`/pengguna/${id}`, data),

  // Hapus pengguna
  delete: (id) =>
    api.delete(`/pengguna/${id}`),

}