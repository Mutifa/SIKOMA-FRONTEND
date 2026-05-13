import React from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

import DashboardLayout from '../../../layouts/DashboardLayout.jsx'
import { programService } from '../../../services/programService.js'

export default function ProgramEdit() {

  const navigate = useNavigate()
  const { id } = useParams()

  const [loading, setLoading] = React.useState(true)

  const [formData, setFormData] = React.useState({
    judul: '',
    deskripsi: '',
    foto: null,
    kategori: 'Program'
  })

  const [preview, setPreview] = React.useState('')

  React.useEffect(() => {

    let mounted = true

    programService.getById(id)

      .then(res => {

        if (mounted) {

          const data = res.data.data || res.data

          setFormData({
            judul: data.judul || '',
            deskripsi: data.deskripsi || '',
            foto: null,
            kategori: data.kategori || 'Program'
          })

          setPreview(data.foto || '')

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

      formDataToSend.append('judul', formData.judul)
      formDataToSend.append('deskripsi', formData.deskripsi)
      formDataToSend.append('kategori', formData.kategori)

      if (formData.foto) {
        formDataToSend.append('foto', formData.foto)
      }

      formDataToSend.append('_method', 'PUT')

      await programService.update(id, formDataToSend)

      navigate('/program')

    } catch (err) {

      console.log(err)

    }

  }

  if (loading) {

    return (
      <DashboardLayout title="Edit Program">
      </DashboardLayout>
    )

  }

  return (

    <DashboardLayout title="Edit Program">

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
            />

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

          {preview && (

            <div className="mb-3">

              <label className="form-label">
                Foto Saat Ini
              </label>

              <div>

                <img
                  src={`https://codemy.my.id/uploads/edukasi/${preview}`}
                  alt="Preview"
                  className="img-thumbnail"
                  style={{ maxHeight: '200px' }}
                />

              </div>

            </div>

          )}

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
            >
              Update
            </button>

            <Link
              to="/program"
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