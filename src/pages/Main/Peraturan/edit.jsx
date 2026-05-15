import React from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

import DashboardLayout from '../../../layouts/DashboardLayout.jsx'
import peraturanService from '../../../services/peraturan.js'

export default function PeraturanEdit() {

  const navigate = useNavigate()
  const { id } = useParams()

  const [loading, setLoading] = React.useState(true)

  const [formData, setFormData] = React.useState({
    nama: '',
    deskripsi: '',
    tahun: '',
    nomor: '',
    file: null
  })

  const [preview, setPreview] = React.useState('')

  React.useEffect(() => {

    let mounted = true

    peraturanService.get(id)

      .then(res => {

        if (mounted) {

          const data = res.data.data || res.data

          setFormData({
            nama: data.nama || '',
            deskripsi: data.deskripsi || '',
            tahun: data.tahun || '',
            nomor: data.nomor || '',
            file: null
          })

          setPreview(data.file || '')

          setLoading(false)

        }

      })

      .catch(err => {


        setLoading(false)

      })

    return () => { mounted = false }

  }, [id])

  const handleSubmit = async (e) => {

    e.preventDefault()

    try {

      const formDataToSend = new FormData()

      formDataToSend.append('nama', formData.nama)
      formDataToSend.append('deskripsi', formData.deskripsi)
      formDataToSend.append('tahun', formData.tahun)
      formDataToSend.append('nomor', formData.nomor)

      if (formData.file) {
        formDataToSend.append('file', formData.file)
      }

      formDataToSend.append('_method', 'PUT')

      await peraturanService.update(id, formDataToSend)

      navigate('/peraturan')

    } catch (err) {


    }

  }

  if (loading) {

    return (
      <DashboardLayout title="Edit Peraturan">
      </DashboardLayout>
    )

  }

  return (

    <DashboardLayout title="Edit Peraturan">

      <form onSubmit={handleSubmit}>

        <div className="white-box">

          <div className="mb-3">

            <label className="form-label">
              Nama
            </label>

            <input
              type="text"
              className="form-control"
              value={formData.nama}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  nama: e.target.value
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
              rows="4"
              value={formData.deskripsi}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  deskripsi: e.target.value
                })
              }
            />

          </div>

          <div className="row">

            <div className="col-md-6 mb-3">

              <label className="form-label">
                Tahun
              </label>

              <input
                type="number"
                className="form-control"
                value={formData.tahun}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    tahun: e.target.value
                  })
                }
              />

            </div>

            <div className="col-md-6 mb-3">

              <label className="form-label">
                Nomor
              </label>

              <input
                type="text"
                className="form-control"
                value={formData.nomor}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    nomor: e.target.value
                  })
                }
              />

            </div>

          </div>

          <div className="mb-3">

            <label className="form-label">
              File
            </label>

            <input
              type="file"
              className="form-control"
              accept=".pdf,.doc,.docx"
              onChange={(e) =>
                setFormData({
                  ...formData,
                  file: e.target.files[0]
                })
              }
            />

          </div>

          {preview && (

            <div className="mb-3">

              <label className="form-label">
                File Saat Ini
              </label>

              <div>

                <a
                  href={`https://codemy.my.id/uploads/peraturan/${preview}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline-info"
                >

                  <i className="fas fa-file-alt me-1"></i>
                  Lihat File

                </a>

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
              to="/peraturan"
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
