import api from '../lib/api'

const kawasanService = {

  // Ambil semua kawasan
  getAll: () =>
    api.get('/kawasan'),
  
  // Detail kawasan
  getById: (id) =>
    api.get(`/kawasan/${id}`),

  // Tambah kawasan
  create: (data) =>
    api.post('/kawasan', data),

  // Update kawasan
  update: (id, data) =>
    api.put(`/kawasan/${id}`, data),

  // Hapus kawasan
  delete: (id) =>
    api.delete(`/kawasan/${id}`),

}

export default kawasanService