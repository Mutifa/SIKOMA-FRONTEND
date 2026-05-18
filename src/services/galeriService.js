import api from '../lib/api'

const galeriService = {

  // Ambil semua galeri
  getAll: () =>
    api.get('/galeri'),

  // Detail galeri
  get: (id) =>
    api.get(`/galeri/${id}`),

  // Tambah galeri
  create: (data) =>
    api.post('/galeri', data),

  // Update galeri
  update: (id, data) =>
    api.put(`/galeri/${id}`, data),  // ← PUT bukan POST

  // Hapus galeri
  delete: (id) =>
    api.delete(`/galeri/${id}`),

}

export default galeriService