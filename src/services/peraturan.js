import api from '../lib/api'

const peraturanService = {

  // Ambil semua peraturan
  getAll: () =>
    api.get('/admin_pusat/peraturan'),

  // Detail peraturan
  get: (id) =>
    api.get(`/admin_pusat/peraturan/${id}`),

  // Tambah peraturan
  create: (data) =>
    api.post('/admin_pusat/peraturan', data),

  // Update peraturan
  update: (id, data) =>
    api.post(`/admin_pusat/peraturan/${id}`, data),

  // Hapus peraturan
  delete: (id) =>
    api.delete(`/admin_pusat/peraturan/${id}`),

}

export default peraturanService