import api from '../lib/api'

const informasiEdukasiService = {

  // Ambil semua data informasi
  getAll: () =>
    api.get('/informasi'),

}
export default informasiEdukasiService