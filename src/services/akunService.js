import api from '../lib/api'

export const akunService = {

  // Ambil profile user login
  getProfile: () =>
    api.get('/profile'),

  // Update profile
  updateProfile: (data) =>
    api.put('/profile', data),

  // Update password
  updatePassword: (data) =>
    api.put('/password', data),

}