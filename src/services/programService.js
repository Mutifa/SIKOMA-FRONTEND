import api from '../lib/api'

const programService = {

  // Ambil semua program
  getAll: () =>
    api.get('/program'),

  // Detail program
  getById: (id) =>
    api.get(`/program/${id}`),

  // Tambah program
  create: (data) =>
    api.post('/program', data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }),

  // Update program
  update: (id, data) =>
    api.put(`/program/${id}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }),

  // Hapus program
  delete: (id) =>
    api.delete(`/program/${id}`),

}

export default programService