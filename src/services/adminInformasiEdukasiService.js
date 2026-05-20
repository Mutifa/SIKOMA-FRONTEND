import api from '../lib/api'

const adminInformasiEdukasiService = {

  getAll: () =>
    api.get('/edukasi'),

  getById: (id) =>
    api.get(`/edukasi/${id}`),

  create: (data) =>
    api.post('/edukasi', data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),

 update: (id, data) =>
  api.post(`/edukasi/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),

  delete: (id) =>
    api.delete(`/edukasi/${id}`),

}

export default adminInformasiEdukasiService