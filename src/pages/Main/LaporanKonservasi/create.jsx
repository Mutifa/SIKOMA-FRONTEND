import React from 'react'
import { useNavigate } from 'react-router-dom'
import DashboardLayout from '../../../layouts/DashboardLayout.jsx'
import '../../../assets/css/LaporanKonservasi.css'
import { laporanKonservasiService } from '../../../services/laporanKonservasi'
import { successAlert, errorAlert } from '../../../utils/alert'
import { validateFormInputs } from '../../../utils/formValidation.js'

// ── UTALITAS TANGGAL ─────────────────────────────────────────────────────────
const bulanIndo = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember"
]

// Mengubah objek Date ke string YYYY-MM-DD (format standar HTML date)
const toYYYYMMDD = (date) => {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

// Mendapatkan tanggal hari ini dalam format YYYY-MM-DD
const getTodayDateString = () => toYYYYMMDD(new Date())

const getTomorrowDateString = () => {
  const t = new Date()
  t.setDate(t.getDate() + 1)
  return toYYYYMMDD(t)
}

// Mengubah format YYYY-MM-DD menjadi "DD Bulan YYYY" (Contoh: 2026-06-03 -> 03 Juni 2026)
const formatKeIndo = (dateStr) => {
  if (!dateStr) return ''
  const [y, m, d] = dateStr.split('-')
  const namaBulan = bulanIndo[parseInt(m, 10) - 1]
  return `${d} ${namaBulan} ${y}`
}

export default function LaporanCreate() {
  const navigate = useNavigate()

  // ── STATE FORM ───────────────────────────────────────────────────────────
  const [formData, setFormData] = React.useState({
    judulLaporan: '',
    jenisKegiatan: '',
    tanggalMulai: getTodayDateString(),       // Default: Hari ini (YYYY-MM-DD)
    tanggalSelesai: getTomorrowDateString(),   // Default: Besok (YYYY-MM-DD)
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

  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState('')
  const [locationStatus, setLocationStatus] = React.useState('Belum diverifikasi')

  // State bantuan untuk melacak apakah input tanggal sedang fokus/aktif atau tidak
  const [focusMulai, setFocusMulai] = React.useState(false)
  const [focusSelesai, setFocusSelesai] = React.useState(false)

  // ── HANDLER INPUT UMUM ───────────────────────────────────────────────────
  const handleChange = (e) => {
    const { name, value, type, files } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'file' ? Array.from(files) : value
    }))
  }

  // ── HANDLER OTOMATISASI TANGGAL MULAI ────────────────────────────────────
  const handleTanggalMulaiChange = (e) => {
    const newMulai = e.target.value
    if (!newMulai) return

    // Hitung tanggal selesai otomatis (Tanggal Mulai + 1 Hari)
    const mulaiDate = new Date(newMulai + 'T00:00:00')
    const selesaiDate = new Date(mulaiDate)
    selesaiDate.setDate(mulaiDate.getDate() + 1)

    setFormData(prev => ({
      ...prev,
      tanggalMulai: newMulai,
      tanggalSelesai: toYYYYMMDD(selesaiDate)
    }))
  }

  // ── AMBIL GPS & REVERSE GEOCODING ────────────────────────────────────────
  const getLocation = () => {    
    if (!navigator.geolocation) { 
      setLocationStatus('❌ Browser tidak mendukung geolocation!')
      return
    }

    setLocationStatus('📍 Sedang mengambil lokasi...')

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude
        const lng = position.coords.longitude

        setFormData(prev => ({
          ...prev,
          latitude: lat.toString(),
          longitude: lng.toString()
        }))

        setLocationStatus('🗺️ Sedang mendapatkan informasi daerah...')

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1&accept-language=id`
          )
          const data = await res.json()

          if (data?.address) {
            const addr = data.address
            setFormData(prev => ({
              ...prev,
              daerahLokasi: addr.state || addr.region || addr.province || 'Tidak diketahui',
              kabupaten: addr.county || addr.city || addr.town || addr.municipality || 'Tidak diketahui',
              kecamatan: addr.suburb || addr.village || addr.hamlet || addr.neighbourhood || 'Tidak diketahui',
            }))
            setLocationStatus('✅ Lokasi berhasil diverifikasi dan daerah terisi otomatis!')
          } else {
            setLocationStatus('⚠️ Lokasi ditemukan tapi informasi daerah tidak lengkap')
          }
        } catch {
          setLocationStatus('⚠️ Lokasi ditemukan tapi gagal mendapatkan informasi daerah')
        }
      },
      (err) => {
        const msgs = {
          [err.PERMISSION_DENIED]: '❌ Akses lokasi ditolak! Izinkan akses lokasi di browser.',
          [err.POSITION_UNAVAILABLE]: '❌ Informasi lokasi tidak tersedia!',
          [err.TIMEOUT]: '❌ Permintaan lokasi timeout!',
        }
        setLocationStatus(msgs[err.code] || '❌ Gagal mendapatkan lokasi!')
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
    )
  }

  // ── SUBMIT FORM ──────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!(await validateFormInputs(e.target))) {
      return
    }

    setLoading(true)
    setError('')

    const fd = new FormData()
    Object.keys(formData).forEach(key => {
      if (['suratTugas', 'fotoSebelum', 'fotoSetelah'].includes(key)) {
        formData[key].forEach(file => fd.append(key, file))
      } else {
        fd.append(key, formData[key] ?? '')
      }
    })

    try {
      await laporanKonservasiService.create(fd)
      await successAlert('Berhasil!', 'Laporan konservasi berhasil ditambahkan')
      navigate('/laporan-konservasi')
    } catch (err) {
      await errorAlert(
        'Gagal Menyimpan',
        err.response?.data?.message || 'Terjadi kesalahan saat menyimpan laporan'
      )
      setError(err.response?.data?.message || 'Gagal menyimpan laporan')
    } finally {
      setLoading(false)
    }
  }

  // ── RENDER COMPONENT ─────────────────────────────────────────────────────
  return (
    <DashboardLayout 
      title="Tambah Laporan Konservasi"
      actions={
        <div className="d-flex flex-wrap gap-2 justify-content-between align-items-center">
          <button type="submit" form="laporan-create-form" className="btn-primary-custom" disabled={loading}>
            {loading ? 'Menyimpan...' : 'Simpan Laporan'}
          </button>
          <button type="button" className="btn btn-outline-secondary" onClick={() => navigate('/laporan-konservasi')}>Batal</button>
        </div>
      }
    >

      {error && (
        <div className="alert alert-danger mb-4" role="alert">{error}</div>
      )}

      <div className="row">
        <div className="col-12">
          <div className="lk-card">
            <form id="laporan-create-form" onSubmit={handleSubmit} encType="multipart/form-data" noValidate>

              {/* SEKSI 1 — DESKRIPSI KEGIATAN */}
              <div className="mb-4">
                <h6 className="lk-section-title">
                  <span className="lk-section-dot"></span>
                  Deskripsi Kegiatan
                </h6>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="lk-label">JUDUL LAPORAN</label>
                    <input type="text" name="judulLaporan" className="form-control lk-input"
                      value={formData.judulLaporan} onChange={handleChange} required />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="lk-label">JENIS KEGIATAN</label>
                    <input type="text" name="jenisKegiatan" className="form-control lk-input"
                      value={formData.jenisKegiatan} onChange={handleChange} required />
                  </div>
                  
                  {/* TANGGAL MULAI (Dengan Trik Dynamic Type) */}
                  <div className="col-md-6 mb-3">
                    <label className="lk-label">TANGGAL MULAI</label>
                    <input 
                      type={focusMulai ? "date" : "text"} 
                      name="tanggalMulai" 
                      className="form-control lk-input"
                      value={focusMulai ? formData.tanggalMulai : formatKeIndo(formData.tanggalMulai)} 
                      onFocus={() => setFocusMulai(true)}
                      onBlur={() => setFocusMulai(false)}
                      onChange={handleTanggalMulaiChange} 
                      required 
                    />
                  </div>

                  {/* TANGGAL SELESAI (Dengan Trik Dynamic Type) */}
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
                      required 
                    />
                  </div>

                  <div className="col-12 mb-3">
                    <label className="lk-label">KETERANGAN</label>
                    <textarea name="keterangan" className="form-control lk-input" rows="3"
                      value={formData.keterangan} onChange={handleChange} />
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
                    <input type="text" name="daerahLokasi" className="form-control lk-input"
                      value={formData.daerahLokasi} onChange={handleChange} required />
                  </div>
                  <div className="col-md-4 mb-3">
                    <label className="lk-label">KABUPATEN</label>
                    <input type="text" name="kabupaten" className="form-control lk-input"
                      value={formData.kabupaten} onChange={handleChange} required />
                  </div>
                  <div className="col-md-4 mb-3">
                    <label className="lk-label">KECAMATAN</label>
                    <input type="text" name="kecamatan" className="form-control lk-input"
                      value={formData.kecamatan} onChange={handleChange} required />
                  </div>

                  <input type="hidden" name="latitude" value={formData.latitude} />
                  <input type="hidden" name="longitude" value={formData.longitude} />

                  <div className="col-12 mb-3">
                    <button type="button" className="lk-btn-location" onClick={getLocation}>
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
                  <div className="col-md-6 mb-3">
                    <label className="lk-label">SURAT TUGAS</label>
                    <span className="lk-input-tip">
                      💡 Tahan Ctrl (Windows) atau Cmd (Mac) untuk pilih beberapa file
                    </span>
                    <input type="file" name="suratTugas" className="form-control lk-input"
                      accept=".jpg,.jpeg,.png,.pdf" onChange={handleChange} multiple required />
                    {formData.suratTugas.length > 0 && (
                      <span className="lk-file-chosen">✅ {formData.suratTugas.length} file(s) dipilih</span>
                    )}
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="lk-label">LUAS AREA (ha)</label>
                    <input type="number" name="luasArea" step="0.01" className="form-control lk-input"
                      value={formData.luasArea} onChange={handleChange} required />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="lk-label">FOTO SEBELUM KEGIATAN</label>
                    <span className="lk-input-tip">
                      💡 Tahan Ctrl (Windows) atau Cmd (Mac) untuk pilih beberapa file
                    </span>
                    <input type="file" name="fotoSebelum" className="form-control lk-input"
                      accept=".jpg,.jpeg,.png,.pdf" onChange={handleChange} multiple required />
                    {formData.fotoSebelum.length > 0 && (
                      <span className="lk-file-chosen">✅ {formData.fotoSebelum.length} file(s) dipilih</span>
                    )}
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="lk-label">FOTO SETELAH KEGIATAN</label>
                    <span className="lk-input-tip">
                      💡 Tahan Ctrl (Windows) atau Cmd (Mac) untuk pilih beberapa file
                    </span>
                    <input type="file" name="fotoSetelah" className="form-control lk-input"
                      accept=".jpg,.jpeg,.png,.pdf" onChange={handleChange} multiple required />
                    {formData.fotoSetelah.length > 0 && (
                      <span className="lk-file-chosen">✅ {formData.fotoSetelah.length} file(s) dipilih</span>
                    )}
                  </div>
                </div>
              </div>

            </form>
          </div>
        </div>
      </div>

    </DashboardLayout>
  )
} 
