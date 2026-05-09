import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

import DashboardLayout from '../../../layouts/DashboardLayout'
import api from '../../../lib/api.js'

export default function GaleriCreate() {

  const navigate = useNavigate()

  const [saving, setSaving] = React.useState(false)

  const [formData, setFormData] = React.useState({
    keygaleri: '',
    judul: '',
    deskripsi: '',
    gambar: null
  })

  const handleSubmit = async (e) => {

    e.preventDefault()

    setSaving(true)

    try {

      const formDataToSend = new FormData()

      formDataToSend.append('keygaleri', formData.keygaleri)
      formDataToSend.append('judul', formData.judul)
      formDataToSend.append('deskripsi', formData.deskripsi)

      if (formData.gambar) {
        formDataToSend.append('gambar', formData.gambar)
      }

      await api.post(
        '/admin_pusat/galeri',
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      )

      navigate('/galeri')

    } catch (err) {

      console.log(err)

    } finally {

      setSaving(false)

    }

  }

  return (

    <DashboardLayout title="Tambah Galeri">

      <form onSubmit={handleSubmit}>

        <div className="white-box">

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
                  gambar: e.target.files[0]
                })
              }
              required
            />

          </div>

          <div className="d-flex gap-2">

            <button
              type="submit"
              className="btn btn-success"
              disabled={saving}
            >

              {saving ? 'Menyimpan...' : 'Simpan'}

            </button>

            <Link
              to="/galeri"
              className="btn btn-secondary"
            >
              Kembali
            </Link>

          </div>

        </div>

      </form>

    </DashboardLayout>

  )
}