import api from '../lib/api'

const profilPerusahaanService = {

  // Ambil data profil perusahaan
  get: () =>
    api.get('/admin_pusat/website'),

  // Update profil perusahaan
  update: (data) =>
    api.post('/admin_pusat/website', data),

}

export default profilPerusahaanService