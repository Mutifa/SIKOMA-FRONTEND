import api from '../lib/api'

const standarPelayananService = {

  // Admin
  getStandar: () =>
    api.get('/standar-pelayanan'),

  // Admin — tambah standar pelayanan
  createStandar: (data) =>
    api.post('/standar-pelayanan', data),

  // Admin — update standar pelayanan
  updateStandar: (id, data) =>
    api.put(`/standar-pelayanan/${id}`, data),

  // Admin — hapus standar pelayanan
  deleteStandar: (id) =>
    api.delete(`/standar-pelayanan/${id}`),

  // Public — ambil profil website (alamat, telepon, dll)
  getWebsite: () =>
    api.get('/profil-perusahaan'),

  // Public — kirim pesan/pertanyaan
  sendMessage: (data) =>
    api.post('/standar-pelayanan', data),

}

export default standarPelayananService