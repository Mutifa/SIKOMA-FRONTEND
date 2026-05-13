import api from '../lib/api'

const galeriService = {

  // Ambil semua galeri
  getAll: () =>
    api.get('/admin_pusat/galeri'),

  // Detail galeri
  get: (id) =>
    api.get(`/admin_pusat/galeri/${id}`),

  // Tambah galeri
  create: (data) =>
    api.post('/admin_pusat/galeri', data),

  // Update galeri
  update: (id, data) =>
    api.post(`/admin_pusat/galeri/${id}`, data),

  // Hapus galeri
  delete: (id) =>
    api.delete(`/admin_pusat/galeri/${id}`),

}

export default galeriService