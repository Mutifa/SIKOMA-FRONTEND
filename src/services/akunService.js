import api from '../lib/api'

export const akunService = {

  // Ambil profile user login
  getProfile: () =>
    api.get('/admin_pusat/profile'),

  // Update profile
  updateProfile: (data) =>
    api.post('/admin_pusat/profile/update', data),

  // Update password
  updatePassword: (data) =>
    api.put('/password', data),

}
