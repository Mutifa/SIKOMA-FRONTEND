import api from '../lib/api'

const profilPerusahaanService = {

  get: () =>
    api.get('/admin_pusat/website')
      .catch(() => api.get('/home')),


update: (data) =>
  api.post('/admin_pusat/website', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    }
  }),

}

export default profilPerusahaanService
