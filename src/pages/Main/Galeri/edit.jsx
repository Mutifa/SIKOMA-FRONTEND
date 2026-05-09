import React from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

import DashboardLayout from '../../../layouts/DashboardLayout'
import api from '../../../lib/api.js'

export default function GaleriEdit() {

  const navigate = useNavigate()
  const { id } = useParams()

  const [loading, setLoading] = React.useState(true)

  const [formData, setFormData] = React.useState({
    keygaleri: '',
    judul: '',
    deskripsi: '',
    gambar: null
  })

  const [preview, setPreview] = React.useState('')

  React.useEffect(() => {

    let mounted = true

    api.get(`/admin_pusat/galeri/${id}`)

      .then(res => {

        if (mounted) {

          const data = res.data.data || res.data

          setFormData({
            keygaleri: data.keygaleri || '',
            judul: data.judul || '',
            deskripsi: data.deskripsi || data.keterangan || '',
            gambar: null
          })

          setPreview(data.gambar || '')

          setLoading(false)

        }

      })

      .catch(err => {

        console.log(err)

        setLoading(false)

      })

    return () => { mounted = false }

  }, [id])

  const handleSubmit = async (e) => {

    e.preventDefault()

    try {

      const formDataToSend = new FormData()

      formDataToSend.append('keygaleri', formData.keygaleri)
      formDataToSend.append('judul', formData.judul)
      formDataToSend.append('deskripsi', formData.deskripsi)

      if (formData.gambar) {
        formDataToSend.append('gambar', formData.gambar)
      }

      await api.post(
        `/admin_pusat/galeri/${id}`,
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

    }

  }

  if (loading) {

    return (

      <DashboardLayout title="Edit Galeri">

        <div className="d-flex justify-content-center">
          <div className="spinner-border"></div>
        </div>

      </DashboardLayout>

    )

  }

  return (

    <DashboardLayout title="Edit Galeri">

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
            />

          </div>

          {preview && (

            <div className="mb-3">

              <label className="form-label">
                Gambar Saat Ini
              </label>

              <div>

                <img
                  src={`http://127.0.0.1:8000/uploads/galeri/${preview}`}
                  alt="Preview"
                  className="img-thumbnail"
                  style={{ maxHeight: '250px' }}
                />

              </div>

            </div>

          )}

          <div className="d-flex gap-2">

            <button
              type="submit"
              className="btn btn-success"
            >
              Update
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