import React from 'react'
import AdminPusatLayout from '../../layouts/AdminPusatLayout.jsx'
import { profilPerusahaanService } from '../../services/profilPerusahaanService'

const styles = `
  /* Section box */
  .profil-box {
    background: #fff;
    border-radius: 8px;
    border: 1px solid #dee2e6;
    padding: 20px 24px;
  }
  .profil-box-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 14px;
  }
  .profil-box-title {
    font-size: 15px;
    font-weight: 600;
    color: #1a3c24;
  }

  /* View fields */
  .profil-field-label {
    font-size: 13px;
    color: #495057;
    margin-bottom: 5px;
    font-weight: 500;
  }
  .profil-field-value {
    background: #f8f9fa;
    border: 1px solid #dee2e6;
    border-radius: 4px;
    padding: 8px 12px;
    font-size: 14px;
    color: #212529;
    min-height: 38px;
    word-break: break-word;
  }
  .profil-field-value.tall {
    min-height: 72px;
  }
  .profil-image-box {
    background: #f8f9fa;
    border: 1px solid #dee2e6;
    border-radius: 4px;
    height: 120px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #adb5bd;
    font-size: 13px;
  }

  /* Button Edit */
  .btn-add-style {
    background: #1a4731;
    color: #fff;
    border: none;
    border-radius: 4px;
    padding: 8px 18px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.15s;
  }
  .btn-add-style:hover { background: #133524; }

  /* Modal overlay */
  .profil-modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,0.5);
    z-index: 1050;
    overflow-y: auto;
    padding: 60px 16px 40px;
  }
  .profil-modal-box {
    background: #fff;
    border-radius: 6px;
    width: 100%;
    max-width: 780px;
    margin: 0 auto;
    box-shadow: 0 8px 32px rgba(0,0,0,0.18);
  }

  /* Modal header hijau gelap — sama seperti "Tambah Program" */
  .profil-modal-header {
    background: #1a4731;
    padding: 14px 20px;
    border-radius: 6px 6px 0 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .profil-modal-header h5 {
    font-size: 15px;
    font-weight: 600;
    color: #fff;
    margin: 0;
  }
  .profil-modal-close {
    background: transparent;
    border: none;
    color: #fff;
    font-size: 22px;
    line-height: 1;
    cursor: pointer;
    opacity: 0.85;
    padding: 0;
  }
  .profil-modal-close:hover { opacity: 1; }

  .profil-modal-body {
    padding: 20px 24px;
  }
  .profil-modal-footer {
    padding: 12px 24px 18px;
    display: flex;
    justify-content: flex-end;
    gap: 10px;
  }

  /* Form controls in modal */
  .profil-modal-body label {
    font-size: 13px;
    color: #495057;
    margin-bottom: 5px;
    font-weight: 500;
    display: block;
  }
  .profil-modal-body .form-control {
    border-radius: 4px;
    border: 1px solid #ced4da;
    font-size: 14px;
    color: #212529;
    padding: 8px 12px;
    width: 100%;
    transition: border-color 0.15s, box-shadow 0.15s;
  }
  .profil-modal-body .form-control:focus {
    border-color: #2d6a4f;
    box-shadow: 0 0 0 3px rgba(45,106,79,0.15);
    outline: none;
  }

  /* Footer buttons — sama seperti modal Program */
  .btn-batal {
    background: #6c757d;
    color: #fff;
    border: none;
    border-radius: 4px;
    padding: 8px 20px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.15s;
  }
  .btn-batal:hover { background: #5a6268; }

  .btn-simpan {
    background: #1a4731;
    color: #fff;
    border: none;
    border-radius: 4px;
    padding: 8px 22px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.15s;
  }
  .btn-simpan:hover:not(:disabled) { background: #133524; }
  .btn-simpan:disabled { opacity: 0.65; cursor: not-allowed; }

  /* Alert */
  .profil-alert {
    border-radius: 4px;
    padding: 10px 14px;
    font-size: 14px;
    margin-bottom: 14px;
    border: 1px solid transparent;
  }
  .profil-alert-danger  { background: #f8d7da; border-color: #f5c6cb; color: #721c24; }
  .profil-alert-success { background: #d4edda; border-color: #c3e6cb; color: #155724; }

  /* Loading */
  .loading-center {
    display: flex; justify-content: center; align-items: center; min-height: 200px;
  }
  .spinner-green {
    width: 32px; height: 32px;
    border: 3px solid #dee2e6;
    border-top-color: #2d6a4f;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  hr.profil-divider {
    border: none;
    border-top: 1px solid #dee2e6;
    margin: 14px 0 18px;
  }
`

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
      if (formData.logo instanceof File) formDataToSend.append('logo', formData.logo)
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
      <AdminPusatLayout title="Profil Perusahaan">
        <style>{styles}</style>
        <div className="loading-center">
          <div className="spinner-green"></div>
        </div>
      </AdminPusatLayout>
    )
  }

  const Field = ({ label, value, tall }) => (
    <div className="mb-3">
      <div className="profil-field-label">{label}</div>
      <div className={`profil-field-value${tall ? ' tall' : ''}`}>{value || '—'}</div>
    </div>
  )

  return (
    <AdminPusatLayout title="Profil Perusahaan">
      <style>{styles}</style>

      {error && <div className="profil-alert profil-alert-danger">{error}</div>}
      {success && <div className="profil-alert profil-alert-success">{success}</div>}

      <div className="profil-box">
        <div className="profil-box-header">
          <div className="profil-box-title">Kelola halaman profil halaman</div>
          <button className="btn-add-style" onClick={() => setIsEdit(true)}>
            <i className="fas fa-pencil-alt" style={{ marginRight: '6px', fontSize: '12px' }}></i>Edit
          </button>
        </div>
        <hr className="profil-divider" />

        <div className="row">
          <div className="col-md-6"><Field label="Nama Website" value={formData.nama} /></div>
          <div className="col-md-6"><Field label="Meta Deskripsi" value={formData.deskripsi} /></div>
          <div className="col-md-6"><Field label="Meta Keyword" value={formData.keyword} /></div>
          <div className="col-md-6"><Field label="Alamat" value={formData.alamat} /></div>
          <div className="col-md-6"><Field label="Telepon" value={formData.telepon} /></div>
          <div className="col-md-6"><Field label="Email" value={formData.email} /></div>
          <div className="col-md-6"><Field label="Facebook" value={formData.facebook} /></div>
          <div className="col-md-6"><Field label="Instagram" value={formData.instagram} /></div>
          <div className="col-md-12"><Field label="WhatsApp" value={formData.wa} /></div>
          <div className="col-md-12"><Field label="Google Maps" value={formData.gmaps} /></div>
        </div>

        <div className="row mt-1">
          <div className="col-md-6 mb-3">
            <div className="profil-field-label">Logo Website</div>
            <div className="profil-image-box">
              {formData.logo
                ? <img src={`/img/${formData.logo}`} alt="Logo" style={{ maxHeight: '80px' }} />
                : 'Belum ada logo'}
            </div>
          </div>
          <div className="col-md-6 mb-3">
            <div className="profil-field-label">Struktur Organisasi</div>
            <div className="profil-image-box">
              {formData.struktur
                ? <img src={`/img/${formData.struktur}`} alt="Struktur" style={{ maxHeight: '80px' }} />
                : 'Belum ada gambar'}
            </div>
          </div>
        </div>
      </div>

      {/* Modal Edit — mengikuti gaya modal "Tambah Program" */}
      {isEdit && (
        <div className="profil-modal-overlay">
          <div className="profil-modal-box">

            <div className="profil-modal-header">
              <h5>Edit Profil Perusahaan</h5>
              <button
                className="profil-modal-close"
                onClick={() => { setIsEdit(false); loadWebsiteData() }}
              >×</button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="profil-modal-body">
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label>Judul</label>
                    <input type="text" className="form-control" name="nama" value={formData.nama} onChange={handleChange} placeholder="Nama Website" />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label>Meta Deskripsi</label>
                    <textarea className="form-control" name="deskripsi" value={formData.deskripsi} onChange={handleChange} rows={2} />
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
                    <textarea className="form-control" name="jambuka" value={formData.jambuka} onChange={handleChange} rows={3} />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label>Visi</label>
                    <textarea className="form-control" name="visi" value={formData.visi} onChange={handleChange} rows={4} />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label>Misi</label>
                    <textarea className="form-control" name="misi" value={formData.misi} onChange={handleChange} rows={4} />
                  </div>
                </div>
              </div>

              <div className="profil-modal-footer">
                <button
                  type="button"
                  className="btn-batal"
                  onClick={() => { setIsEdit(false); loadWebsiteData() }}
                >Batal</button>
                <button type="submit" className="btn-simpan" disabled={saving}>
                  {saving ? 'Menyimpan...' : 'Simpan'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </AdminPusatLayout>
  )
}