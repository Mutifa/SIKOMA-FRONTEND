import React from 'react'
import AdminPusatLayout from '../../layouts/AdminPusatLayout.jsx'
import { profilPerusahaanService } from '../../services/profilPerusahaanService'

export default function ProfilPerusahaan() {
  const [formData, setFormData] = React.useState({
    nama: '',
    deskripsi: '',
    keyword: '',
    alamat: '',
    telepon: '',
    email: '',
    facebook: '',
    instagram: '',
    wa: '',
    gmaps: '',
    jambuka: '',
    visi: '',
    misi: '',
    logo: null,
    struktur: null
  })
  const [loading, setLoading] = React.useState(true)
  const [saving, setSaving] = React.useState(false)
  const [error, setError] = React.useState('')
  const [success, setSuccess] = React.useState('')
  const [isEdit, setIsEdit] = React.useState(false)


  // 🔥 TAMBAHKAN DI SINI
  React.useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess('')
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [success])

  // Function to strip HTML tags
  const stripHtmlTags = (html) => {
    if (!html) return ''
    return html.replace(/<[^>]*>/g, '')
  }

  React.useEffect(() => {
    loadWebsiteData()
  }, [])

  const loadWebsiteData = async () => {
    try {
      const response = await profilPerusahaanService.get()
      const data = response.data
      setFormData({
        nama: stripHtmlTags(data.nama) || '',
        deskripsi: stripHtmlTags(data.deskripsi) || '',
        keyword: stripHtmlTags(data.keyword) || '',
        alamat: stripHtmlTags(data.alamat) || '',
        telepon: stripHtmlTags(data.telepon) || '',
        email: stripHtmlTags(data.email) || '',
        facebook: stripHtmlTags(data.facebook) || '',
        instagram: stripHtmlTags(data.instagram) || '',
        wa: stripHtmlTags(data.wa) || '',
        gmaps: stripHtmlTags(data.gmaps) || '',
        jambuka: stripHtmlTags(data.jambuka) || '',
        visi: stripHtmlTags(data.visi) || '',
        misi: stripHtmlTags(data.misi) || '',
        logo: data.logo || null,
        struktur: data.struktur || null
      })
      setLoading(false)
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal memuat data website')
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleFileChange = (e) => {
    const { name, files } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: files[0] || null
    }))
  }
  const handleSubmit = async (e) => {
    e.preventDefault()

    // 🔥 TAMBAHKAN INI
    if (!isEdit) return
    setSaving(true)
    setError('')
    setSuccess('')

    try {
      const formDataToSend = new FormData()

      Object.keys(formData).forEach(key => {
        if (key !== 'logo' && key !== 'struktur') {
          formDataToSend.append(key, formData[key] || '')
        }
      })
if (formData.logo instanceof File) {
  formDataToSend.append('logo', formData.logo)
}

if (formData.struktur instanceof File) {
  formDataToSend.append('struktur', formData.struktur)
}

      // 🔥 INI YANG DIGANTI
      await profilPerusahaanService.update(formDataToSend)

      await loadWebsiteData()

      setSuccess('Data website berhasil diperbarui')
      setIsEdit(false)

    } catch (err) {
      setError(err.response?.data?.message || 'Gagal menyimpan data')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <AdminPusatLayout title="Profil Perusahaan">
        <div className="d-flex justify-content-center">
          <div className="spinner-border" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      </AdminPusatLayout>
    )
  }

  return (
    <AdminPusatLayout title="Profil Perusahaan">
      {error && <div className="alert alert-danger alert-dismissible fade show" role="alert">
        {error}
        <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>}
      {success && <div className="alert alert-success alert-dismissible fade show" role="alert">
        {success}
        <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>}

      <div className="white-box">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="box-title">Profil Perusahaan</div>

          <button
            className="btn btn-success"
            onClick={() => setIsEdit(true)}
          >
            Edit
          </button>
        </div>
        <div className="row">

          <div className="col-md-6 mb-3">
            <label>Nama Website</label>
            <div className="form-control bg-light">{formData.nama || '-'}</div>
          </div>

          <div className="col-md-6 mb-3">
            <label>Meta Deskripsi</label>
            <div className="form-control bg-light">{formData.deskripsi || '-'}</div>
          </div>

          <div className="col-md-6 mb-3">
            <label>Meta Keyword</label>
            <div className="form-control bg-light">{formData.keyword || '-'}</div>
          </div>

          <div className="col-md-6 mb-3">
            <label>Alamat</label>
            <div className="form-control bg-light">{formData.alamat || '-'}</div>
          </div>

          <div className="col-md-6 mb-3">
            <label>Telepon</label>
            <div className="form-control bg-light">{formData.telepon || '-'}</div>
          </div>

          <div className="col-md-6 mb-3">
            <label>Email</label>
            <div className="form-control bg-light">{formData.email || '-'}</div>
          </div>

          <div className="col-md-6 mb-3">
            <label>Facebook</label>
            <div className="form-control bg-light">{formData.facebook || '-'}</div>
          </div>

          <div className="col-md-6 mb-3">
            <label>Instagram</label>
            <div className="form-control bg-light">{formData.instagram || '-'}</div>
          </div>

          <div className="col-md-12 mb-3">
            <label>WhatsApp</label>
            <div className="form-control bg-light">{formData.wa || '-'}</div>
          </div>

          <div className="col-md-12 mb-3">
            <label>Google Maps</label>
            <div className="form-control bg-light">{formData.gmaps || '-'}</div>
          </div>
        </div> {/* ✅ TUTUP ROW PERTAMA */}

        <div className="row"> {/* row baru */}
          <div className="col-md-6 mb-3">
            <label>Logo Website</label>
            <div className="form-control bg-light d-flex align-items-center justify-content-center" style={{ height: '120px' }}>
              {formData.logo ? (
                <img
                  src={`/img/${formData.logo}`}
                  alt="Logo"
                  style={{ maxHeight: '80px' }}
                />
              ) : 'Belum ada'}
            </div>
          </div>

          <div className="col-md-6 mb-3">
            <label>Struktur Organisasi</label>
            <div className="form-control bg-light d-flex align-items-center justify-content-center" style={{ height: '120px' }}>
              {formData.struktur ? (
                <img
                  src={`/img/${formData.struktur}`}
                  alt="Struktur"
                  style={{ maxHeight: '80px' }}
                />
              ) : 'Belum ada'}
            </div>
          </div>
        </div>


        {isEdit && (
          <div className="modal fade show d-block" style={{ background: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-xl">
              <div className="modal-content">

                <div className="modal-header">
                  <h5>Edit Profil Perusahaan</h5>
                  <button
                    className="btn-close"
                    onClick={() => {
                      setIsEdit(false)
                      loadWebsiteData()
                    }}
                  ></button>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="modal-body">

                    <div className="row">

                      <div className="col-md-6 mb-3">
                        <label>Nama Website</label>
                        <input type="text" className="form-control" name="nama" value={formData.nama} onChange={handleChange} />
                      </div>

                      <div className="col-md-6 mb-3">
                        <label>Meta Deskripsi</label>
                        <textarea className="form-control" name="deskripsi" value={formData.deskripsi} onChange={handleChange} />
                      </div>

                      <div className="col-md-6 mb-3">
                        <label>Meta Keyword</label>
                        <input type="text" className="form-control" name="keyword" value={formData.keyword} onChange={handleChange} />
                      </div>

                      <div className="col-md-6 mb-3">
                        <label>Alamat</label>
                        <input type="text" className="form-control" name="alamat" value={formData.alamat} onChange={handleChange} />
                      </div>

                      <div className="col-md-6 mb-3">
                        <label>Telepon</label>
                        <input type="text" className="form-control" name="telepon" value={formData.telepon} onChange={handleChange} />
                      </div>

                      <div className="col-md-6 mb-3">
                        <label>Email</label>
                        <input type="text" className="form-control" name="email" value={formData.email} onChange={handleChange} />
                      </div>

                      <div className="col-md-6 mb-3">
                        <label>Facebook</label>
                        <input type="text" className="form-control" name="facebook" value={formData.facebook} onChange={handleChange} />
                      </div>

                      <div className="col-md-6 mb-3">
                        <label>Instagram</label>
                        <input type="text" className="form-control" name="instagram" value={formData.instagram} onChange={handleChange} />
                      </div>

                      <div className="col-md-12 mb-3">
                        <label>WhatsApp</label>
                        <input type="text" className="form-control" name="wa" value={formData.wa} onChange={handleChange} />
                      </div>

                      <div className="col-md-12 mb-3">
                        <label>Google Maps</label>
                        <input type="text" className="form-control" name="gmaps" value={formData.gmaps} onChange={handleChange} />
                      </div>

                      <div className="col-md-6 mb-3">
                        <label>Logo Website</label>
                        <input type="file" className="form-control" name="logo" onChange={handleFileChange} />
                      </div>

                      <div className="col-md-6 mb-3">
                        <label>Struktur Organisasi</label>
                        <input type="file" className="form-control" name="struktur" onChange={handleFileChange} />
                      </div>

                      <div className="col-12 mb-3">
                        <label>Jam Operasional</label>
                        <textarea className="form-control" name="jambuka" value={formData.jambuka} onChange={handleChange} />
                      </div>

                      <div className="col-md-6 mb-3">
                        <label>Visi</label>
                        <textarea className="form-control" name="visi" value={formData.visi} onChange={handleChange} />
                      </div>

                      <div className="col-md-6 mb-3">
                        <label>Misi</label>
                        <textarea className="form-control" name="misi" value={formData.misi} onChange={handleChange} />
                      </div>

                    </div>

                  </div>

                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => {
                        setIsEdit(false)
                        loadWebsiteData()
                      }}
                    >
                      Batal
                    </button>

                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={saving}
                    >
                      {saving ? 'Menyimpan...' : 'Simpan'}
                    </button>
                  </div>
                </form>

              </div>
            </div>
          </div>
        )}

      </div>
    </AdminPusatLayout >
  )
}
