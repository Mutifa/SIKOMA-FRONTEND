import api from '../lib/api'

export const programService = {

  // Ambil semua program
  getAll: () =>
    api.get('/admin_pusat/program'),

  // Detail program
  getById: (id) =>
    api.get(`/admin_pusat/program/${id}`),

  // Tambah program
  create: (data) =>
    api.post('/admin_pusat/program', data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }),

  // Update program
  update: (id, data) =>
    api.post(`/admin_pusat/program/${id}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }),

  // Hapus program
  delete: (id) =>
    api.delete(`/admin_pusat/program/${id}`),

}