import React from 'react'
import DashboardLayout from '../../../layouts/DashboardLayout'
import profilPerusahaanService  from '../../../services/profilPerusahaanService'

const FILE_URL = 'https://codemy.my.id'

// ── Semua style dipindah ke Dashboard.css
// ── Tidak ada lagi <style>{...}</style> di dalam JSX

export default function ProfilPerusahaan() {

  const [formData, setFormData] = React.useState({
    nama: '', deskripsi: '', keyword: '', alamat: '',
    telepon: '', email: '', facebook: '', instagram: '',
    wa: '', gmaps: '', jambuka: '', visi: '', misi: '',
    logo: null, struktur: null
  })
  const [loading, setLoading] = React.useState(true)
  const [saving, setSaving] = React.useState(false)
  const [error, setError] = React.useState('')
  const [success, setSuccess] = React.useState('')
  const [isEdit, setIsEdit] = React.useState(false)

  React.useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(''), 3000)
      return () => clearTimeout(timer)
    }
  }, [success])

  const stripHtmlTags = (html) => {
    if (!html) return ''
    return html.replace(/<[^>]*>/g, '')
  }

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
        struktur:  data.struktur  || null
      })
      setLoading(false)
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal memuat data website')
      setLoading(false)
    }
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
      if (formData.logo instanceof File)     formDataToSend.append('logo', formData.logo)
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

  if (loading) {
    return (
      <DashboardLayout title="Profil Perusahaan">
        {/* loading-center dari Dashboard.css */}
        <div className="loading-center">
          <div className="spinner-border"></div>
        </div>
      </DashboardLayout>
    )
  }

  // Komponen helper field read-only
  const Field = ({ label, value, tall }) => (
    <div className="mb-3">
      {/* profil-field-label & profil-field-value dari Dashboard.css */}
      <div className="profil-field-label">{label}</div>
      <div className={`profil-field-value${tall ? ' tall' : ''}`}>{value || '—'}</div>
    </div>
  )

  return (

    <DashboardLayout title="Profil Perusahaan">

      {/* Alert — pakai class dari Dashboard.css */}
      {error   && <div className="profil-alert profil-alert-danger">{error}</div>}
      {success && <div className="profil-alert profil-alert-success">{success}</div>}

      {/* ── VIEW — profil-box dari Dashboard.css ── */}
      <div className="profil-box">

        <div className="profil-box-header">
          <div className="profil-box-title">Kelola halaman profil perusahaan</div>

          {/* Tombol Edit — btn-primary-custom dari Dashboard.css */}
          <button className="btn-primary-custom" onClick={() => setIsEdit(true)}>
            <i className="fas fa-pencil-alt"></i>
            Edit Profil
          </button>
        </div>

        <hr className="profil-divider" />

        <div className="row">
          <div className="col-md-6"><Field label="Nama Website"    value={stripHtmlTags(formData.nama)}      /></div>
          <div className="col-md-6"><Field label="Meta Deskripsi"  value={stripHtmlTags(formData.deskripsi)}  /></div>
          <div className="col-md-6"><Field label="Meta Keyword"    value={stripHtmlTags(formData.keyword)}    /></div>
          <div className="col-md-6"><Field label="Alamat"          value={stripHtmlTags(formData.alamat)}     /></div>
          <div className="col-md-6"><Field label="Telepon"         value={stripHtmlTags(formData.telepon)}    /></div>
          <div className="col-md-6"><Field label="Email"           value={stripHtmlTags(formData.email)}      /></div>
          <div className="col-md-6"><Field label="Facebook"        value={stripHtmlTags(formData.facebook)}   /></div>
          <div className="col-md-6"><Field label="Instagram"       value={stripHtmlTags(formData.instagram)}  /></div>
          <div className="col-md-12"><Field label="WhatsApp"       value={stripHtmlTags(formData.wa)}         /></div>
          <div className="col-md-12"><Field label="Google Maps"    value={stripHtmlTags(formData.gmaps)}      /></div>
        </div>

        <div className="row mt-1">
          <div className="col-md-6 mb-3">
            <div className="profil-field-label">Logo Website</div>
            {/* profil-image-box dari Dashboard.css */}
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

      {/* ── MODAL EDIT — profil-modal-* dari Dashboard.css ── */}
      {isEdit && (
        <div className="profil-modal-overlay">
          <div className="profil-modal-box">

            {/* profil-modal-header dari Dashboard.css */}
            <div className="profil-modal-header">
              <h5>Edit Profil Perusahaan</h5>
              <button
                className="profil-modal-close"
                onClick={() => { setIsEdit(false); loadWebsiteData() }}
              >x</button>
            </div>

            <form onSubmit={handleSubmit}>

              {/* profil-modal-body dari Dashboard.css */}
              <div className="profil-modal-body">
                <div className="row">
                  <div className="col-md-6 mb-3"><label>Judul</label><input type="text" className="form-control" name="nama" value={formData.nama} onChange={handleChange} /></div>
                  <div className="col-md-6 mb-3"><label>Meta Deskripsi</label><textarea className="form-control" name="deskripsi" value={formData.deskripsi} onChange={handleChange} rows={2} /></div>
                  <div className="col-md-6 mb-3"><label>Meta Keyword</label><input type="text" className="form-control" name="keyword" value={formData.keyword} onChange={handleChange} /></div>
                  <div className="col-md-6 mb-3"><label>Alamat</label><input type="text" className="form-control" name="alamat" value={formData.alamat} onChange={handleChange} /></div>
                  <div className="col-md-6 mb-3"><label>Telepon</label><input type="text" className="form-control" name="telepon" value={formData.telepon} onChange={handleChange} /></div>
                  <div className="col-md-6 mb-3"><label>Email</label><input type="text" className="form-control" name="email" value={formData.email} onChange={handleChange} /></div>
                  <div className="col-md-6 mb-3"><label>Facebook</label><input type="text" className="form-control" name="facebook" value={formData.facebook} onChange={handleChange} /></div>
                  <div className="col-md-6 mb-3"><label>Instagram</label><input type="text" className="form-control" name="instagram" value={formData.instagram} onChange={handleChange} /></div>
                  <div className="col-md-12 mb-3"><label>WhatsApp</label><input type="text" className="form-control" name="wa" value={formData.wa} onChange={handleChange} /></div>
                  <div className="col-md-12 mb-3"><label>Google Maps</label><input type="text" className="form-control" name="gmaps" value={formData.gmaps} onChange={handleChange} /></div>
                  <div className="col-md-6 mb-3"><label>Logo Website</label><input type="file" className="form-control" name="logo" accept="image/*" onChange={handleFileChange} /></div>
                  <div className="col-md-6 mb-3"><label>Struktur Organisasi</label><input type="file" className="form-control" name="struktur" accept="image/*" onChange={handleFileChange} /></div>
                  <div className="col-12 mb-3"><label>Jam Operasional</label><textarea className="form-control" name="jambuka" value={formData.jambuka} onChange={handleChange} rows={3} /></div>
                  <div className="col-md-6 mb-3"><label>Visi</label><textarea className="form-control" name="visi" value={formData.visi} onChange={handleChange} rows={4} /></div>
                  <div className="col-md-6 mb-3"><label>Misi</label><textarea className="form-control" name="misi" value={formData.misi} onChange={handleChange} rows={4} /></div>
                </div>
              </div>

              {/* profil-modal-footer dari Dashboard.css */}
              <div className="profil-modal-footer">

                {/* Batal — btn-secondary-custom dari Dashboard.css */}
                <button
                  type="button"
                  className="btn-secondary-custom"
                  onClick={() => { setIsEdit(false); loadWebsiteData() }}
                >
                  Batal
                </button>

                {/* Simpan — btn-primary-custom dari Dashboard.css */}
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
      )}

    </DashboardLayout>

  )
}
