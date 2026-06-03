import React from 'react'
import { useNavigate } from 'react-router-dom'
import DashboardLayout from '../../../layouts/DashboardLayout'
import profilPerusahaanService from '../../../services/profilPerusahaanService'
import { successAlert, errorAlert } from '../../../utils/alert'

export default function ProfilPerusahaanEdit() {
  const navigate = useNavigate()
  const [saving, setSaving] = React.useState(false)
  const [loading, setLoading] = React.useState(true)

  const [formData, setFormData] = React.useState({
    nama: '', deskripsi: '', keyword: '', alamat: '',
    telepon: '', email: '', facebook: '', instagram: '',
    wa: '', gmaps: '', jambuka: '', visi: '', misi: '',
    logo: null, struktur: null
  })

  React.useEffect(() => {
    profilPerusahaanService.get()
      .then(res => {
        const data = res.data
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
      })
      .catch(() => setLoading(false))
  }, [])

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
    try {
      const fd = new FormData()
      Object.keys(formData).forEach(key => {
        if (key !== 'logo' && key !== 'struktur') {
          fd.append(key, formData[key] || '')
        }
      })
      if (formData.logo     instanceof File) fd.append('logo',     formData.logo)
      if (formData.struktur instanceof File) fd.append('struktur', formData.struktur)

      await profilPerusahaanService.update(fd)
      await successAlert('Berhasil', 'Data profil berhasil diupdate')

      // Kirim state refresh supaya halaman index fetch ulang data + gambar terbaru
      navigate('/profil-perusahaan', { state: { refresh: Date.now() } })
    } catch (err) {
      await errorAlert('Gagal', err.response?.data?.message || 'Gagal menyimpan data')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <DashboardLayout title="Edit Profil Perusahaan">
        <div className="d-flex justify-content-center">
          <div className="spinner-border"></div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout title="Edit Profil Perusahaan">

      <div className="white-box">

        <div className="row">

          <div className="col-md-6 mb-3">
            <label className="form-label">Judul</label>
            <input type="text" className="form-control" name="nama" value={formData.nama} onChange={handleChange} />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">Meta Deskripsi</label>
            <textarea className="form-control" name="deskripsi" value={formData.deskripsi} onChange={handleChange} rows={2} />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">Meta Keyword</label>
            <input type="text" className="form-control" name="keyword" value={formData.keyword} onChange={handleChange} />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">Alamat</label>
            <input type="text" className="form-control" name="alamat" value={formData.alamat} onChange={handleChange} />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">Telepon</label>
            <input type="text" className="form-control" name="telepon" value={formData.telepon} onChange={handleChange} />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">Email</label>
            <input type="text" className="form-control" name="email" value={formData.email} onChange={handleChange} />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">Facebook</label>
            <input type="text" className="form-control" name="facebook" value={formData.facebook} onChange={handleChange} />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">Instagram</label>
            <input type="text" className="form-control" name="instagram" value={formData.instagram} onChange={handleChange} />
          </div>

          <div className="col-md-12 mb-3">
            <label className="form-label">WhatsApp</label>
            <input type="text" className="form-control" name="wa" value={formData.wa} onChange={handleChange} />
          </div>

          <div className="col-md-12 mb-3">
            <label className="form-label">Google Maps</label>
            <input type="text" className="form-control" name="gmaps" value={formData.gmaps} onChange={handleChange} />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">Logo Website</label>
            <input type="file" className="form-control" name="logo" accept="image/*" onChange={handleFileChange} />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">Struktur Organisasi</label>
            <input type="file" className="form-control" name="struktur" accept="image/*" onChange={handleFileChange} />
          </div>

          <div className="col-12 mb-3">
            <label className="form-label">Jam Operasional</label>
            <textarea className="form-control" name="jambuka" value={formData.jambuka} onChange={handleChange} rows={3} />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">Visi</label>
            <textarea className="form-control" name="visi" value={formData.visi} onChange={handleChange} rows={4} />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">Misi</label>
            <textarea className="form-control" name="misi" value={formData.misi} onChange={handleChange} rows={4} />
          </div>

        </div>

        <div className="d-flex gap-2">
          <button
            type="button"
            className="btn btn-success"
            disabled={saving}
            onClick={handleSubmit}
          >
            {saving ? 'Menyimpan...' : 'Simpan'}
          </button>

          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate('/profil-perusahaan')}
          >
            Kembali
          </button>
        </div>

      </div>

    </DashboardLayout>
  )
}