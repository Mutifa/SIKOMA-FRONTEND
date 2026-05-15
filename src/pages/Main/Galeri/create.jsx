import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

import DashboardLayout from '../../../layouts/DashboardLayout'
import galeriService from '../../../services/galeriService'

// ─────────────────────────────────────────────
// Halaman Tambah Galeri
// Form untuk membuat entri galeri baru dengan upload gambar
// ─────────────────────────────────────────────
export default function GaleriCreate() {

  const navigate = useNavigate()

  // State loading saat proses simpan berlangsung
  const [saving, setSaving] = React.useState(false)

  // State data form galeri
  const [formData, setFormData] = React.useState({
    keygaleri: '',   // Kategori galeri (banner, galeri, program, edukasi)
    judul: '',       // Judul gambar/konten
    deskripsi: '',   // Deskripsi opsional
    gambar: null     // File gambar yang akan diupload
  })

  // ─────────────────────────────────────────────
  // Handler submit form
  // Mengirim data galeri sebagai multipart/form-data (karena ada file gambar)
  // ─────────────────────────────────────────────
  const handleSubmit = async (e) => {

    e.preventDefault()

    setSaving(true)

    try {

      // Gunakan FormData untuk mengirim data beserta file gambar
      const formDataToSend = new FormData()

      formDataToSend.append('keygaleri', formData.keygaleri)
      formDataToSend.append('judul', formData.judul)
      formDataToSend.append('deskripsi', formData.deskripsi)

      // Hanya append gambar jika user memilih file
      if (formData.gambar) {
        formDataToSend.append('gambar', formData.gambar)
      }

      // Kirim request POST dengan header multipart/form-data
      await galeriService.create(formDataToSend)
              
      // Redirect ke halaman daftar galeri setelah berhasil simpan
      navigate('/galeri')

    } catch (err) {

      // Log error ke console (belum ada UI feedback error)

    } finally {

      setSaving(false)

    }

  }

  // ─────────────────────────────────────────────
  // Render utama: form tambah galeri
  // ─────────────────────────────────────────────
  return (

    <DashboardLayout title="Tambah Galeri">

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
              required
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
              required
            />

          </div>

          {/* Textarea: Deskripsi (opsional) */}
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

          {/* Input: Upload Gambar (hanya menerima file image) */}
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
              required
            />

          </div>

          {/* Tombol Aksi: Simpan & Kembali */}
          <div className="d-flex gap-2">

            {/* Tombol submit: disabled saat proses simpan berlangsung */}
            <button
              type="submit"
              className="btn btn-secondary"
              disabled={saving}
            >
              {saving ? 'Menyimpan...' : 'Simpan'}
            </button>

            {/* Tombol kembali ke daftar galeri */}
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
