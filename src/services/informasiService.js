import api from '../lib/api'

const informasiService = {

  // Ambil semua data informasi
  getAll: () =>
    api.get('/informasi'),

}

export default informasiService