import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import DashboardLayout from '../../../layouts/DashboardLayout'
import profilPerusahaanService from '../../../services/profilPerusahaanService'

const FILE_URL = 'https://codemy.my.id'

const Field = ({ label, value }) => (
  <div className="mb-3">
    <div className="profil-field-label">{label}</div>
    <div
      className="profil-field-value"
      style={{ whiteSpace: 'pre-line' }}
    >
      {value || '—'}
    </div>
  </div>
)

const getWebsiteData = (res) =>
  res.data?.website ||
  res.data?.data?.website ||
  res.data?.data ||
  res.data

export default function ProfilPerusahaan() {
  const navigate = useNavigate()
  const location = useLocation()
  const [formData, setFormData] = React.useState(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState('')
  const [imgKey, setImgKey] = React.useState(() => Date.now())

  React.useEffect(() => {
    setLoading(true)
    profilPerusahaanService.get()
      .then(res => {
        setFormData(getWebsiteData(res))
        setImgKey(Date.now())
        setLoading(false)
      })
      .catch(err => {
        setError(err.response?.data?.message || 'Gagal memuat data')
        setLoading(false)
      })
  }, [location.key])

const stripHtml = (html) =>
  html
    ? html
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/<\/p>/gi, '\n')
        .replace(/<[^>]*>/g, '')
        .replace(/&ldquo;/g, '"')
        .replace(/&rdquo;/g, '"')
        .trim()
    : ''

  if (loading) {
    return (
      <DashboardLayout title="Profil Perusahaan">
        <div className="d-flex justify-content-center">
          <div className="spinner-border"></div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout
      title="Profil Perusahaan"
      actions={
        <button
          className="btn-primary-custom"
          onClick={() => navigate('/profil-perusahaan/edit')}
        >
          <i className="fas fa-pencil-alt"></i> Edit Profil
        </button>
      }
    >

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="white-box">

        <div className="row">
          <div className="col-md-6"><Field label="Nama Website"   value={stripHtml(formData?.nama)}      /></div>
          <div className="col-md-6"><Field label="Meta Deskripsi" value={stripHtml(formData?.deskripsi)} /></div>
          <div className="col-md-6"><Field label="Meta Keyword"   value={stripHtml(formData?.keyword)}   /></div>
          <div className="col-md-6"><Field label="Alamat"         value={stripHtml(formData?.alamat)}    /></div>
          <div className="col-md-6"><Field label="Telepon"        value={stripHtml(formData?.telepon)}   /></div>
          <div className="col-md-6"><Field label="Email"          value={stripHtml(formData?.email)}     /></div>
          <div className="col-md-6"><Field label="Facebook"       value={stripHtml(formData?.facebook)}  /></div>
          <div className="col-md-6"><Field label="Instagram"      value={stripHtml(formData?.instagram)} /></div>
          <div className="col-md-12"><Field label="WhatsApp"      value={stripHtml(formData?.wa)}        /></div>
          <div className="col-md-12"><Field label="Google Maps"   value={stripHtml(formData?.gmaps)}     /></div>
          <div className="col-md-12"><Field label="Jam Operasional"value={stripHtml(formData?.jambuka)}  /></div>
          <div className="col-md-6"><Field label="Visi"            value={stripHtml(formData?.visi)}                 /></div>

<div className="col-md-6">
  <Field
    label="Misi"
    value={stripHtml(formData?.misi)}
  />
</div>
        </div>

        <div className="row mt-2">
          <div className="col-md-6 mb-3">
            <div className="profil-field-label">Logo Website</div>
            <div className="profil-image-box">
              {formData?.logo
                ? <img
                    src={`${FILE_URL}/uploads/profil/${formData.logo}?t=${imgKey}`}
                    alt="Logo"
                    width={225}
                    height={225}
                    loading="lazy"
                    decoding="async"
                    style={{ width: 80, height: 80, objectFit: 'contain' }}
                  />
                : 'Belum ada logo'}
            </div>
          </div>
          <div className="col-md-6 mb-3">
            <div className="profil-field-label">Struktur Organisasi</div>
            <div className="profil-image-box">
              {formData?.struktur
                ? <img
                    src={`${FILE_URL}/uploads/profil/${formData.struktur}?t=${imgKey}`}
                    alt="Struktur"
                    width={1448}
                    height={720}
                    loading="lazy"
                    decoding="async"
                    style={{ width: 160, height: 80, objectFit: 'contain' }}
                  />
                : 'Belum ada gambar'}
            </div>
          </div>
        </div>

      </div>

    </DashboardLayout>
  )
}
