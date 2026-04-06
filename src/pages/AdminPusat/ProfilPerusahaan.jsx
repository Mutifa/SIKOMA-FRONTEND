import React from 'react'
import AdminPusatLayout from '../../layouts/AdminPusatLayout.jsx'
import api from '../../lib/api.js'

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
    icon: null,
    logo: null,
    struktur: null
  })
  const [loading, setLoading] = React.useState(true)
  const [saving, setSaving] = React.useState(false)
  const [error, setError] = React.useState('')
  const [success, setSuccess] = React.useState('')

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
      const response = await api.get('/api/AdminPusat/website')
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
        icon: null,
        logo: null,
        struktur: null
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
    setSaving(true)
    setError('')
    setSuccess('')

    try {
      const formDataToSend = new FormData()
      
      // Add text fields
      Object.keys(formData).forEach(key => {
        if (key !== 'icon' && key !== 'logo' && key !== 'struktur') {
          formDataToSend.append(key, formData[key] || '')
        }
      })

      // Add files if they exist
      if (formData.icon) formDataToSend.append('icon', formData.icon)
      if (formData.logo) formDataToSend.append('logo', formData.logo)
      if (formData.struktur) formDataToSend.append('struktur', formData.struktur)

      await api.post('/api/AdminPusat/website', formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      
      setSuccess('Data website berhasil diperbarui')
      loadWebsiteData() // Reload data with cleaned HTML tags
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
        <div className="box-title mb-3">Pengaturan Website</div>
        
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Nama Website</label>
              <input
                type="text"
                className="form-control"
                name="nama"
                value={formData.nama}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">Meta Deskripsi</label>
              <textarea
                className="form-control"
                name="deskripsi"
                value={formData.deskripsi}
                onChange={handleChange}
                rows="3"
                required
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">Meta Keyword</label>
              <input
                type="text"
                className="form-control"
                name="keyword"
                value={formData.keyword}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">Alamat</label>
              <textarea
                className="form-control"
                name="alamat"
                value={formData.alamat}
                onChange={handleChange}
                rows="3"
                required
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">Telepon</label>
              <input
                type="text"
                className="form-control"
                name="telepon"
                value={formData.telepon}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">Facebook</label>
              <input
                type="text"
                className="form-control"
                name="facebook"
                value={formData.facebook}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">Instagram</label>
              <input
                type="text"
                className="form-control"
                name="instagram"
                value={formData.instagram}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-12 mb-3">
              <label className="form-label">WhatsApp</label>
              <textarea
                type="text"
                className="form-control"
                name="wa"
                value={formData.wa}
                onChange={handleChange}
                rows="3"
              />
            </div>

            <div className="col-md-12 mb-3">
              <label className="form-label">Google Maps (Embed Link)</label>
              <textarea
                className="form-control"
                name="gmaps"
                value={formData.gmaps}
                onChange={handleChange}
                rows="4"
                required
              />
            </div>

            <div className="col-md-4 mb-3">
              <label className="form-label">Icon Website</label><br />
              <input
                type="file"
                className="form-control mb-3"
                name="icon"
                accept="image/*"
                onChange={handleFileChange}
              />
              {formData.icon && (
                <img 
                  src={formData.icon instanceof File ? URL.createObjectURL(formData.icon) : `/img/${formData.icon}`} 
                  alt="Icon" 
                  width="50" 
                />
              )}
            </div>

            <div className="col-md-4 mb-3">
              <label className="form-label">Logo Website</label><br />
              <input
                type="file"
                className="form-control mb-3"
                name="logo"
                accept="image/*"
                onChange={handleFileChange}
              />
              {formData.logo && (
                <img 
                  src={formData.logo instanceof File ? URL.createObjectURL(formData.logo) : `/img/${formData.logo}`} 
                  alt="Logo" 
                  width="100" 
                />
              )}
            </div>

            <div className="col-md-4 mb-3">
              <label className="form-label">Struktur Organisasi</label><br />
              <input
                type="file"
                className="form-control mb-3"
                name="struktur"
                accept="image/*"
                onChange={handleFileChange}
              />
              {formData.struktur && (
                <img 
                  src={formData.struktur instanceof File ? URL.createObjectURL(formData.struktur) : `/img/${formData.struktur}`} 
                  alt="struktur" 
                  width="100" 
                />
              )}
            </div>

            <div className="col-12 mb-3">
              <label className="form-label">Jam Operasional</label>
              <textarea
                className="form-control"
                name="jambuka"
                value={formData.jambuka}
                onChange={handleChange}
                rows="3"
                required
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">Visi</label>
              <textarea
                className="form-control"
                name="visi"
                value={formData.visi}
                onChange={handleChange}
                rows="3"
                required
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">Misi</label>
              <textarea
                className="form-control"
                name="misi"
                value={formData.misi}
                onChange={handleChange}
                rows="3"
                required
              />
            </div>
          </div>

          <div className="mt-3">
            <button 
              type="submit" 
              className="btn btn-primary float-end"
              disabled={saving}
            >
              {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
          </div>
        </form>
      </div>
    </AdminPusatLayout>
  )
}
