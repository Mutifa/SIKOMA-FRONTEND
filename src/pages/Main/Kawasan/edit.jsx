import React from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import DashboardLayout from '../../../layouts/DashboardLayout'
import kawasanService from '../../../services/kawasanService'
import { successAlert, errorAlert } from '../../../utils/alert'

export default function KawasanEdit() {

  const { id } = useParams()
  const navigate = useNavigate()

  const [loading, setLoading] = React.useState(true)
  const [saving, setSaving] = React.useState(false)
  const [preview, setPreview] = React.useState('')
  const [error, setError] = React.useState('')

  const [formData, setFormData] = React.useState({
    deskripsi: '',
    luasKawasan: '',
    jenisKawasan: '',
    alamat: '',
    kondisi: '',
    status: '',
    gambar: null
  })

  // Fungsi untuk menghapus tag HTML dari string
  const stripHtmlTags = (html) => {
    if (!html) return ''
    return html.replace(/<[^>]*>/g, '')
  }

  // Fetch data kawasan berdasarkan id saat komponen pertama kali dimuat
  React.useEffect(() => {
    let mounted = true

    kawasanService.getById(id)
      .then(res => {
        if (mounted) {

          // getById mengembalikan satu object, bukan array
          const item = res.data.data || res.data

          if (!item) {
            setError('Data kawasan tidak ditemukan')
            setLoading(false)
            return
          }

          // Isi formData dengan data dari API
          setFormData({
            deskripsi: stripHtmlTags(item.deskripsi) || '',
            luasKawasan: item.luasKawasan || '',
            jenisKawasan: item.jenisKawasan || '',
            alamat: item.alamat || '',
            kondisi: item.kondisi || '',
            status: item.status || '',
            gambar: null
          })

          // Simpan nama file gambar untuk preview
          setPreview(item.gambar || '')

          setLoading(false)
        }
      })
      .catch(err => {
        if (mounted) {
          setError(err.response?.data?.message || 'Gagal memuat data kawasan')
          setLoading(false)
        }
      })

    return () => { mounted = false }
  }, [id])

  // Handle perubahan input text / textarea
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  // Handle perubahan input file
  const handleFileChange = (e) => {
    const file = e.target.files[0] || null
    setFormData(prev => ({ ...prev, gambar: file }))

    if (file) {
      setPreview(URL.createObjectURL(file))
    }
  }

  React.useEffect(() => {
    return () => {
      if (preview.startsWith('blob:')) {
        URL.revokeObjectURL(preview)
      }
    }
  }, [preview])

  // Handle submit form
  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validasi deskripsi tidak boleh kosong
    if (!formData.deskripsi.trim()) {
      await errorAlert('Deskripsi tidak boleh kosong')
      return
    }

    setSaving(true)

    try {
      // Gunakan FormData untuk mengirim data termasuk file
      const formDataToSend = new FormData()
      formDataToSend.append('_method', 'PUT')
      formDataToSend.append('deskripsi', formData.deskripsi)
      formDataToSend.append('luasKawasan', formData.luasKawasan)
      formDataToSend.append('jenisKawasan', formData.jenisKawasan)
      formDataToSend.append('alamat', formData.alamat)
      formDataToSend.append('kondisi', formData.kondisi)
      formDataToSend.append('status', formData.status)

      // Hanya append gambar jika ada file baru dipilih
      if (formData.gambar) formDataToSend.append('gambar', formData.gambar)

      await kawasanService.update(id, formDataToSend)

      await successAlert('Berhasil', 'Kawasan berhasil diperbarui')
      navigate('/kawasan')

    } catch (err) {
      await errorAlert(err.response?.data?.message || 'Gagal menyimpan')
    } finally {
      setSaving(false)
    }
  }

  // Tampilkan loading kosong saat data sedang dimuat
  if (loading) {
    return (
      <DashboardLayout title="Edit Kawasan Konservasi">
        <div className="d-flex justify-content-center">
          <div className="spinner-border"></div>
        </div>
      </DashboardLayout>
    )
  }

  return (

    <DashboardLayout title="Edit Kawasan Konservasi">

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="white-box">

          <div className="row">

            <div className="col-md-6 mb-3">
              <label className="form-label">Luas Kawasan</label>
              <input
                type="text"
                className="form-control"
                name="luasKawasan"
                value={formData.luasKawasan}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">Jenis Kawasan</label>
              <input
                type="text"
                className="form-control"
                name="jenisKawasan"
                value={formData.jenisKawasan}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">Kondisi</label>
              <input
                type="text"
                className="form-control"
                name="kondisi"
                value={formData.kondisi}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">Alamat</label>
              <textarea
                className="form-control"
                name="alamat"
                value={formData.alamat}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-12 mb-3">
              <label className="form-label">Status</label>
              <textarea
                className="form-control"
                name="status"
                value={formData.status}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-12 mb-3">
              <label className="form-label">Deskripsi</label>
              <textarea
                className="form-control"
                rows="5"
                name="deskripsi"
                value={formData.deskripsi}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-12 mb-3">
              <label className="form-label">Foto</label>
              <input
                type="file"
                className="form-control"
                name="gambar"
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>

            {/* Tampilkan preview foto yang sudah ada atau baru dipilih */}
            {preview && (
              <div className="col-md-12 mb-3">
                <label className="form-label">{formData.gambar ? 'Foto Baru' : 'Foto Saat Ini'}</label>
                <div>
                  <img
                    src={formData.gambar ? preview : `https://codemy.my.id/uploads/kawasan/${preview}`}
                    alt="Preview"
                    className="img-thumbnail"
                    style={{ maxHeight: '200px' }}
                  />
                </div>
              </div>
            )}

          </div>

          <div className="d-flex gap-2">
            <button
              type="submit"
              className="btn-primary-custom"
              disabled={saving}
            >
              {saving ? 'Menyimpan...' : 'Simpan'}
            </button>

            <Link to="/kawasan" className="btn btn-secondary">
              Kembali
            </Link>
          </div>

        </div>
      </form>

    </DashboardLayout>

  )
}
