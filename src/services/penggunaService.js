import api from '../lib/api'

export const penggunaService = {

  // Ambil semua pengguna
  getAll: () =>
    api.get('/admin_pusat/pengguna'),

  // Ambil detail pengguna
  getById: (id) =>
    api.get(`/admin_pusat/pengguna/${id}`),

  // Tambah pengguna
  create: (data) =>
    api.post('/admin_pusat/pengguna', data),

  // Update pengguna
  update: (id, data) =>
    api.put(`/admin_pusat/pengguna/${id}`, data),

  // Hapus pengguna
  delete: (id) =>
    api.delete(`/admin_pusat/pengguna/${id}`),

}