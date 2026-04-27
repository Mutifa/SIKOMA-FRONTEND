import React from 'react'
import AdminPusatLayout from '../../layouts/AdminPusatLayout.jsx'
import api from '../../lib/api.js'
import kawasanService from '../../services/kawasanService.js'

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
    api.get('/admin_pusat/kawasan')
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

      if (formData.gambar) {
        formDataToSend.append('gambar', formData.gambar)
      }

      if (data) {
        formDataToSend.append('_method', 'PUT')
        await api.post(`/admin_pusat/kawasan/${data.id}`, formDataToSend)
      } else {
        await api.post('/admin_pusat/kawasan', formDataToSend)
      }

      setSuccess('Berhasil disimpan')
      setIsEdit(false)

      const res = await api.get('/admin_pusat/kawasan')
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
      <AdminPusatLayout title="Kawasan Konservasi">
        <div className="text-center">
          <div className="spinner-border"></div>
        </div>
      </AdminPusatLayout>
    )
  }

  return (
    <AdminPusatLayout title="Kawasan Konservasi">

      {success && <div className="alert alert-success">{success}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      {/* ================= VIEW ================= */}

      <div className="white-box">

        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <div className="box-title mb-3">Kelola halaman kawasan konservasi</div>
          </div>

          <button
            className="btn btn-success"
            onClick={() => setIsEdit(true)} >
            Edit
          </button>
        </div>


        {/* FOTO */}
        <div className="row mt-3">
          <div className="col-md-12 mb-3">
            <label>Foto Kawasan</label>
            <div
              className="form-control bg-white d-flex align-items-center justify-content-center"
              style={{ height: '150px' }}
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
            <label>Luas Kawasan</label>
            <div className="form-control bg-white">{formData.luasKawasan}</div>
          </div>

          <div className="col-md-6 mb-3">
            <label>Jenis Kawasan</label>
            <div className="form-control bg-white">{formData.jenisKawasan}</div>
          </div>

          <div className="col-md-6 mb-3">
            <label>Kondisi</label>
            <div className="form-control bg-white">{formData.kondisi}</div>
          </div>

          <div className="col-md-6 mb-3">
            <label>Alamat</label>
            <div className="form-control bg-white">{formData.alamat}</div>
          </div>

          <div className="col-md-12 mb-3">
            <label>Status</label>
            <div className="form-control bg-white">{formData.status}</div>
          </div>

          <div className="col-md-12 mb-3">
            <label>Deskripsi</label>
            <div className="form-control bg-white">{formData.deskripsi}</div>
          </div>
       </div>
      </div>


      {/* ================= EDIT ================= */}

      {isEdit && (
        <>
          <div className="modal fade show d-block">
            <div className="modal-dialog modal-xl">
              <div className="modal-content">

                <div className="modal-header">
                  <h5 className="modal-title">Edit Kawasan Konservasi</h5>
                  <button
                    className="btn-close"
                    onClick={() => setIsEdit(false)}
                  ></button>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="modal-body">

                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label>Luas Kawasan</label>
                        <input
                          type="text"
                          className="form-control"
                          name="luasKawasan"
                          value={formData.luasKawasan}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="col-md-6 mb-3">
                        <label>Jenis Kawasan</label>
                        <input
                          type="text"
                          className="form-control"
                          name="jenisKawasan"
                          value={formData.jenisKawasan}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="col-md-6 mb-3">
                        <label>Kondisi</label>
                        <input
                          type="text"
                          className="form-control"
                          name="kondisi"
                          value={formData.kondisi}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="col-md-6 mb-3">
                        <label>Alamat</label>
                        <textarea
                          className="form-control"
                          name="alamat"
                          value={formData.alamat}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="col-md-12 mb-3">
                        <label>Status</label>
                        <textarea
                          className="form-control"
                          name="status"
                          value={formData.status}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="col-md-12 mb-3">
                        <label>Deskripsi</label>
                        <textarea
                          className="form-control"
                          name="deskripsi"
                          value={formData.deskripsi}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="col-md-12 mb-3">
                        <label>Foto</label>
                        <input
                          type="file"
                          className="form-control"
                          name="gambar"
                          onChange={handleFileChange}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setIsEdit(false)}
                    >
                      Batal
                    </button>
                    <button type="submit" className="btn btn-success">
                      Simpan
                    </button>
                  </div>
                </form>

              </div>
            </div>
          </div>

          {/* backdrop */}
          <div className="modal-backdrop fade show"></div>
        </>
      )}
    </AdminPusatLayout>
  )
}