import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

import DashboardLayout from '../../../layouts/DashboardLayout.jsx'
import peraturanService from '../../../services/peraturan.js'

export default function PeraturanCreate() {

  const navigate = useNavigate()

  const [saving, setSaving] = React.useState(false)

  const [formData, setFormData] = React.useState({
    nama: '',
    deskripsi: '',
    tahun: '',
    nomor: '',
    file: null
  })

  const handleSubmit = async (e) => {

    e.preventDefault()

    setSaving(true)

    try {

      const formDataToSend = new FormData()

      formDataToSend.append('nama', formData.nama)
      formDataToSend.append('deskripsi', formData.deskripsi)
      formDataToSend.append('tahun', formData.tahun)
      formDataToSend.append('nomor', formData.nomor)

      if (formData.file) {
        formDataToSend.append('file', formData.file)
      }

      await peraturanService.create(formDataToSend)

      navigate('/peraturan')

    } catch (err) {


    } finally {

      setSaving(false)

    }

  }

  return (

    <DashboardLayout title="Tambah Peraturan">

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

          <div className="d-flex gap-2">

            <button
              type="submit"
              className="btn btn-success"
              disabled={saving}
            >

              {saving ? 'Menyimpan...' : 'Simpan'}

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
