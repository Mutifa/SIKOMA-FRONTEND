import api from '../lib/api'

export const getStandar = () =>
  api.get('/standar-pelayanan')

export const createStandar = (data) =>
  api.post('/standar-pelayanan', data)

export const updateStandar = (id, data) =>
  api.put(`/standar-pelayanan/${id}`, data)

export const deleteStandar = (id) =>
  api.delete(`/standar-pelayanan/${id}`)