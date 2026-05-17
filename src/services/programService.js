import api from '../lib/api'

const programService = {

  getAll: () =>
    api.get('/admin_pusat/program'),

  getById: (id) =>
    api.get(`/admin_pusat/program/${id}`),

  create: (data) =>
    api.post('/admin_pusat/program', data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }),

  update: (id, data) =>
    api.post(`/admin_pusat/program/${id}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }),

  delete: (id) =>
    api.delete(`/admin_pusat/program/${id}`),

}

export default programService