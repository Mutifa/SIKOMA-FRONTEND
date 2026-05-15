import React from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

import DashboardLayout from '../../../layouts/DashboardLayout'
import galeriService from '../../../services/galeriService'

// ─────────────────────────────────────────────
// Halaman Edit Galeri
// Form untuk mengubah data galeri yang sudah ada berdasarkan ID dari URL
// ─────────────────────────────────────────────
export default function GaleriEdit() {

  const navigate = useNavigate()

  // Ambil ID galeri dari parameter URL
  const { id } = useParams()

  // State loading saat fetch data awal berlangsung
  const [loading, setLoading] = React.useState(true)

  // State data form galeri yang akan diedit
  const [formData, setFormData] = React.useState({
    keygaleri: '',   // Kategori galeri (banner, galeri, program, edukasi)
    judul: '',       // Judul gambar/konten
    deskripsi: '',   // Deskripsi konten
    gambar: null     // File gambar baru (null = tidak mengganti gambar lama)
  })

  // State untuk menampilkan preview gambar yang sudah ada sebelumnya
  const [preview, setPreview] = React.useState('')

  // ─────────────────────────────────────────────
  // Fetch data galeri berdasarkan ID saat komponen dimuat
  // Mengisi form dengan data yang sudah ada
  // ─────────────────────────────────────────────
  React.useEffect(() => {

    let mounted = true

    galeriService.get(id)

      .then(res => {

        if (mounted) {

          // Ambil data dari struktur response yang mungkin berbeda
          const data = res.data.data || res.data

          // Isi form dengan data existing dari API
          setFormData({
            keygaleri: data.keygaleri || '',
            judul: data.judul || '',
            // Fallback ke `keterangan` jika field `deskripsi` tidak tersedia
            deskripsi: data.deskripsi || data.keterangan || '',
            gambar: null   // Selalu null saat awal; user harus pilih ulang jika ingin ganti
          })

          // Simpan nama file gambar lama untuk ditampilkan sebagai preview
          setPreview(data.gambar || '')

          setLoading(false)

        }

      })

      .catch(err => {

        // Log error ke console (belum ada UI feedback error)
        console.log(err)

        setLoading(false)

      })

    // Cleanup: set mounted = false saat komponen di-unmount
    return () => { mounted = false }

  }, [id])

  // ─────────────────────────────────────────────
  // Handler submit form
  // Mengirim data update galeri sebagai multipart/form-data
  // ─────────────────────────────────────────────
  const handleSubmit = async (e) => {

    e.preventDefault()

    try {

      // Gunakan FormData untuk mengirim data beserta file gambar (jika ada)
      const formDataToSend = new FormData()

      formDataToSend.append('keygaleri', formData.keygaleri)
      formDataToSend.append('judul', formData.judul)
      formDataToSend.append('deskripsi', formData.deskripsi)

      // Hanya append gambar jika user memilih file baru
      if (formData.gambar) {
        formDataToSend.append('gambar', formData.gambar)
      }

      // Kirim request POST (method override) ke endpoint update galeri
      await galeriService.update(id, formDataToSend)

      // Redirect ke halaman daftar galeri setelah berhasil update
      navigate('/galeri')

    } catch (err) {

      // Log error ke console (belum ada UI feedback error)
      console.log(err)

    }

  }

  // ─────────────────────────────────────────────
  // Tampilkan spinner saat data sedang dimuat
  // ─────────────────────────────────────────────
  if (loading) {

    return (

      <DashboardLayout title="Edit Galeri">

        <div className="d-flex justify-content-center">
          <div className="spinner-border"></div>
        </div>

      </DashboardLayout>

    )

  }

  // ─────────────────────────────────────────────
  // Render utama: form edit galeri
  // ─────────────────────────────────────────────
  return (

    <DashboardLayout title="Edit Galeri">

      <form onSubmit={handleSubmit}>

        <div className="white-box">

          {/* Select: Kategori / Key Galeri */}
          <div className="mb-3">

            <label className="form-label">
              Key Galeri
            </label>

            <select
              className="form-select"
              value={formData.keygaleri}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  keygaleri: e.target.value
                })
              }
            >

              <option value="">
                Pilih Key Galeri
              </option>

              <option value="banner">
                Banner
              </option>

              <option value="galeri">
                Galeri
              </option>

              <option value="program">
                Program
              </option>

              <option value="edukasi">
                Edukasi
              </option>

            </select>

          </div>

          {/* Input: Judul */}
          <div className="mb-3">

            <label className="form-label">
              Judul
            </label>

            <input
              type="text"
              className="form-control"
              value={formData.judul}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  judul: e.target.value
                })
              }
            />

          </div>

          {/* Textarea: Deskripsi */}
          <div className="mb-3">

            <label className="form-label">
              Deskripsi
            </label>

            <textarea
              className="form-control"
              rows="5"
              value={formData.deskripsi}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  deskripsi: e.target.value
                })
              }
            />

          </div>

          {/* Input: Upload Gambar Baru (opsional, tidak wajib diisi ulang) */}
          <div className="mb-3">

            <label className="form-label">
              Gambar
            </label>

            <input
              type="file"
              className="form-control"
              accept="image/*"
              onChange={(e) =>
                setFormData({
                  ...formData,
                  gambar: e.target.files[0]   // Ambil file pertama yang dipilih
                })
              }
            />

          </div>

          {/* Preview gambar lama (hanya tampil jika ada gambar sebelumnya) */}
          {preview && (

            <div className="mb-3">

              <label className="form-label">
                Gambar Saat Ini
              </label>

              <div>

                {/* Gambar diambil dari storage server berdasarkan nama file */}
                <img
                  src={`https://codemy.my.id/uploads/galeri/${preview}`}
                  alt="Preview"
                  className="img-thumbnail"
                  style={{ maxHeight: '250px' }}
                />

              </div>

            </div>

          )}

          {/* Tombol Aksi: Update & Kembali */}
          <div className="d-flex gap-2">

            {/* Tombol submit untuk menyimpan perubahan */}
            <button
              type="submit"
              className="btn-primary-custom"
            >
              Update
            </button>

            {/* Tombol kembali ke daftar galeri tanpa menyimpan */}
            <Link
              to="/galeri"
              className="btn-secondary-custom"
            >
              Kembali
            </Link>

          </div>

        </div>

      </form>

    </DashboardLayout>

  )
}