import api from '../lib/api'

const informasiEdukasiService = {

  getAll: () =>
    api.get('/informasi'),

  getById: (id) =>
    api.get(`/edukasi/${id}`),

}

export default informasiEdukasiService