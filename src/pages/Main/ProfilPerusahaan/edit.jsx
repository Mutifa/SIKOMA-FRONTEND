import React from 'react'
import { useNavigate } from 'react-router-dom'
import DashboardLayout from '../../../layouts/DashboardLayout.jsx'
import profilPerusahaanService from '../../../services/profilPerusahaanService'
import { successAlert, errorAlert } from '../../../utils/alert'

const FILE_URL = 'https://codemy.my.id'

export default function ProfilPerusahaanEdit() {
  const navigate = useNavigate()

  const [formData, setFormData] = React.useState({
    nama: '', deskripsi: '', keyword: '', alamat: '',
    telepon: '', email: '', facebook: '', instagram: '',
    wa: '', gmaps: '', jambuka: '', visi: '', misi: '',
    logo: null, struktur: null
  })

  // Preview file lama dari server
  const [existingLogo,     setExistingLogo]     = React.useState('')
  const [existingStruktur, setExistingStruktur] = React.useState('')

  const [loading, setLoading] = React.useState(true)
  const [saving,  setSaving]  = React.useState(false)
  const [error,   setError]   = React.useState('')

  // ── Load data existing ──────────────────────────────────────────────────
  React.useEffect(() => {
    profilPerusahaanService.get()
      .then(res => {
        const d = res.data
        setFormData({
          nama:      d.nama      || '',
          deskripsi: d.deskripsi || '',
          keyword:   d.keyword   || '',
          alamat:    d.alamat    || '',
          telepon:   d.telepon   || '',
          email:     d.email     || '',
          facebook:  d.facebook  || '',
          instagram: d.instagram || '',
          wa:        d.wa        || '',
          gmaps:     d.gmaps     || '',
          jambuka:   d.jambuka   || '',
          visi:      d.visi      || '',
          misi:      d.misi      || '',
          logo:      null,
          struktur:  null
        })
        setExistingLogo(d.logo || '')
        setExistingStruktur(d.struktur || '')
        setLoading(false)
      })
      .catch(err => {
        setError(err.response?.data?.message || 'Gagal memuat data')
        setLoading(false)
      })
  }, [])

  // ── Handler input teks ──────────────────────────────────────────────────
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  // ── Handler input file ──────────────────────────────────────────────────
  const handleFileChange = (e) => {
    const { name, files } = e.target
    setFormData(prev => ({ ...prev, [name]: files[0] || null }))
  }

  // ── Submit ──────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')

    try {
      const fd = new FormData()

      // Kirim semua field teks
      Object.keys(formData).forEach(key => {
        if (key !== 'logo' && key !== 'struktur') {
          fd.append(key, formData[key] || '')
        }
      })

      // Kirim file hanya jika user memilih file baru
      if (formData.logo instanceof File)     fd.append('logo', formData.logo)
      if (formData.struktur instanceof File) fd.append('struktur', formData.struktur)

      await profilPerusahaanService.update(fd)

      await successAlert('Berhasil!', 'Profil perusahaan berhasil diperbarui')

      navigate('/profil-perusahaan')

    } catch (err) {
      await errorAlert(
        'Gagal Menyimpan',
        err.response?.data?.message || 'Terjadi kesalahan saat menyimpan data'
      )
      setError(err.response?.data?.message || 'Gagal menyimpan data')
    } finally {
      setSaving(false)
    }
  }

  // ── Loading ─────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <DashboardLayout title="Edit Profil Perusahaan">
        <div className="loading-center">
          <div className="spinner-border"></div>
        </div>
      </DashboardLayout>
    )
  }

  // ── Render ──────────────────────────────────────────────────────────────
  return (
    <DashboardLayout title="Edit Profil Perusahaan">

      {error && (
        <div className="alert alert-danger mb-3">{error}</div>
      )}

      {/* Tombol Kembali */}
      <div className="mb-3">
        <button
          type="button"
          className="btn-secondary-custom"
          onClick={() => navigate('/profil-perusahaan')}
        >
          <i className="fas fa-arrow-left"></i>
          Kembali
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="white-box">

          {/* ── Informasi Umum ── */}
          <div className="box-title">Informasi Umum</div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Nama Website</label>
              <input type="text" className="form-control" name="nama"
                value={formData.nama} onChange={handleChange} />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Meta Deskripsi</label>
              <textarea className="form-control" name="deskripsi" rows={2}
                value={formData.deskripsi} onChange={handleChange} />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Meta Keyword</label>
              <input type="text" className="form-control" name="keyword"
                value={formData.keyword} onChange={handleChange} />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Alamat</label>
              <input type="text" className="form-control" name="alamat"
                value={formData.alamat} onChange={handleChange} />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Telepon</label>
              <input type="text" className="form-control" name="telepon"
                value={formData.telepon} onChange={handleChange} />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Email</label>
              <input type="text" className="form-control" name="email"
                value={formData.email} onChange={handleChange} />
            </div>
          </div>

          {/* ── Media Sosial ── */}
          <div className="box-title mt-3">Media Sosial & Kontak</div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Facebook</label>
              <input type="text" className="form-control" name="facebook"
                value={formData.facebook} onChange={handleChange} />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Instagram</label>
              <input type="text" className="form-control" name="instagram"
                value={formData.instagram} onChange={handleChange} />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">WhatsApp</label>
              <input type="text" className="form-control" name="wa"
                value={formData.wa} onChange={handleChange} />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Google Maps</label>
              <input type="text" className="form-control" name="gmaps"
                value={formData.gmaps} onChange={handleChange} />
            </div>
            <div className="col-12 mb-3">
              <label className="form-label">Jam Operasional</label>
              <textarea className="form-control" name="jambuka" rows={3}
                value={formData.jambuka} onChange={handleChange} />
            </div>
          </div>

          {/* ── Visi Misi ── */}
          <div className="box-title mt-3">Visi & Misi</div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Visi</label>
              <textarea className="form-control" name="visi" rows={4}
                value={formData.visi} onChange={handleChange} />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Misi</label>
              <textarea className="form-control" name="misi" rows={4}
                value={formData.misi} onChange={handleChange} />
            </div>
          </div>

          {/* ── File / Gambar ── */}
          <div className="box-title mt-3">Logo & Struktur Organisasi</div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">
                Logo Website
                <span className="text-muted ms-1" style={{ fontSize: '12px', fontWeight: 400 }}>
                  (pilih file baru untuk mengganti)
                </span>
              </label>
              <input type="file" className="form-control" name="logo"
                accept="image/*" onChange={handleFileChange} />
              {/* Preview logo lama */}
              {existingLogo && (
                <div className="mt-2">
                  <small className="text-muted d-block mb-1">Logo saat ini:</small>
                  <img
                    src={`${FILE_URL}/img/${existingLogo}`}
                    alt="Logo"
                    style={{ maxHeight: '70px', borderRadius: '6px', border: '1px solid #dee2e6' }}
                  />
                </div>
              )}
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">
                Struktur Organisasi
                <span className="text-muted ms-1" style={{ fontSize: '12px', fontWeight: 400 }}>
                  (pilih file baru untuk mengganti)
                </span>
              </label>
              <input type="file" className="form-control" name="struktur"
                accept="image/*" onChange={handleFileChange} />
              {/* Preview struktur lama */}
              {existingStruktur && (
                <div className="mt-2">
                  <small className="text-muted d-block mb-1">Struktur saat ini:</small>
                  <img
                    src={`${FILE_URL}/img/${existingStruktur}`}
                    alt="Struktur"
                    style={{ maxHeight: '70px', borderRadius: '6px', border: '1px solid #dee2e6' }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* ── Action Buttons ── */}
          <div className="d-flex gap-2 mt-3">
            <button type="submit" className="btn-primary-custom" disabled={saving}>
              <i className="fas fa-save"></i>
              {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
            <button
              type="button"
              className="btn-secondary-custom"
              onClick={() => navigate('/profil-perusahaan')}
            >
              Batal
            </button>
          </div>

        </div>
      </form>

    </DashboardLayout>
  )
}
