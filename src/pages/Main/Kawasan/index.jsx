import React from 'react'
import DashboardLayout from '../../../layouts/DashboardLayout'
import kawasanService from '../../../services/kawasanService'
import {
  confirmDelete,
  successAlert,
  errorAlert
} from '../../../utils/alert'

export default function Kawasan() {

  const [data, setData] = React.useState(null)
  const [error, setError] = React.useState('')
  const [loading, setLoading] = React.useState(true)
  const [isEdit, setIsEdit] = React.useState(false)
  const [saving, setSaving] = React.useState(false)
  const [success, setSuccess] = React.useState('')
  const [formData, setFormData] = React.useState({
    deskripsi: '',
    luasKawasan: '',
    jenisKawasan: '',
    alamat: '',
    kondisi: '',
    status: '',
    gambar: null
  })

  const stripHtmlTags = (html) => {
    if (!html) return ''
    return html.replace(/<[^>]*>/g, '')
  }

  React.useEffect(() => {
    kawasanService.getAll()
      .then(res => {
        const kawasan = res.data.data || res.data
        if (kawasan && kawasan.length > 0) {
          setData(kawasan[0])
          setFormData({
            deskripsi: stripHtmlTags(kawasan[0].deskripsi) || '',
            luasKawasan: kawasan[0].luasKawasan || '',
            jenisKawasan: kawasan[0].jenisKawasan || '',
            alamat: kawasan[0].alamat || '',
            kondisi: kawasan[0].kondisi || '',
            status: kawasan[0].status || '',
            gambar: null
          })
        }
        setLoading(false)
      })
      .catch(err => {
        setError(err.response?.data?.message || 'Gagal memuat')
        setLoading(false)
      })
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e) => {
    const { name, files } = e.target
    setFormData(prev => ({ ...prev, [name]: files[0] }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')

    try {
      const formDataToSend = new FormData()
      formDataToSend.append('deskripsi', formData.deskripsi)
      formDataToSend.append('luasKawasan', formData.luasKawasan)
      formDataToSend.append('jenisKawasan', formData.jenisKawasan)
      formDataToSend.append('alamat', formData.alamat)
      formDataToSend.append('kondisi', formData.kondisi)
      formDataToSend.append('status', formData.status)
      if (formData.gambar) formDataToSend.append('gambar', formData.gambar)

      if (data) {
        formDataToSend.append('_method', 'PUT')
        await kawasanService.update(data.id, formDataToSend)
      } else {
        await kawasanService.create(formDataToSend)
      }

      setSuccess('Berhasil disimpan')
      setIsEdit(false)

      const res = await kawasanService.getAll(  )
      const kawasan = res.data.data || res.data
      setData(kawasan[0])

    } catch (err) {
      setError(err.response?.data?.message || 'Gagal menyimpan')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <DashboardLayout title="Kawasan Konservasi">
        <div className="d-flex justify-content-center">
          <div className="spinner-border"></div>
        </div>
      </DashboardLayout>
    )
  }

  return (

    <DashboardLayout title="Kawasan Konservasi">

      {/* Alert — pakai class dari Dashboard.css */}
      {success && <div className="alert alert-success">{success}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      {/* ── VIEW ── */}
      <div className="white-box">

        <div className="d-flex justify-content-between align-items-center mb-3">

          <div className="box-title mb-0">
            Kelola halaman kawasan konservasi
          </div>

          {/* Tombol Edit — btn-primary-custom */}
          <button
            className="btn-primary-custom"
            onClick={() => setIsEdit(true)}
          >
            <i className="fas fa-pen"></i>
            Edit Kawasan
          </button>

        </div>

        {/* Foto */}
        <div className="row mt-3">
          <div className="col-md-12 mb-3">
            <label className="form-label">Foto Kawasan</label>
            <div
              className="form-control d-flex align-items-center justify-content-center"
              style={{ height: '150px', background: '#f8f9fa' }}
            >
              {data?.gambar ? (
                <img
                  src={`https://codemy.my.id/uploads/${data.gambar}`}
                  alt="Foto Kawasan"
                  style={{ maxHeight: '120px' }}
                />
              ) : (
                <span className="text-muted">Tidak ada gambar</span>
              )}
            </div>
          </div>
        </div>

        <div className="row mt-3">
          <div className="col-md-6 mb-3">
            <label className="form-label">Luas Kawasan</label>
            <div className="form-control" style={{ background: '#f8f9fa' }}>{formData.luasKawasan || '-'}</div>
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Jenis Kawasan</label>
            <div className="form-control" style={{ background: '#f8f9fa' }}>{formData.jenisKawasan || '-'}</div>
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Kondisi</label>
            <div className="form-control" style={{ background: '#f8f9fa' }}>{formData.kondisi || '-'}</div>
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Alamat</label>
            <div className="form-control" style={{ background: '#f8f9fa' }}>{formData.alamat || '-'}</div>
          </div>
          <div className="col-md-12 mb-3">
            <label className="form-label">Status</label>
            <div className="form-control" style={{ background: '#f8f9fa' }}>{formData.status || '-'}</div>
          </div>
          <div className="col-md-12 mb-3">
            <label className="form-label">Deskripsi</label>
            <div className="form-control" style={{ background: '#f8f9fa' }}>{formData.deskripsi || '-'}</div>
          </div>
        </div>

      </div>

      {/* ── MODAL EDIT ── */}
      {isEdit && (
        <>
          <div className="modal fade show d-block">
            <div className="modal-dialog modal-xl">
              <div className="modal-content">

                <div className="modal-header">
                  <h5 className="modal-title">Edit Kawasan Konservasi</h5>
                  <button className="btn-close" onClick={() => setIsEdit(false)}></button>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="modal-body">
                    <div className="row">

                      <div className="col-md-6 mb-3">
                        <label className="form-label">Luas Kawasan</label>
                        <input type="text" className="form-control" name="luasKawasan" value={formData.luasKawasan} onChange={handleChange} />
                      </div>

                      <div className="col-md-6 mb-3">
                        <label className="form-label">Jenis Kawasan</label>
                        <input type="text" className="form-control" name="jenisKawasan" value={formData.jenisKawasan} onChange={handleChange} />
                      </div>

                      <div className="col-md-6 mb-3">
                        <label className="form-label">Kondisi</label>
                        <input type="text" className="form-control" name="kondisi" value={formData.kondisi} onChange={handleChange} />
                      </div>

                      <div className="col-md-6 mb-3">
                        <label className="form-label">Alamat</label>
                        <textarea className="form-control" name="alamat" value={formData.alamat} onChange={handleChange} />
                      </div>

                      <div className="col-md-12 mb-3">
                        <label className="form-label">Status</label>
                        <textarea className="form-control" name="status" value={formData.status} onChange={handleChange} />
                      </div>

                      <div className="col-md-12 mb-3">
                        <label className="form-label">Deskripsi</label>
                        <textarea className="form-control" name="deskripsi" value={formData.deskripsi} onChange={handleChange} />
                      </div>

                      <div className="col-md-12 mb-3">
                        <label className="form-label">Foto</label>
                        <input type="file" className="form-control" name="gambar" onChange={handleFileChange} />
                      </div>

                    </div>
                  </div>

                  <div className="modal-footer">

                    {/* Batal — btn-secondary-custom */}
                    <button
                      type="button"
                      className="btn-secondary-custom"
                      onClick={() => setIsEdit(false)}
                    >
                      Batal
                    </button>

                    {/* Simpan — btn-primary-custom */}
                    <button
                      type="submit"
                      className="btn-primary-custom"
                      disabled={saving}
                    >
                      {saving ? 'Menyimpan...' : 'Simpan'}
                    </button>

                  </div>
                </form>

              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </>
      )}

    </DashboardLayout>

  )
}