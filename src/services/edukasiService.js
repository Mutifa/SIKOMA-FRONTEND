import api from '../lib/api'

export const edukasiService = {

  getAll: () =>
    api.get('/edukasi'),

  getById: (id) =>
    api.get(`/edukasi/${id}`),

  create: (data) =>
    api.post('/edukasi', data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),

  update: (id, data) =>
    api.put(`/edukasi/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),

  delete: (id) =>
    api.delete(`/edukasi/${id}`),

}