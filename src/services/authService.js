import api from '../lib/api'

export const authService = {

  login: (data) =>
    api.post('/auth/login', data),

  logout: () =>
    api.post('/auth/logout'),

  me: () =>
    api.get('/admin_lapangan/profile'),

forgotPassword: (data) =>
    api.post('/auth/forgot-password', data),

  resetPassword: (data) =>
    api.post('/auth/reset-password', data),

  verifyEmail: (id, hash) =>
    api.get(`/auth/verify-email/${id}/${hash}`),

  resendVerification: () =>
    api.post('/auth/email/verification-notification'),

}