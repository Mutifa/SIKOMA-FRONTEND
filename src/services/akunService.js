import api from '../lib/api'

const getProfileEndpoint = (role) => {
  return role === 'admin_lapangan'
    ? '/admin_lapangan/profile'
    : '/admin_pusat/profile'
}

export const akunService = {

  // Ambil profile user login
  getProfile: (role) =>
    api.get(getProfileEndpoint(role)),

  // Update profile
  updateProfile: (data) =>
    api.post('/admin_pusat/profile/update', data),

  // Update password
  updatePassword: (data) =>
    api.put('/password', data),

}
