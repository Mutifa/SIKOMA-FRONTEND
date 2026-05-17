import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

import DashboardLayout from '../../../layouts/DashboardLayout.jsx'
import contentInformasiEdukasi from '../../../services/contentInformasiEdukasi.js'

export default function KontenCreate() {

  const navigate = useNavigate()

  const [saving, setSaving] = React.useState(false)

  const [formData, setFormData] = React.useState({
    judul: '',
    deskripsi: '',
    foto: null,
    kategori: 'Edukasi'
  })

  const handleSubmit = async (e) => {

    e.preventDefault()

    setSaving(true)

    try {

      const formDataToSend = new FormData()

      formDataToSend.append('judul', formData.judul)
      formDataToSend.append('deskripsi', formData.deskripsi)
      formDataToSend.append('kategori', formData.kategori)

      if (formData.foto) {
        formDataToSend.append('foto', formData.foto)
      }

      await contentInformasiEdukasi.create(formDataToSend)

      navigate('/konten')

    } catch (err) {


    } finally {

      setSaving(false)

    }

  }

  return (

    <DashboardLayout title="Tambah Konten">

      <form onSubmit={handleSubmit}>

        <div className="white-box">

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
              Kategori
            </label>

            <select
              className="form-control"
              value={formData.kategori}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  kategori: e.target.value
                })
              }
              required
            >
              <option value="Informasi">
                Informasi
              </option>
              
              <option value="Edukasi">
                Edukasi
              </option>

            </select>

          </div>

          <div className="mb-3">

            <label className="form-label">
              Foto
            </label>

            <input
              type="file"
              className="form-control"
              accept="image/*"
              onChange={(e) =>
                setFormData({
                  ...formData,
                  foto: e.target.files[0]
                })
              }
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

          <div className="d-flex gap-2">

            <button
              type="submit"
              className="btn btn-success"
              disabled={saving}
            >

              {saving ? 'Menyimpan...' : 'Simpan'}

            </button>

            <Link
              to="/konten"
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
