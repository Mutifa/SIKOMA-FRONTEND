import api from '../lib/api'

const informasiEdukasiService = {

  // Ambil semua data informasi
  getAll: () =>
    api.get('/informasi'),
  getById: (id) => api.get(`/informasi/${id}`),

}
export default informasiEdukasiService