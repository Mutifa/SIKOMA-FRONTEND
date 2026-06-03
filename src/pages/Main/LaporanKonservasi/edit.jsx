import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import DashboardLayout from '../../../layouts/DashboardLayout.jsx'
import '../../../assets/css/LaporanKonservasi.css'
import { laporanKonservasiService } from '../../../services/laporanKonservasi'
import { successAlert, errorAlert } from '../../../utils/alert'

/* URL base server untuk preview file yang sudah ada */
const FILE_URL = 'https://codemy.my.id'

export default function LaporanEdit() {
  const { id } = useParams()
  const navigate = useNavigate()

  // ── State Form ───────────────────────────────────────────────────────────
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
    // File baru yang dipilih user (kosong = tidak mengganti file lama)
    suratTugas: [],
    fotoSebelum: [],
    fotoSetelah: []
  })

  // Data asli dari server — dipakai untuk menampilkan file lama
  const [originalData, setOriginalData] = React.useState(null)
  const [loading, setLoading] = React.useState(true)
  const [saving, setSaving] = React.useState(false)
  const [error, setError] = React.useState('')
  const [locationStatus, setLocationStatus] = React.useState('Belum diverifikasi')

  // State bantuan untuk melacak fokus input tanggal
  const [focusMulai, setFocusMulai] = React.useState(false)
  const [focusSelesai, setFocusSelesai] = React.useState(false)

  // ── Helper format tanggal Indonesia ─────────────────────────────────────
  const bulanIndo = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ]

  const formatKeIndo = (dateStr) => {
    if (!dateStr) return ''
    const parts = dateStr.split('-')
    if (parts.length !== 3) return dateStr // Jaga-jaga jika format bukan YYYY-MM-DD
    const [y, m, d] = parts
    return `${d} ${bulanIndo[parseInt(m, 10) - 1]} ${y}`
  }

  // ── Fetch data laporan saat komponen mount ──────────────────────────────
  React.useEffect(() => {
    let mounted = true

    laporanKonservasiService.getById(id) // Ambil detail 1 laporan --show($id)
      .then(res => {
        const laporan = res.data?.data || res.data

        setOriginalData(laporan)

        // Isi form dengan data yang sudah ada
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

        // Jika koordinat sudah ada, tandai sebagai terverifikasi
        if (laporan.latitude && laporan.longitude) {
          setLocationStatus('✅ Lokasi sudah diverifikasi')
        }

        setLoading(false)
      })
      .catch(err => {
        if (!mounted) return
        setError(err.response?.data?.message || 'Gagal memuat data laporan')
        setLoading(false)
      })

    return () => { mounted = false }
  }, [id])

  // ── Handler perubahan input ─────────────────────────────────────────────
  const handleChange = (e) => {
    const { name, value, type, files } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'file' ? Array.from(files) : value
    }))
  }

  // ── Ambil koordinat GPS (tanpa reverse geocoding) ───────────────────────
  const getLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus('❌ Browser tidak mendukung geolocation!')
      return
    }

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
      (err) => {
        const msgs = {
          [err.PERMISSION_DENIED]: '❌ Akses lokasi ditolak!',
          [err.POSITION_UNAVAILABLE]: '❌ Informasi lokasi tidak tersedia!',
          [err.TIMEOUT]: '❌ Permintaan lokasi timeout!',
        }
        setLocationStatus(msgs[err.code] || '❌ Gagal mendapatkan lokasi!')
      }
    )
  }

  // ── Submit update ke backend ────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')

    const fd = new FormData()

    Object.keys(formData).forEach(key => {
      if (['suratTugas', 'fotoSebelum', 'fotoSetelah'].includes(key)) {
        /*
         * Hanya kirim file baru jika user memang memilih file.
         * Kalau kosong, backend akan mempertahankan file lama.
         */
        if (formData[key].length > 0 && formData[key][0] instanceof File) {
          formData[key].forEach(file => fd.append(key, file))
        }
      } else {
        /*
         * HANYA KIRIM jika inputan tidak kosong string ('') 
         * DAN nilainya benar-benar berubah dari data original (menghemat data).
         */
        if (formData[key] !== null && formData[key] !== '') {
          // Pengecekan != dipakai (bukan !==) agar "10" (string dari form) dan 10 (int dari db) dianggap sama
          if (formData[key] != originalData[key]) {
            fd.append(key, formData[key])
          }
        }
      }
    })

    try {
      // ✅ pakai service, bukan api langsung
      await laporanKonservasiService.update(id, fd)

      await successAlert('Berhasil!', 'Laporan konservasi berhasil diperbarui')
      navigate('/laporan-konservasi')

    } catch (err) {
      await errorAlert(
        'Gagal Memperbarui',
        err.response?.data?.message || 'Terjadi kesalahan saat memperbarui laporan'
      )
      setError(err.response?.data?.message || 'Gagal memperbarui laporan')
    } finally {
      setSaving(false)
    }
  }

  // ── Parsing file lama dari JSON (bisa string JSON atau array biasa) ──────
  const parseFileList = (raw) => {
    if (!raw) return []
    if (Array.isArray(raw)) return raw
    try { return JSON.parse(raw) } catch { return [raw] }
  }

  const suratTugasList = parseFileList(originalData?.suratTugas)
  const fotoSebelumList = parseFileList(originalData?.fotoSebelum)
  const fotoSetelahList = parseFileList(originalData?.fotoSetelah)

  // ── Loading spinner ─────────────────────────────────────────────────────
  if (loading) {
    return (
      <DashboardLayout title="Edit Laporan">
        <div className="d-flex justify-content-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  // ── Render ──────────────────────────────────────────────────────────────
  return (
    <DashboardLayout title="Edit Laporan Konservasi">

      {/* Pesan error dari backend */}
      {error && (
        <div className="alert alert-danger mb-4" role="alert">{error}</div>
      )}

      {/* Tombol Kembali */}
      <div className="mb-3">
        <button
          type="button"
          className="btn btn-outline-secondary btn-laporan"
          style={{ borderRadius: '6px', fontWeight: 500 }}
          onClick={() => navigate('/laporan-konservasi')}
        >
          &#171; Kembali
        </button>
      </div>

      <div className="row">
        <div className="col-12">

          {/* Card / box putih utama */}
          <div className="lk-card">
            <form onSubmit={handleSubmit} encType="multipart/form-data">

              {/* SEKSI 1 — DESKRIPSI KEGIATAN */}
              <div className="mb-4">
                <h6 className="lk-section-title">
                  <span className="lk-section-dot"></span>
                  Deskripsi Kegiatan
                </h6>

                <div className="row">

                  <div className="col-md-6 mb-3">
                    <label className="lk-label">JUDUL LAPORAN</label>
                    <input
                      type="text"
                      name="judulLaporan"
                      className="form-control lk-input"
                      value={formData.judulLaporan}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="lk-label">JENIS KEGIATAN</label>
                    <input
                      type="text"
                      name="jenisKegiatan"
                      className="form-control lk-input"
                      value={formData.jenisKegiatan}
                      onChange={handleChange}
                    />
                  </div>

                  {/* TANGGAL MULAI */}
                  <div className="col-md-6 mb-3">
                    <label className="lk-label">TANGGAL MULAI</label>
                    <input
                      type={focusMulai ? "date" : "text"}
                      name="tanggalMulai"
                      className="form-control lk-input"
                      value={focusMulai ? formData.tanggalMulai : formatKeIndo(formData.tanggalMulai)}
                      onFocus={() => setFocusMulai(true)}
                      onBlur={() => setFocusMulai(false)}
                      onChange={handleChange}
                    />
                  </div>

                  {/* TANGGAL SELESAI */}
                  <div className="col-md-6 mb-3">
                    <label className="lk-label">TANGGAL SELESAI</label>
                    <input
                      type={focusSelesai ? "date" : "text"}
                      name="tanggalSelesai"
                      className="form-control lk-input"
                      value={focusSelesai ? formData.tanggalSelesai : formatKeIndo(formData.tanggalSelesai)}
                      onFocus={() => setFocusSelesai(true)}
                      onBlur={() => setFocusSelesai(false)}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-12 mb-3">
                    <label className="lk-label">KETERANGAN</label>
                    <textarea
                      name="keterangan"
                      className="form-control lk-input"
                      rows="3"
                      value={formData.keterangan}
                      onChange={handleChange}
                    />
                  </div>

                </div>
              </div>

              <hr className="lk-form-divider" />

              {/* SEKSI 2 — DAERAH KAWASAN */}
              <div className="mb-4">
                <h6 className="lk-section-title">
                  <span className="lk-section-dot"></span>
                  Daerah Kawasan
                </h6>

                <div className="row">

                  <div className="col-md-4 mb-3">
                    <label className="lk-label">DAERAH LOKASI</label>
                    <input
                      type="text"
                      name="daerahLokasi"
                      className="form-control lk-input"
                      value={formData.daerahLokasi}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-4 mb-3">
                    <label className="lk-label">KABUPATEN</label>
                    <input
                      type="text"
                      name="kabupaten"
                      className="form-control lk-input"
                      value={formData.kabupaten}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-4 mb-3">
                    <label className="lk-label">KECAMATAN</label>
                    <input
                      type="text"
                      name="kecamatan"
                      className="form-control lk-input"
                      value={formData.kecamatan}
                      onChange={handleChange}
                    />
                  </div>

                  <input type="hidden" name="latitude" value={formData.latitude} />
                  <input type="hidden" name="longitude" value={formData.longitude} />

                  <div className="col-12 mb-3">
                    <button
                      type="button"
                      className="lk-btn-location"
                      onClick={getLocation}
                    >
                      Verifikasi Lokasi Saya
                    </button>
                    <span className="lk-location-status">{locationStatus}</span>
                  </div>

                </div>
              </div>

              <hr className="lk-form-divider" />

              {/* SEKSI 3 — DOKUMENTASI KEGIATAN */}
              <div className="mb-4">
                <h6 className="lk-section-title">
                  <span className="lk-section-dot"></span>
                  Dokumentasi Kegiatan
                </h6>

                <div className="row">

                  {/* Surat Tugas */}
                  <div className="col-md-6 mb-3">
                    <label className="lk-label">
                      SURAT TUGAS
                      <span className="text-muted fw-normal ms-1" style={{ fontSize: '12px' }}>
                        (pilih file baru untuk mengganti)
                      </span>
                    </label>
                    <input
                      type="file"
                      name="suratTugas"
                      className="form-control lk-input"
                      accept=".jpg,.jpeg,.png,.pdf"
                      onChange={handleChange}
                      multiple
                    />
                    {formData.suratTugas.length > 0 && (
                      <span className="lk-file-chosen">
                        ✅ {formData.suratTugas.length} file(s) baru dipilih
                      </span>
                    )}
                    {suratTugasList.length > 0 && (
                      <div className="mt-2">
                        <small className="text-muted d-block mb-1">File saat ini:</small>
                        {suratTugasList.map((filename, i) => (
                          <a
                            key={i}
                            href={`${FILE_URL}/uploads/laporan/${filename}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="lk-existing-file"
                          >
                            📂 {filename}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Luas Area */}
                  <div className="col-md-6 mb-3">
                    <label className="lk-label">LUAS AREA (ha)</label>
                    <input
                      type="number"
                      name="luasArea"
                      step="0.01"
                      className="form-control lk-input"
                      value={formData.luasArea}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Foto Sebelum */}
                  <div className="col-md-6 mb-3">
                    <label className="lk-label">
                      FOTO SEBELUM KEGIATAN
                      <span className="text-muted fw-normal ms-1" style={{ fontSize: '12px' }}>
                        (pilih file baru untuk mengganti)
                      </span>
                    </label>
                    <input
                      type="file"
                      name="fotoSebelum"
                      className="form-control lk-input"
                      accept=".jpg,.jpeg,.png,.pdf"
                      onChange={handleChange}
                      multiple
                    />
                    {formData.fotoSebelum.length > 0 && (
                      <span className="lk-file-chosen">
                        ✅ {formData.fotoSebelum.length} file(s) baru dipilih
                      </span>
                    )}
                    {fotoSebelumList.length > 0 && (
                      <div className="mt-2">
                        <small className="text-muted d-block mb-1">File saat ini:</small>
                        {fotoSebelumList.map((filename, i) => (
                          <a
                            key={i}
                            href={`${FILE_URL}/uploads/laporan/${filename}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="lk-existing-file"
                          >
                            📂 {filename}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Foto Setelah */}
                  <div className="col-md-6 mb-3">
                    <label className="lk-label">
                      FOTO SETELAH KEGIATAN
                      <span className="text-muted fw-normal ms-1" style={{ fontSize: '12px' }}>
                        (pilih file baru untuk mengganti)
                      </span>
                    </label>
                    <input
                      type="file"
                      name="fotoSetelah"
                      className="form-control lk-input"
                      accept=".jpg,.jpeg,.png,.pdf"
                      onChange={handleChange}
                      multiple
                    />
                    {formData.fotoSetelah.length > 0 && (
                      <span className="lk-file-chosen">
                        ✅ {formData.fotoSetelah.length} file(s) baru dipilih
                      </span>
                    )}
                    {fotoSetelahList.length > 0 && (
                      <div className="mt-2">
                        <small className="text-muted d-block mb-1">File saat ini:</small>
                        {fotoSetelahList.map((filename, i) => (
                          <a
                            key={i}
                            href={`${FILE_URL}/uploads/laporan/${filename}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="lk-existing-file"
                          >
                            📂 {filename}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>

                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="mt-2 text-end">
                <button
                  type="button"
                  className="btn btn-outline-secondary me-2"
                  style={{ borderRadius: '6px', fontWeight: 500, fontSize: '14px' }}
                  onClick={() => navigate('/laporan-konservasi')}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="lk-btn-primary"
                  disabled={saving}
                >
                  {saving ? 'Menyimpan...' : 'Update Laporan'}
                </button>
              </div>

            </form>
          </div>

        </div>
      </div>

    </DashboardLayout>
  )
}