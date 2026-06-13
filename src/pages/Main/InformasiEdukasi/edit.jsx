import React from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import DashboardLayout from '../../../layouts/DashboardLayout.jsx'
import adminInformasiEdukasiService from '../../../services/adminInformasiEdukasiService.js'
import { assetUrl } from '../../../lib/assets.js'
import { successAlert, errorAlert } from '../../../utils/alert'

export default function KontenEdit() {

  const navigate = useNavigate()
  const { id } = useParams()

  const [loading, setLoading] = React.useState(true)
  const [formData, setFormData] = React.useState({
    judul: '',
    deskripsi: '',
    foto: null,
    kategori: 'Informasi'
  })
  const [preview, setPreview] = React.useState('')

  React.useEffect(() => {
    let mounted = true

    adminInformasiEdukasiService.getById(id)
      .then(res => {
        if (mounted) {
          const data = res.data.data || res.data
          setFormData({
            judul: data.judul || '',
            deskripsi: data.deskripsi || '',
            foto: null,
            kategori: data.kategori || 'Informasi'
          })
          setPreview(data.foto || '')
          setLoading(false)
        }
      })
      .catch(() => setLoading(false))

    return () => { mounted = false }
  }, [id])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const formDataToSend = new FormData()
      formDataToSend.append('judul', formData.judul)
      formDataToSend.append('deskripsi', formData.deskripsi)
      formDataToSend.append('kategori', formData.kategori)
      if (formData.foto) formDataToSend.append('foto', formData.foto)
      formDataToSend.append('_method', 'PUT')

      await adminInformasiEdukasiService.update(id, formDataToSend)
      await successAlert('Berhasil', 'Konten berhasil diupdate')
      navigate('/dashboard/informasi-edukasi')
    } catch (err) {
      await errorAlert('Gagal', err.response?.data?.message || 'Gagal mengupdate konten')
      console.error(err)
    }
  }

  if (loading) {
    return <DashboardLayout title="Edit Konten"></DashboardLayout>
  }

  return (
    <DashboardLayout
      title="Edit Konten"
      actions={
        <div className="d-flex flex-wrap gap-2 justify-content-between align-items-center">
          <button type="submit" form="edukasi-edit-form" className="btn btn-success">Update</button>
          <Link to="/dashboard/informasi-edukasi" className="btn btn-secondary">Kembali</Link>
        </div>
      }
    >
      <form id="edukasi-edit-form" onSubmit={handleSubmit}>
        <div className="white-box">

          <div className="mb-3">
            <label className="form-label">Judul</label>
            <input type="text" className="form-control" value={formData.judul}
              onChange={(e) => setFormData({ ...formData, judul: e.target.value })} required />
          </div>

          <div className="mb-3">
            <label className="form-label">Kategori</label>
            <select className="form-control" value={formData.kategori}
              onChange={(e) => setFormData({ ...formData, kategori: e.target.value })}>
              <option value="Informasi">Informasi</option>
              <option value="Edukasi">Edukasi</option>
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label">Foto</label>
            <input type="file" className="form-control" accept="image/*"
              onChange={(e) => setFormData({ ...formData, foto: e.target.files[0] })} />
          </div>

          {preview && (
            <div className="mb-3">
              <label className="form-label">Foto Saat Ini</label>
              <div>
                <img
                  src={assetUrl(`/uploads/edukasi/${preview}`)}
                  alt="Preview"
                  className="img-thumbnail"
                  width={320}
                  height={200}
                  loading="lazy"
                  decoding="async"
                  style={{ width: 'auto', maxHeight: '200px', objectFit: 'contain' }}
                />
              </div>
            </div>
          )}

          <div className="mb-3">
            <label className="form-label">Deskripsi</label>
            <textarea className="form-control" rows="5" value={formData.deskripsi}
              onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })} />
          </div>

        </div>
      </form>
    </DashboardLayout>
  )
}
