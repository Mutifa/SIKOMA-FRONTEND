import api from '../lib/api'

const informasiEdukasiService = {

  // Ambil semua data informasi
  getAll: () =>
    api.get('/edukasi'),
  getById: (id) => api.get(`/edukasi/${id}`),

}
export default informasiEdukasiService