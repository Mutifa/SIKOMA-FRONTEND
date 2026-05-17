import api from '../lib/api'

const peraturanService = {

  // Ambil semua peraturan
  getAll: () =>
    api.get('/peraturan'),

  // Detail peraturan
  get: (id) =>
    api.get(`/peraturan/${id}`),

  // Tambah peraturan
  create: (data) =>
    api.post('/peraturan', data),

  // Update peraturan
  update: (id, data) =>
    api.put(`/peraturan/${id}`, data),

  // Hapus peraturan
  delete: (id) =>
    api.delete(`/peraturan/${id}`),

}

export default peraturanService