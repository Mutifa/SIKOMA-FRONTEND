import api from '../lib/api'

const contentInformasiEdukasi = {

  // Ambil semua edukasi
  getAll: () =>
    api.get('/edukasi'),

  // Detail edukasi
  get: (id) =>
    api.get(`/edukasi/${id}`),

  // Tambah edukasi
  create: (data) =>
    api.post('/edukasi', data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),

    // Update edukasi
  update: (id, data) =>
    api.post(`/edukasi/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),

    // Hapus edukasi
  delete: (id) =>
    api.delete(`/edukasi/${id}`),

}

export default contentInformasiEdukasi