import React from 'react'
import { useNavigate } from 'react-router-dom'
import AdminLapanganLayout from '../../layouts/AdminLapanganLayout.jsx'
import api from '../../lib/api.js'
import { laporanKonservasiService } from '../../services/laporanKonservasi'

export default function LaporanTambah() {
  const navigate = useNavigate()
    // State utama untuk menyimpan seluruh data form laporan
  const [formData, setFormData] = React.useState({
    judulLaporan: '',
    jenisKegiatan: '',
    tanggalMulai: '',
    tanggalSelesai: '',
    keterangan: '',

   // Data lokasi hasil verifikasi GPS
    daerahLokasi: '',
    kabupaten: '',
    kecamatan: '',
    latitude: '',
    longitude: '',
    luasArea: '',

   // Menyimpan file upload dalam bentuk array
    suratTugas: [],
    fotoSebelum: [],
    fotoSetelah: []
  })

   // Loading saat proses submit
  const [loading, setLoading] = React.useState(false)
   // Menyimpan pesan error dari backend
  const [error, setError] = React.useState('')
  // Status proses verifikasi lokasi
  const [locationStatus, setLocationStatus] = React.useState('Belum diverifikasi')

    // Handle semua perubahan input form
  const handleChange = (e) => {
    const { name, value, type, files } = e.target
    
       // Jika input berupa file
    if (type === 'file') {

         // Debug melihat file yang dipilih
      console.log(`Files selected for ${name}:`, files.length, files)
      setFormData(prev => ({
        ...prev,

          // FileList diubah menjadi array biasa agar mudah diproses React
        [name]: Array.from(files)
      }))
    } else {

         // Untuk input text/date/number biasa
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const getLocation = () => {
        // Cek apakah browser mendukung geolocation
    if (navigator.geolocation) {
      setLocationStatus('📍 Sedang mengambil lokasi...')

         // Mengambil lokasi user saat ini
      navigator.geolocation.getCurrentPosition(
          // Jika berhasil mendapatkan lokasi
        async (position) => {
             // Ambil latitude & longitude dari GPS browser
          const lat = position.coords.latitude
          const lng = position.coords.longitude
          
            // Simpan koordinat ke state React
          setFormData(prev => ({
            ...prev,
            latitude: lat.toString(),
            longitude: lng.toString()
          }))
          
          setLocationStatus('🗺️ Sedang mendapatkan informasi daerah...')
          
          try {

             // Reverse Geocoding:
            // Mengubah koordinat GPS menjadi nama daerah/alamat
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1&accept-language=id`
            )
            const data = await response.json()
            
                  // Jika data alamat berhasil ditemukan
            if (data && data.address) {
              const address = data.address
              
              /* Mengambil informasi wilayah dari hasil OpenStreetMap

                Kenapa lokasi bisa muncul otomatis?
                Karena latitude & longitude dikirim ke API OpenStreetMap,
                lalu API mengembalikan nama provinsi, kabupaten, kecamatan, dll.
              */

              const daerahLokasi = address.state || address.region || address.province || 'Tidak diketahui'
              const kabupaten = address.county || address.city || address.town || address.municipality || 'Tidak diketahui'
              const kecamatan = address.suburb || address.village || address.hamlet || address.neighbourhood || 'Tidak diketahui'
              
              setFormData(prev => ({
                ...prev,
                daerahLokasi: daerahLokasi,
                kabupaten: kabupaten,
                kecamatan: kecamatan
              }))
              
              setLocationStatus('✅ Lokasi berhasil diverifikasi dan daerah terisi otomatis!')
            } else {
              setLocationStatus('⚠️ Lokasi ditemukan tapi informasi daerah tidak lengkap')
            }
          } catch (error) {
            console.error('Reverse geocoding error:', error)
            setLocationStatus('⚠️ Lokasi ditemukan tapi gagal mendapatkan informasi daerah')
          }
        },
        (error) => {
          switch (error.code) {
            case error.PERMISSION_DENIED:
              setLocationStatus('❌ Akses lokasi ditolak! Izinkan akses lokasi di browser.')
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
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000
        }
      )
    } else {
      setLocationStatus('❌ Browser tidak mendukung geolocation!')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    console.log('=== DEBUGGING FORM SUBMISSION ===')
    console.log('formData state:', formData)

    const formDataToSend = new FormData()

    Object.keys(formData).forEach(key => {
      if (Array.isArray(formData[key]) && ['suratTugas', 'fotoSebelum', 'fotoSetelah'].includes(key)) {
        formData[key].forEach(file => {
          formDataToSend.append(key, file)
        })
      } else {
        formDataToSend.append(key, formData[key] ?? '')
      }
    })

    console.log('=== FormData contents ===')
    for (let [key, value] of formDataToSend.entries()) {
      console.log(key, value)
    }

    try {
      await laporanKonservasiService.create(formDataToSend)
      navigate('/laporan-konservasi')
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal menyimpan laporan')
    } finally {
      setLoading(false)
    }
  }
 
  return (
    <AdminLapanganLayout title="Tambah Laporan Konservasi">
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
          onClick={() => navigate('/laporan-konservasi')}
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
                      required
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
                    </label>
                    <small className="text-info d-block mb-2" style={{ fontSize: '12px' }}>
                      💡 Tip: Tahan Ctrl (Windows) atau Cmd (Mac) untuk memilih beberapa file sekaligus
                    </small>
                    <input
                      type="file"
                      name="suratTugas"
                      className="form-control"
                      accept=".jpg,.jpeg,.png,.pdf"
                      onChange={handleChange}
                      multiple={true}
                      required
                      style={{ borderRadius: '6px', fontSize: '14px' }}
                    />
                    {formData.suratTugas.length > 0 && (
                      <small className="text-success d-block mt-1">
                        ✅ {formData.suratTugas.length} file(s) dipilih
                      </small>
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
                    </label>
                    <small className="text-info d-block mb-2" style={{ fontSize: '12px' }}>
                      💡 Tip: Tahan Ctrl (Windows) atau Cmd (Mac) untuk memilih beberapa file sekaligus
                    </small>
                    <input
                      type="file"
                      name="fotoSebelum"
                      className="form-control"
                      accept=".jpg,.jpeg,.png,.pdf"
                      onChange={handleChange}
                      multiple={true}
                      required
                      style={{ borderRadius: '6px', fontSize: '14px' }}
                    />
                    {formData.fotoSebelum.length > 0 && (
                      <small className="text-success d-block mt-1">
                        ✅ {formData.fotoSebelum.length} file(s) dipilih
                      </small>
                    )}
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold" style={{ fontSize: '13px', color: '#555' }}>
                      FOTO SETELAH KEGIATAN
                    </label>
                    <small className="text-info d-block mb-2" style={{ fontSize: '12px' }}>
                      💡 Tip: Tahan Ctrl (Windows) atau Cmd (Mac) untuk memilih beberapa file sekaligus
                    </small>
                    <input
                      type="file"
                      name="fotoSetelah"
                      className="form-control"
                      accept=".jpg,.jpeg,.png,.pdf"
                      onChange={handleChange}
                      multiple={true}
                      required
                      style={{ borderRadius: '6px', fontSize: '14px' }}
                    />
                    {formData.fotoSetelah.length > 0 && (
                      <small className="text-success d-block mt-1">
                        ✅ {formData.fotoSetelah.length} file(s) dipilih
                      </small>
                    )}
                  </div>
                </div>
              </div>

              {/* ── ACTION BUTTONS ── */}
              <div className="mt-2 text-end">
                <button
                  type="button"
                  className="btn btn-outline-secondary me-2"
                  onClick={() => navigate('/laporan-konservasi')}
                  style={{ borderRadius: '6px', fontWeight: 500, fontSize: '14px' }}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="btn"
                  disabled={loading}
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
                  {loading ? 'Menyimpan...' : 'Simpan Laporan'}
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>
    </AdminLapanganLayout>
  )
}