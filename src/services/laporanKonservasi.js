import api from '../lib/api'
import { ENDPOINTS } from '../lib/endpoints'

export const laporanKonservasiService = {
  // ====================================================
  // GET ALL DATA LAPORAN
  // Backend:
  // index()
  // ====================================================
  getAll() {
    return api.get('/laporan-konservasi')
  },
  // ====================================================
  // GET DETAIL LAPORAN
  // Backend:
  // show($id)
  // ====================================================
  getById(id) {
    return api.get(`/laporan-konservasi/${id}`)
  },
  // ====================================================
  // CREATE LAPORAN
  // Backend:
  // store()
  // ====================================================
  create(data) {
    return api.post(
      '/laporan-konservasi',
      data
    )
  },
  // ====================================================
  // UPDATE LAPORAN
  // Backend:
  // update()
  // ====================================================
  update(id, data) {
    return api.post(
      `/laporan-konservasi/${id}?_method=PUT`,
      data
    )
  },
  // ====================================================
  // DELETE LAPORAN
  // Backend:
  // destroy()
  // ====================================================
  delete(id) {
    return api.delete(
      `/laporan-konservasi/${id}`
    )
  },
  // ====================================================
  // VALIDASI LAPORAN
  // ====================================================
  validasi(id, data) {
    return api.post(
      `/laporan-konservasi/${id}/validasi`,
      data
    )
  }
}

