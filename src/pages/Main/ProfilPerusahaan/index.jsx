import React from 'react'
import DashboardLayout from '../../../layouts/DashboardLayout'
import profilPerusahaanService from '../../../services/profilPerusahaanService'
import EditProfilPerusahaan from './edit'

const FILE_URL = 'https://codemy.my.id'

// Komponen helper field read-only
const Field = ({ label, value, tall }) => (
  <div className="mb-3">
    <div className="profil-field-label">{label}</div>
    <div className={`profil-field-value${tall ? ' tall' : ''}`}>{value || '—'}</div>
  </div>
)

export default function ProfilPerusahaan() {

  const [formData, setFormData] = React.useState({
    nama: '', deskripsi: '', keyword: '', alamat: '',
    telepon: '', email: '', facebook: '', instagram: '',
    wa: '', gmaps: '', jambuka: '', visi: '', misi: '',
    logo: null, struktur: null
  })
  const [loading, setLoading]   = React.useState(true)
  const [saving, setSaving]     = React.useState(false)
  const [error, setError]       = React.useState('')
  const [success, setSuccess]   = React.useState('')
  const [isEdit, setIsEdit]     = React.useState(false)

  // Auto-clear pesan sukses setelah 3 detik
  React.useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(''), 3000)
      return () => clearTimeout(timer)
    }
  }, [success])

  React.useEffect(() => { loadWebsiteData() }, [])

  const loadWebsiteData = async () => {
    try {
      const response = await profilPerusahaanService.get()
      const data = response.data
      setFormData({
        nama:      data.nama      || '',
        deskripsi: data.deskripsi || '',
        keyword:   data.keyword   || '',
        alamat:    data.alamat    || '',
        telepon:   data.telepon   || '',
        email:     data.email     || '',
        facebook:  data.facebook  || '',
        instagram: data.instagram || '',
        wa:        data.wa        || '',
        gmaps:     data.gmaps     || '',
        jambuka:   data.jambuka   || '',
        visi:      data.visi      || '',
        misi:      data.misi      || '',
        logo:      data.logo      || null,
        struktur:  data.struktur  || null,
      })
      setLoading(false)
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal memuat data website')
      setLoading(false)
    }
  }

  const stripHtmlTags = (html) => {
    if (!html) return ''
    return html.replace(/<[^>]*>/g, '')
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e) => {
    const { name, files } = e.target
    setFormData(prev => ({ ...prev, [name]: files[0] || null }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
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
      if (formData.logo     instanceof File) formDataToSend.append('logo',     formData.logo)
      if (formData.struktur instanceof File) formDataToSend.append('struktur', formData.struktur)

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

  const handleCloseEdit = () => {
    setIsEdit(false)
    loadWebsiteData()
  }

  // ── Loading state ──
  if (loading) {
    return (
      <DashboardLayout title="Profil Perusahaan">
        <div className="loading-center">
          <div className="spinner-border"></div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout title="Profil Perusahaan">

      {/* Alert */}
      {error   && <div className="profil-alert profil-alert-danger">{error}</div>}
      {success && <div className="profil-alert profil-alert-success">{success}</div>}

      {/* ── VIEW ── */}
      <div className="profil-box">

        <div className="profil-box-header">
          <div className="profil-box-title">Kelola halaman profil perusahaan</div>
          <button className="btn-primary-custom" onClick={() => setIsEdit(true)}>
            <i className="fas fa-pencil-alt"></i>
            Edit Profil
          </button>
        </div>

        <hr className="profil-divider" />

        <div className="row">
          <div className="col-md-6"><Field label="Nama Website"   value={stripHtmlTags(formData.nama)}      /></div>
          <div className="col-md-6"><Field label="Meta Deskripsi" value={stripHtmlTags(formData.deskripsi)}  /></div>
          <div className="col-md-6"><Field label="Meta Keyword"   value={stripHtmlTags(formData.keyword)}    /></div>
          <div className="col-md-6"><Field label="Alamat"         value={stripHtmlTags(formData.alamat)}     /></div>
          <div className="col-md-6"><Field label="Telepon"        value={stripHtmlTags(formData.telepon)}    /></div>
          <div className="col-md-6"><Field label="Email"          value={stripHtmlTags(formData.email)}      /></div>
          <div className="col-md-6"><Field label="Facebook"       value={stripHtmlTags(formData.facebook)}   /></div>
          <div className="col-md-6"><Field label="Instagram"      value={stripHtmlTags(formData.instagram)}  /></div>
          <div className="col-md-12"><Field label="WhatsApp"      value={stripHtmlTags(formData.wa)}         /></div>
          <div className="col-md-12"><Field label="Google Maps"   value={stripHtmlTags(formData.gmaps)}      /></div>
        </div>

        <div className="row mt-1">
          <div className="col-md-6 mb-3">
            <div className="profil-field-label">Logo Website</div>
            <div className="profil-image-box">
              {formData.logo
                ? <img src={`${FILE_URL}/img/${formData.logo}`} alt="Logo" style={{ maxHeight: '80px' }} />
                : 'Belum ada logo'}
            </div>
          </div>
          <div className="col-md-6 mb-3">
            <div className="profil-field-label">Struktur Organisasi</div>
            <div className="profil-image-box">
              {formData.struktur
                ? <img src={`${FILE_URL}/img/${formData.struktur}`} alt="Struktur" style={{ maxHeight: '80px' }} />
                : 'Belum ada gambar'}
            </div>
          </div>
        </div>

      </div>

      {/* ── MODAL EDIT (komponen terpisah) ── */}
      {isEdit && (
        <EditProfilPerusahaan
          formData={formData}
          saving={saving}
          onChange={handleChange}
          onFileChange={handleFileChange}
          onSubmit={handleSubmit}
          onClose={handleCloseEdit}
        />
      )}

    </DashboardLayout>
  )
}