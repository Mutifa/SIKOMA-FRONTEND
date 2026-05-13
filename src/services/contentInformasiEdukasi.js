import api from '../lib/api'

const contentInformasiEdukasi = {

  // Ambil semua konten edukasi
  getAll: () =>
    api.get('/admin_pusat/edukasi'),

  // Detail konten edukasi
  get: (id) =>
    api.get(`/admin_pusat/edukasi/${id}`),

  // Tambah konten edukasi
  create: (data) =>
    api.post('/admin_pusat/edukasi', data),

  // Update konten edukasi
  update: (id, data) =>
    api.post(`/admin_pusat/edukasi/${id}`, data),

  // Hapus konten edukasi
  delete: (id) =>
    api.delete(`/admin_pusat/edukasi/${id}`),

}

export default contentInformasiEdukasi