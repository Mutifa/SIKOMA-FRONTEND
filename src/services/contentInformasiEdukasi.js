import api from '../lib/api'

const contentInformasiEdukasi = {

  // Ambil semua konten edukasi
  getAll: () =>
    api.get('/admin_pusat/program'),

  // Detail konten edukasi
  get: (id) =>
    api.get(`/admin_pusat/program/${id}`),

  // Tambah konten edukasi
  create: (data) =>
    api.post('/admin_pusat/program', data),

  // Update konten edukasi
  update: (id, data) =>
    api.post(`/admin_pusat/program/${id}`, data),

  // Hapus konten edukasi
  delete: (id) =>
    api.delete(`/admin_pusat/program/${id}`),

}

export default contentInformasiEdukasi