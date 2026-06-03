import React from 'react'
import { useNavigate } from 'react-router-dom'
import DashboardLayout from '../../../layouts/DashboardLayout.jsx'
import '../../../assets/css/LaporanKonservasi.css'
import { laporanKonservasiService } from '../../../services/laporanKonservasi'

// ── Import alert dari utils ──────────────────────────────────────────────────
// successAlert → muncul setelah laporan berhasil disimpan (SEBELUM navigate)
// errorAlert   → muncul jika backend mengembalikan error
import { successAlert, errorAlert } from '../../../utils/alert'

export default function LaporanCreate() {
  const navigate = useNavigate()

  // ── State form ───────────────────────────────────────────────────────────
  const [formData, setFormData] = React.useState({
    judulLaporan:   '',
    jenisKegiatan:  '',
tanggalMulai:   (() => { const t = new Date(); return `${t.getFullYear()}-${String(t.getMonth()+1).padStart(2,'0')}-${String(t.getDate()).padStart(2,'0')}` })(),
tanggalSelesai: (() => { const t = new Date(); t.setDate(t.getDate()+1); return `${t.getFullYear()}-${String(t.getMonth()+1).padStart(2,'0')}-${String(t.getDate()).padStart(2,'0')}` })(),
    keterangan:     '',
    daerahLokasi:   '',
    kabupaten:      '',
    kecamatan:      '',
    latitude:       '',
    longitude:      '',
    luasArea:       '',
    suratTugas:  [],
    fotoSebelum: [],
    fotoSetelah: []
  })

  const [loading,        setLoading]        = React.useState(false)
  const [error,          setError]          = React.useState('')
  const [locationStatus, setLocationStatus] = React.useState('Belum diverifikasi')

  // Tambahkan ini sebelum handleChange
const bulanIndo = ["Januari","Februari","Maret","April","Mei","Juni",
  "Juli","Agustus","September","Oktober","November","Desember"]

const toYYYYMMDD = (date) => {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

const toIndonesiaFormat = (dateStr) => {
  if (!dateStr) return ''
  const [y, m, d] = dateStr.split('-')
  return `${d}/${bulanIndo[parseInt(m) - 1]}/${y}`
}



  // ── Handler input ────────────────────────────────────────────────────────
  const handleChange = (e) => {
    const { name, value, type, files } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'file' ? Array.from(files) : value
    }))
  }

  // ── Ambil GPS + reverse geocoding → isi nama daerah otomatis ────────────
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
          latitude:  lat.toString(),
          longitude: lng.toString()
        }))

        setLocationStatus('🗺️ Sedang mendapatkan informasi daerah...')

        try {
          /*
           * Reverse Geocoding — OpenStreetMap Nominatim (gratis, tanpa API key).
           * Mengubah koordinat GPS → nama provinsi, kabupaten, kecamatan.
           */
          const res  = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1&accept-language=id`
          )
          const data = await res.json()

          if (data?.address) {
            const addr = data.address
            setFormData(prev => ({
              ...prev,
              daerahLokasi: addr.state  || addr.region  || addr.province     || 'Tidak diketahui',
              kabupaten:    addr.county || addr.city    || addr.town         || addr.municipality  || 'Tidak diketahui',
              kecamatan:    addr.suburb || addr.village || addr.hamlet       || addr.neighbourhood || 'Tidak diketahui',
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
          [err.PERMISSION_DENIED]:    '❌ Akses lokasi ditolak! Izinkan akses lokasi di browser.',
          [err.POSITION_UNAVAILABLE]: '❌ Informasi lokasi tidak tersedia!',
          [err.TIMEOUT]:              '❌ Permintaan lokasi timeout!',
        }
        setLocationStatus(msgs[err.code] || '❌ Gagal mendapatkan lokasi!')
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
    )
  }

  // ── Submit form ──────────────────────────────────────────────────────────
  const handleSubmit = async (e) => { // Simpan laporan baru -- store()
    e.preventDefault()
    setLoading(true)
    setError('')

    const fd = new FormData()
    Object.keys(formData).forEach(key => {
      if (['suratTugas', 'fotoSebelum', 'fotoSetelah'].includes(key)) {
        // Kirim tiap file satu-per-satu, backend menerima sebagai array
        formData[key].forEach(file => fd.append(key, file))
      } else {
        fd.append(key, formData[key] ?? '')
      }
    })

    try {
      await laporanKonservasiService.create(fd) // backend menyimpan laporan baru -- store()

      /*
       * ════════════════════════════════════════════════════
       * KUNCI MASALAH — URUTAN INI WAJIB DIIKUTI:
       *
       *   ✅ BENAR:
       *      await successAlert(...)   ← tunggu alert selesai dulu
       *      navigate('/...')          ← baru pindah halaman
       *
       *   ❌ SALAH (alert tidak sempat muncul):
       *      navigate('/...')          ← langsung pindah
       *      (successAlert tidak dipanggil sama sekali)
       *
       * Kenapa? successAlert pakai timer: 1800ms.
       * Kalau navigate() dipanggil duluan, komponen langsung
       * unmount dan SweetAlert ikut hilang sebelum tampil.
       * ════════════════════════════════════════════════════
       */
      await successAlert('Berhasil!', 'Laporan konservasi berhasil ditambahkan')

      navigate('/laporan-konservasi')

    } catch (err) {
      // Tampilkan SweetAlert error + pesan di atas form
      await errorAlert(
        'Gagal Menyimpan',
        err.response?.data?.message || 'Terjadi kesalahan saat menyimpan laporan'
      )
      setError(err.response?.data?.message || 'Gagal menyimpan laporan')
    } finally {
      setLoading(false)
    }
  }

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <DashboardLayout title="Tambah Laporan Konservasi">

      {error && (
        <div className="alert alert-danger mb-4" role="alert">{error}</div>
      )}

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
          <div className="lk-card">
            <form onSubmit={handleSubmit} encType="multipart/form-data">

              {/* ══════════════════════════════════════════
                  SEKSI 1 — DESKRIPSI KEGIATAN
                  ══════════════════════════════════════════ */}
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
                  
                  <div className="col-md-6 mb-3">
  <label className="lk-label">TANGGAL MULAI</label>
  <div style={{ display: 'flex', border: '1px solid #ced4da', borderRadius: '6px', overflow: 'hidden' }}>
    <select className="lk-input" style={{ border: 'none', borderRight: '1px solid #ced4da', flex: 1, outline: 'none' }}
      value={formData.tanggalMulai.split('-')[2] || ''}
      onChange={(e) => {
        const [y, m] = formData.tanggalMulai.split('-')
        const newMulai = `${y}-${m}-${e.target.value}`
        const mulai = new Date(newMulai + 'T00:00:00')
        const selesai = new Date(mulai)
        selesai.setDate(mulai.getDate() + 1)
        setFormData(prev => ({ ...prev, tanggalMulai: newMulai, tanggalSelesai: toYYYYMMDD(selesai) }))
      }}>
      {Array.from({length: 31}, (_, i) => i + 1).map(d => (
        <option key={d} value={String(d).padStart(2,'0')}>{String(d).padStart(2,'0')}</option>
      ))}
    </select>
    <select className="lk-input" style={{ border: 'none', borderRight: '1px solid #ced4da', flex: 1, outline: 'none' }}
      value={formData.tanggalMulai.split('-')[1] || ''}
      onChange={(e) => {
        const [y, , d] = formData.tanggalMulai.split('-')
        const newMulai = `${y}-${e.target.value}-${d}`
        const mulai = new Date(newMulai + 'T00:00:00')
        const selesai = new Date(mulai)
        selesai.setDate(mulai.getDate() + 1)
        setFormData(prev => ({ ...prev, tanggalMulai: newMulai, tanggalSelesai: toYYYYMMDD(selesai) }))
      }}>
      {bulanIndo.map((bln, i) => (
        <option key={i} value={String(i+1).padStart(2,'0')}>{bln}</option>
      ))}
    </select>
    <select className="lk-input" style={{ border: 'none', flex: 1, outline: 'none' }}
      value={formData.tanggalMulai.split('-')[0] || ''}
      onChange={(e) => {
        const [, m, d] = formData.tanggalMulai.split('-')
        const newMulai = `${e.target.value}-${m}-${d}`
        const mulai = new Date(newMulai + 'T00:00:00')
        const selesai = new Date(mulai)
        selesai.setDate(mulai.getDate() + 1)
        setFormData(prev => ({ ...prev, tanggalMulai: newMulai, tanggalSelesai: toYYYYMMDD(selesai) }))
      }}>
      {Array.from({length: 10}, (_, i) => new Date().getFullYear() - 2 + i).map(y => (
        <option key={y} value={y}>{y}</option>
      ))}
    </select>
  </div>
</div>

<div className="col-md-6 mb-3">
  <label className="lk-label">TANGGAL SELESAI</label>
  <div style={{ display: 'flex', border: '1px solid #ced4da', borderRadius: '6px', overflow: 'hidden' }}>
    <select className="lk-input" style={{ border: 'none', borderRight: '1px solid #ced4da', flex: 1, outline: 'none' }}
      value={formData.tanggalSelesai.split('-')[2] || ''}
      onChange={(e) => {
        const [y, m] = formData.tanggalSelesai.split('-')
        setFormData(prev => ({ ...prev, tanggalSelesai: `${y}-${m}-${e.target.value}` }))
      }}>
      {Array.from({length: 31}, (_, i) => i + 1).map(d => (
        <option key={d} value={String(d).padStart(2,'0')}>{String(d).padStart(2,'0')}</option>
      ))}
    </select>
    <select className="lk-input" style={{ border: 'none', borderRight: '1px solid #ced4da', flex: 1, outline: 'none' }}
      value={formData.tanggalSelesai.split('-')[1] || ''}
      onChange={(e) => {
        const [y, , d] = formData.tanggalSelesai.split('-')
        setFormData(prev => ({ ...prev, tanggalSelesai: `${y}-${e.target.value}-${d}` }))
      }}>
      {bulanIndo.map((bln, i) => (
        <option key={i} value={String(i+1).padStart(2,'0')}>{bln}</option>
      ))}
    </select>
    <select className="lk-input" style={{ border: 'none', flex: 1, outline: 'none' }}
      value={formData.tanggalSelesai.split('-')[0] || ''}
      onChange={(e) => {
        const [, m, d] = formData.tanggalSelesai.split('-')
        setFormData(prev => ({ ...prev, tanggalSelesai: `${e.target.value}-${m}-${d}` }))
      }}>
      {Array.from({length: 10}, (_, i) => new Date().getFullYear() - 2 + i).map(y => (
        <option key={y} value={y}>{y}</option>
      ))}
    </select>
  </div>
</div>

                  <div className="col-12 mb-3">
                    <label className="lk-label">KETERANGAN</label>
                    <textarea name="keterangan" className="form-control lk-input" rows="3"
                      value={formData.keterangan} onChange={handleChange} />
                  </div>
                </div>
              </div>

              <hr className="lk-form-divider" />

              {/* ══════════════════════════════════════════
                  SEKSI 2 — DAERAH KAWASAN
                  ══════════════════════════════════════════ */}
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

                  <input type="hidden" name="latitude"  value={formData.latitude}  />
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

              {/* ══════════════════════════════════════════
                  SEKSI 3 — DOKUMENTASI KEGIATAN
                  ══════════════════════════════════════════ */}
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

              {/* ══════════════════════════════════════════
                  ACTION BUTTONS
                  ══════════════════════════════════════════ */}
              <div className="mt-2 text-end">
                <button
                  type="button"
                  className="btn btn-outline-secondary me-2"
                  style={{ borderRadius: '6px', fontWeight: 500, fontSize: '14px' }}
                  onClick={() => navigate('/laporan-konservasi')}
                >
                  Batal
                </button>
                <button type="submit" className="lk-btn-primary" disabled={loading}>
                  {loading ? 'Menyimpan...' : 'Simpan Laporan'}
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>

    </DashboardLayout>
  )
}