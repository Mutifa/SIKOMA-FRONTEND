import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import AdminLapanganLayout from '../../layouts/AdminLapanganLayout.jsx'
import api from '../../lib/api.js'

export default function LaporanEdit() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [formData, setFormData] = React.useState({
    judulLaporan: '',
    jenisKegiatan: '',
    tanggalMulai: '',
    tanggalSelesai: '',
    keterangan: '',
    daerahLokasi: '',
    kabupaten: '',
    kecamatan: '',
    latitude: '',
    longitude: '',
    luasArea: '',
    suratTugas: [],
    fotoSebelum: [],
    fotoSetelah: []
  })
  const [originalData, setOriginalData] = React.useState(null)
  const [loading, setLoading] = React.useState(true)
  const [saving, setSaving] = React.useState(false)
  const [error, setError] = React.useState('')
  const [locationStatus, setLocationStatus] = React.useState('Belum diverifikasi')

  React.useEffect(() => {
    let mounted = true
    api.get(`/laporan-konservasi/${id}`)
      .then(res => {
        if (mounted) {
          const laporan = res.data.data
          setOriginalData(laporan)
          setFormData({
            judulLaporan: laporan.judulLaporan || '',
            jenisKegiatan: laporan.jenisKegiatan || '',
            tanggalMulai: laporan.tanggalMulai || '',
            tanggalSelesai: laporan.tanggalSelesai || '',
            keterangan: laporan.keterangan || '',
            daerahLokasi: laporan.daerahLokasi || '',
            kabupaten: laporan.kabupaten || '',
            kecamatan: laporan.kecamatan || '',
            latitude: laporan.latitude || '',
            longitude: laporan.longitude || '',
            luasArea: laporan.luasArea || '',
            suratTugas: [],
            fotoSebelum: [],
            fotoSetelah: []
          })

          if (laporan.latitude && laporan.longitude) {
            setLocationStatus('✅ Lokasi sudah diverifikasi')
          }

          setLoading(false)
        }
      })
      .catch(err => {
        if (mounted) {
          setError(err.response?.data?.message || 'Gagal memuat data laporan')
          setLoading(false)
        }
      })
    return () => { mounted = false }
  }, [id])

  const handleChange = (e) => {
    const { name, value, type, files } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'file' ? Array.from(files) : value
    }))
  }

  const getLocation = () => {
    if (navigator.geolocation) {
      setLocationStatus('📍 Sedang mengambil lokasi...')
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            latitude: position.coords.latitude.toString(),
            longitude: position.coords.longitude.toString()
          }))
          setLocationStatus('✅ Lokasi berhasil diverifikasi!')
        },
        (error) => {
          switch (error.code) {
            case error.PERMISSION_DENIED:
              setLocationStatus('❌ Akses lokasi ditolak!')
              break
            case error.POSITION_UNAVAILABLE:
              setLocationStatus('❌ Informasi lokasi tidak tersedia!')
              break
            case error.TIMEOUT:
              setLocationStatus('❌ Permintaan lokasi timeout!')
              break
            default:
              setLocationStatus('❌ Gagal mendapatkan lokasi!')
          }
        }
      )
    } else {
      setLocationStatus('❌ Browser tidak mendukung geolocation!')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')

    const formDataToSend = new FormData()

    Object.keys(formData).forEach(key => {
      if (['suratTugas', 'fotoSebelum', 'fotoSetelah'].includes(key)) {
        if (
          Array.isArray(formData[key]) &&
          formData[key].length > 0 &&
          formData[key][0] instanceof File
        ) {
          formDataToSend.append(key, formData[key][0])
        }
      } else {
        if (formData[key] !== null && formData[key] !== '') {
          formDataToSend.append(key, formData[key])
        }
      }
    })

    try {
      for (let pair of formDataToSend.entries()) {
        console.log(pair[0], pair[1])
      }

      await api.post(
        `/laporan-konservasi/${id}?_method=PUT`,
        formDataToSend
      )

      navigate('/admin-lapangan/laporan')
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal memperbarui laporan')
    } finally {
      setSaving(false)
    }
  }

  const suratTugasList = originalData?.suratTugas
    ? Array.isArray(originalData.suratTugas)
      ? originalData.suratTugas
      : [originalData.suratTugas]
    : []

  const fotoSebelumList = originalData?.fotoSebelum
    ? Array.isArray(originalData.fotoSebelum)
      ? originalData.fotoSebelum
      : [originalData.fotoSebelum]
    : []

  const fotoSetelahList = originalData?.fotoSetelah
    ? Array.isArray(originalData.fotoSetelah)
      ? originalData.fotoSetelah
      : [originalData.fotoSetelah]
    : []

  if (loading) {
    return (
      <AdminLapanganLayout title="Edit Laporan">
        <div className="d-flex justify-content-center">
          <div className="spinner-border" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      </AdminLapanganLayout>
    )
  }

  return (
    <AdminLapanganLayout title="Edit Laporan Konservasi">
      {error && (
        <div className="alert alert-danger mb-4" role="alert">
          {error}
        </div>
      )}

      {/* Back button */}
      <div className="mb-3">
        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={() => navigate('/admin-lapangan/laporan')}
          style={{ borderRadius: '6px', fontWeight: 500 }}
        >
          &#171; Kembali
        </button>
      </div>

      <div className="row">
        <div className="col-12">
          <div className="white-box" style={{ borderRadius: '10px', border: '1px solid #e0e0e0', padding: '28px 32px' }}>
            <form onSubmit={handleSubmit} encType="multipart/form-data">

              {/* ── DESKRIPSI KEGIATAN ── */}
              <div className="mb-4">
                <h6
                  className="fw-bold text-uppercase mb-3"
                  style={{ color: '#2e7d32', fontSize: '13px', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#2e7d32', display: 'inline-block' }}></span>
                  Deskripsi Kegiatan
                </h6>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold" style={{ fontSize: '13px', color: '#555' }}>
                      JUDUL LAPORAN
                    </label>
                    <input
                      type="text"
                      name="judulLaporan"
                      className="form-control"
                      value={formData.judulLaporan}
                      onChange={handleChange}
                      style={{ borderRadius: '6px', fontSize: '14px' }}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold" style={{ fontSize: '13px', color: '#555' }}>
                      JENIS KEGIATAN
                    </label>
                    <input
                      type="text"
                      name="jenisKegiatan"
                      className="form-control"
                      value={formData.jenisKegiatan}
                      onChange={handleChange}
                      required
                      style={{ borderRadius: '6px', fontSize: '14px' }}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold" style={{ fontSize: '13px', color: '#555' }}>
                      TANGGAL MULAI
                    </label>
                    <input
                      type="date"
                      name="tanggalMulai"
                      className="form-control"
                      value={formData.tanggalMulai}
                      onChange={handleChange}
                      required
                      style={{ borderRadius: '6px', fontSize: '14px' }}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold" style={{ fontSize: '13px', color: '#555' }}>
                      TANGGAL SELESAI
                    </label>
                    <input
                      type="date"
                      name="tanggalSelesai"
                      className="form-control"
                      value={formData.tanggalSelesai}
                      onChange={handleChange}
                      required
                      style={{ borderRadius: '6px', fontSize: '14px' }}
                    />
                  </div>
                  <div className="col-12 mb-3">
                    <label className="form-label fw-semibold" style={{ fontSize: '13px', color: '#555' }}>
                      KETERANGAN
                    </label>
                    <textarea
                      name="keterangan"
                      className="form-control"
                      rows="3"
                      value={formData.keterangan}
                      onChange={handleChange}
                      style={{ borderRadius: '6px', fontSize: '14px' }}
                    />
                  </div>
                </div>
              </div>

              <hr style={{ borderColor: '#e8e8e8' }} />

              {/* ── DAERAH KAWASAN ── */}
              <div className="mb-4">
                <h6
                  className="fw-bold text-uppercase mb-3"
                  style={{ color: '#2e7d32', fontSize: '13px', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#2e7d32', display: 'inline-block' }}></span>
                  Daerah Kawasan
                </h6>

                <div className="row">
                  <div className="col-md-4 mb-3">
                    <label className="form-label fw-semibold" style={{ fontSize: '13px', color: '#555' }}>
                      DAERAH LOKASI
                    </label>
                    <input
                      type="text"
                      name="daerahLokasi"
                      className="form-control"
                      value={formData.daerahLokasi}
                      onChange={handleChange}
                      required
                      style={{ borderRadius: '6px', fontSize: '14px' }}
                    />
                  </div>
                  <div className="col-md-4 mb-3">
                    <label className="form-label fw-semibold" style={{ fontSize: '13px', color: '#555' }}>
                      KABUPATEN
                    </label>
                    <input
                      type="text"
                      name="kabupaten"
                      className="form-control"
                      value={formData.kabupaten}
                      onChange={handleChange}
                      required
                      style={{ borderRadius: '6px', fontSize: '14px' }}
                    />
                  </div>
                  <div className="col-md-4 mb-3">
                    <label className="form-label fw-semibold" style={{ fontSize: '13px', color: '#555' }}>
                      KECAMATAN
                    </label>
                    <input
                      type="text"
                      name="kecamatan"
                      className="form-control"
                      value={formData.kecamatan}
                      onChange={handleChange}
                      required
                      style={{ borderRadius: '6px', fontSize: '14px' }}
                    />
                  </div>

                  <input type="hidden" name="latitude" value={formData.latitude} required />
                  <input type="hidden" name="longitude" value={formData.longitude} required />

                  <div className="col-12 mb-3">
                    <button
                      type="button"
                      className="btn btn-warning"
                      onClick={getLocation}
                      style={{ borderRadius: '6px', fontWeight: 600, fontSize: '14px' }}
                    >
                      Verifikasi Lokasi Saya
                    </button>
                    <small className="text-muted d-block mt-2">{locationStatus}</small>
                  </div>
                </div>
              </div>

              <hr style={{ borderColor: '#e8e8e8' }} />

              {/* ── DOKUMENTASI KEGIATAN ── */}
              <div className="mb-4">
                <h6
                  className="fw-bold text-uppercase mb-3"
                  style={{ color: '#2e7d32', fontSize: '13px', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#2e7d32', display: 'inline-block' }}></span>
                  Dokumentasi Kegiatan
                </h6>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold" style={{ fontSize: '13px', color: '#555' }}>
                      SURAT TUGAS
                      <span className="text-muted fw-normal ms-1" style={{ fontSize: '12px' }}>(pilih file baru untuk mengganti)</span>
                    </label>
                    <input
                      type="file"
                      name="suratTugas"
                      className="form-control"
                      accept=".jpg,.jpeg,.png,.pdf"
                      onChange={handleChange}
                      multiple
                      style={{ borderRadius: '6px', fontSize: '14px' }}
                    />
                    {formData.suratTugas.length > 0 && (
                      <small className="text-success d-block mt-1">
                        ✅ {formData.suratTugas.length} file(s) baru dipilih
                      </small>
                    )}
                    {originalData?.suratTugas && (
                      <div className="mt-2">
                        <small className="text-muted d-block mb-1">File saat ini:</small>
                        {suratTugasList.map((filename, index) => (
                          <a
                            key={index}
                            href={`/uploads/laporan/${filename}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="d-block"
                            style={{ fontSize: '12px', color: '#2e7d32' }}
                          >
                            📂 {filename}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold" style={{ fontSize: '13px', color: '#555' }}>
                      LUAS AREA (ha)
                    </label>
                    <input
                      type="number"
                      name="luasArea"
                      step="0.01"
                      className="form-control"
                      value={formData.luasArea}
                      onChange={handleChange}
                      required
                      style={{ borderRadius: '6px', fontSize: '14px' }}
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold" style={{ fontSize: '13px', color: '#555' }}>
                      FOTO SEBELUM KEGIATAN
                      <span className="text-muted fw-normal ms-1" style={{ fontSize: '12px' }}>(pilih file baru untuk mengganti)</span>
                    </label>
                    <input
                      type="file"
                      name="fotoSebelum"
                      className="form-control"
                      accept=".jpg,.jpeg,.png,.pdf"
                      onChange={handleChange}
                      multiple
                      style={{ borderRadius: '6px', fontSize: '14px' }}
                    />
                    {formData.fotoSebelum.length > 0 && (
                      <small className="text-success d-block mt-1">
                        ✅ {formData.fotoSebelum.length} file(s) baru dipilih
                      </small>
                    )}
                    {originalData?.fotoSebelum && (
                      <div className="mt-2">
                        <small className="text-muted d-block mb-1">File saat ini:</small>
                        {fotoSebelumList.map((filename, index) => (
                          <a
                            key={index}
                            href={`/uploads/laporan/${filename}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="d-block"
                            style={{ fontSize: '12px', color: '#2e7d32' }}
                          >
                            📂 {filename}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold" style={{ fontSize: '13px', color: '#555' }}>
                      FOTO SETELAH KEGIATAN
                      <span className="text-muted fw-normal ms-1" style={{ fontSize: '12px' }}>(pilih file baru untuk mengganti)</span>
                    </label>
                    <input
                      type="file"
                      name="fotoSetelah"
                      className="form-control"
                      accept=".jpg,.jpeg,.png,.pdf"
                      onChange={handleChange}
                      multiple
                      style={{ borderRadius: '6px', fontSize: '14px' }}
                    />
                    {formData.fotoSetelah.length > 0 && (
                      <small className="text-success d-block mt-1">
                        ✅ {formData.fotoSetelah.length} file(s) baru dipilih
                      </small>
                    )}
                    {originalData?.fotoSetelah && (
                      <div className="mt-2">
                        <small className="text-muted d-block mb-1">File saat ini:</small>
                        {fotoSetelahList.map((filename, index) => (
                          <a
                            key={index}
                            href={`/uploads/laporan/${filename}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="d-block"
                            style={{ fontSize: '12px', color: '#2e7d32' }}
                          >
                            📂 {filename}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* ── ACTION BUTTONS ── */}
              <div className="mt-2 text-end">
                <button
                  type="button"
                  className="btn btn-outline-secondary me-2"
                  onClick={() => navigate('/admin-lapangan/laporan')}
                  style={{ borderRadius: '6px', fontWeight: 500, fontSize: '14px' }}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="btn"
                  disabled={saving}
                  style={{
                    borderRadius: '6px',
                    fontWeight: 600,
                    fontSize: '14px',
                    backgroundColor: '#2e7d32',
                    color: '#fff',
                    border: 'none',
                    padding: '8px 20px'
                  }}
                >
                  {saving ? 'Menyimpan...' : 'Update Laporan'}
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>
    </AdminLapanganLayout>
  )
}