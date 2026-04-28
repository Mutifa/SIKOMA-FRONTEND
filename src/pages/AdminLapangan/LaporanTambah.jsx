import React from 'react'
import { useNavigate } from 'react-router-dom'
import AdminLapanganLayout from '../../layouts/AdminLapanganLayout.jsx'
import api from '../../lib/api.js'
import { laporanKonservasiService } from '../../services/laporanKonservasi'

export default function LaporanTambah() {
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
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState('')
  const [locationStatus, setLocationStatus] = React.useState('Belum diverifikasi')

  const handleChange = (e) => {
    const { name, value, type, files } = e.target
    
    if (type === 'file') {
      console.log(`Files selected for ${name}:`, files.length, files)
      setFormData(prev => ({
        ...prev,
        [name]: Array.from(files)
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const getLocation = () => {
    if (navigator.geolocation) {
      setLocationStatus('📍 Sedang mengambil lokasi...')
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude
          const lng = position.coords.longitude
          
          // Update koordinat
          setFormData(prev => ({
            ...prev,
            latitude: lat.toString(),
            longitude: lng.toString()
          }))
          
          setLocationStatus('🗺️ Sedang mendapatkan informasi daerah...')
          
          try {
            // Reverse geocoding menggunakan Nominatim (OpenStreetMap)
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1&accept-language=id`
            )
            const data = await response.json()
            
            if (data && data.address) {
              const address = data.address
              
              // Extract informasi daerah
              const daerahLokasi = address.state || address.region || address.province || 'Tidak diketahui'
              const kabupaten = address.county || address.city || address.town || address.municipality || 'Tidak diketahui'
              const kecamatan = address.suburb || address.village || address.hamlet || address.neighbourhood || 'Tidak diketahui'
              
              // Update form data dengan informasi daerah
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

    // HANDLE FILE
    if (Array.isArray(formData[key]) && ['suratTugas', 'fotoSebelum', 'fotoSetelah'].includes(key)) {
      formData[key].forEach(file => {
        formDataToSend.append(key, file) // ✅ FIX (tanpa [])
      })
    } 
    // HANDLE TEXT
    else {
      formDataToSend.append(key, formData[key] ?? '') // ✅ FIX (tanpa mapping)
    }
  })

  // DEBUG isi FormData
  console.log('=== FormData contents ===')
  for (let [key, value] of formDataToSend.entries()) {
    console.log(key, value)
  }

  try {
    await laporanKonservasiService.create(formDataToSend)
    navigate('/admin-lapangan/laporan')
  } catch (err) {
    setError(err.response?.data?.message || 'Gagal menyimpan laporan')
  } finally {
    setLoading(false)
  }
}
 
  return (
    <AdminLapanganLayout title="Tambah Laporan Konservasi">
      {error && <div className="alert alert-danger">{error}</div>}
      
      <div className="row">
        <div className="col-12">
          <div className="white-box">


            <form onSubmit={handleSubmit} encType="multipart/form-data">
              {/* Deskripsi Kegiatan */}
              <h4 className="fw-bold">Deskripsi Kegiatan</h4>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Judul Laporan</label>
                  <input
                    type="text"
                    name="judulLaporan"
                    className="form-control"
                    value={formData.judulLaporan}
                    onChange={handleChange}
                    required
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
                  <label className="form-label">Surat Tugas</label>
                  <small className="text-info d-block mb-2">
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
                  />
                  {formData.suratTugas.length > 0 && (
                    <small className="text-success d-block mt-1">
                      ✅ {formData.suratTugas.length} file(s) dipilih
                    </small>
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
                  <label className="form-label">Foto Sebelum Kegiatan</label>
                  <small className="text-info d-block mb-2">
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
                  />
                  {formData.fotoSebelum.length > 0 && (
                    <small className="text-success d-block mt-1">
                      ✅ {formData.fotoSebelum.length} file(s) dipilih
                    </small>
                  )}
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Foto Setelah Kegiatan</label>
                  <small className="text-info d-block mb-2">
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
                  />
                  {formData.fotoSetelah.length > 0 && (
                    <small className="text-success d-block mt-1">
                      ✅ {formData.fotoSetelah.length} file(s) dipilih
                    </small>
                  )}
                </div>
              </div>

              <div className="mt-4 text-end">
                <button
                  type="button"
                  className="btn btn-secondary me-2"
                  onClick={() => navigate('/AdminLapangan/laporan')}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
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
