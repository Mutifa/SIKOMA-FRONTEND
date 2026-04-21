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
    api.get(`/admin_lapangan/laporanKonservasi/${id}`)
      .then(res => {
        if (mounted) {
          const laporan = res.data
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

          // Set location status
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

    const mapping = {
      judulLaporan: 'judul_laporan',
      jenisKegiatan: 'jenis_kegiatan',
      tanggalMulai: 'tanggal_mulai',
      tanggalSelesai: 'tanggal_selesai',
      keterangan: 'keterangan',
      daerahLokasi: 'daerah_lokasi',
      kabupaten: 'kabupaten',
      kecamatan: 'kecamatan',
      latitude: 'latitude',
      longitude: 'longitude',
      luasArea: 'luas_area',
      suratTugas: 'surat_tugas',
      fotoSebelum: 'foto_sebelum',
      fotoSetelah: 'foto_setelah'
    }

    Object.keys(formData).forEach(key => {
      const backendKey = mapping[key]

      if (Array.isArray(formData[key])) {
        if (formData[key].length > 0) {
          formData[key].forEach(file => {
            formDataToSend.append(backendKey, file)
          })
        }
      } else {
        formDataToSend.append(backendKey, formData[key] ?? '')
      }
    })

    try {
      await api.put(`/admin_lapangan/laporanKonservasi/${id}`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      navigate('/admin-lapangan/laporan')
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal memperbarui laporan')
    } finally {
      setSaving(false)
    }
  }

  const fotoSetelahList = originalData?.fotoSetelah
    ? JSON.parse(originalData.fotoSetelah || '[]')
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
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row">
        <div className="col-12">
          <div className="white-box">
            <h3 className="fw-bold mb-4">Edit Laporan Konservasi</h3>

            <form onSubmit={handleSubmit} encType="multipart/form-data">
              {/* Deskripsi Kegiatan */}
              <h4 className="fw-bold">Deskripsi Kegiatan</h4>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Judul Laporan</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.judulLaporan}
                    onChange={(e) =>
                      setFormData({ ...formData, judulLaporan: e.target.value })
                    }
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Jenis Kegiatan</label>
                  <input
                    type="text"
                    name="jenisKegiatan"
                    className="form-control"
                    value={formData.jenisKegiatan}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Tanggal Mulai</label>
                  <input
                    type="date"
                    name="tanggalMulai"
                    className="form-control"
                    value={formData.tanggalMulai}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Tanggal Selesai</label>
                  <input
                    type="date"
                    name="tanggalSelesai"
                    className="form-control"
                    value={formData.tanggalSelesai}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-12 mb-3">
                  <label className="form-label">Keterangan</label>
                  <textarea
                    name="keterangan"
                    className="form-control"
                    rows="3"
                    value={formData.keterangan}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <hr />

              {/* Daerah Kawasan */}
              <h4 className="fw-bold">Daerah Kawasan</h4>
              <div className="row">
                <div className="col-md-4 mb-3">
                  <label className="form-label">Daerah Lokasi</label>
                  <input
                    type="text"
                    name="daerahLokasi"
                    className="form-control"
                    value={formData.daerahLokasi}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label className="form-label">Kabupaten</label>
                  <input
                    type="text"
                    name="kabupaten"
                    className="form-control"
                    value={formData.kabupaten}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label className="form-label">Kecamatan</label>
                  <input
                    type="text"
                    name="kecamatan"
                    className="form-control"
                    value={formData.kecamatan}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Hidden latitude & longitude fields */}
                <input
                  type="hidden"
                  name="latitude"
                  value={formData.latitude}
                  required
                />
                <input
                  type="hidden"
                  name="longitude"
                  value={formData.longitude}
                  required
                />

                <div className="col-12 mb-3">
                  <button
                    type="button"
                    className="btn btn-warning"
                    onClick={getLocation}
                  >
                    Verifikasi Lokasi Saya
                  </button>
                  <small className="text-muted d-block mt-2">{locationStatus}</small>
                </div>
              </div>

              <hr />

              {/* Dokumentasi Kegiatan */}
              <h4 className="fw-bold">Dokumentasi Kegiatan</h4>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Surat Tugas (Pilih beberapa file untuk mengganti)</label>
                  <input
                    type="file"
                    name="suratTugas"
                    className="form-control"
                    accept=".jpg,.jpeg,.png,.pdf"
                    onChange={handleChange}
                    multiple
                  />
                  {formData.suratTugas.length > 0 && (
                    <small className="text-success d-block mt-1">
                      {formData.suratTugas.length} file(s) baru dipilih
                    </small>
                  )}
                  {originalData?.suratTugas && (
                    <div className="mt-1">
                      <small className="text-muted">File saat ini:</small>
                      {JSON.parse(originalData.suratTugas || '[]').map((filename, index) => (
                        <a
                          key={index}
                          href={`/uploads/laporan/${filename}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="d-block"
                        >
                          📂 {filename}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Luas Area (ha)</label>
                  <input
                    type="number"
                    name="luasArea"
                    step="0.01"
                    className="form-control"
                    value={formData.luasArea}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Foto Sebelum Kegiatan (Pilih beberapa file untuk mengganti)</label>
                  <input
                    type="file"
                    name="fotoSebelum"
                    className="form-control"
                    accept=".jpg,.jpeg,.png,.pdf"
                    onChange={handleChange}
                    multiple
                  />
                  {formData.fotoSebelum.length > 0 && (
                    <small className="text-success d-block mt-1">
                      {formData.fotoSebelum.length} file(s) baru dipilih
                    </small>
                  )}
                  {originalData?.fotoSebelum && (
                    <div className="mt-1">
                      <small className="text-muted">File saat ini:</small>
                      {JSON.parse(originalData.fotoSebelum || '[]').map((filename, index) => (
                        <a
                          key={index}
                          href={`/uploads/laporan/${filename}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="d-block"
                        >
                          📂 {filename}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Foto Setelah Kegiatan (Pilih beberapa file untuk mengganti)</label>
                  <input
                    type="file"
                    name="fotoSetelah"
                    className="form-control"
                    accept=".jpg,.jpeg,.png,.pdf"
                    onChange={handleChange}
                    multiple
                  />
                  {formData.fotoSetelah.length > 0 && (
                    <small className="text-success d-block mt-1">
                      {formData.fotoSetelah.length} file(s) baru dipilih
                    </small>
                  )}
                  {originalData?.fotoSetelah && (
                    <div className="mt-1">
                      <small className="text-muted">File saat ini:</small>
                      {JSON.parse(originalData.fotoSetelah || '[]').map((filename, index) => (
                        <a
                          key={index}
                          href={`/uploads/laporan/${filename}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="d-block"
                        >
                          📂 {filename}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4 text-end">
                <button
                  type="button"
                  className="btn btn-secondary me-2"
                  onClick={() => navigate('/admin-lapangan/laporan')}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={saving}
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
