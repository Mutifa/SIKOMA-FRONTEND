import api from '../lib/api'

const kawasanService = {

  // Ambil semua kawasan
  getAll: () =>
    api.get('/admin_pusat/kawasan'),

  // Tambah kawasan
  create: (data) =>
    api.post('/admin_pusat/kawasan', data),

  // Update kawasan
  update: (id, data) =>
    api.post(`/admin_pusat/kawasan/${id}`, data),

  // Hapus kawasan
  delete: (id) =>
    api.delete(`/admin_pusat/kawasan/${id}`),

}

export default kawasanService