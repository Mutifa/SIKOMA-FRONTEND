import api from '../lib/api'

const standarPelayananService = {

  // Ambil semua data standar pelayanan
  getAll: () =>
    api.get('/standar-pelayanan'),

  // Buat standar pelayanan baru
  create: (data) =>
    api.post('/standar-pelayanan', data),

  // Perbarui standar pelayanan
  update: (id, data) =>
    api.put(`/standar-pelayanan/${id}`, data),

  // Hapus standar pelayanan
  delete: (id) =>
    api.delete(`/standar-pelayanan/${id}`)

}

export default standarPelayananService
  api.post('/standar-pelayanan', data)

export const updateStandar = (id, data) =>
  api.put(`/standar-pelayanan/${id}`, data)

export const deleteStandar = (id) =>
  api.delete(`/standar-pelayanan/${id}`)