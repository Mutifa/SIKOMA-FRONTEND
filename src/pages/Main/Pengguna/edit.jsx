import React from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import DashboardLayout from '../../../layouts/DashboardLayout'
import { penggunaService } from '../../../services/penggunaService'
// Tambah import ini
import { successAlert, errorAlert } from '../../../utils/alert'

export default function PenggunaEdit() {

  const navigate = useNavigate()
  const { id } = useParams()

  const [loading, setLoading] = React.useState(true)

  const [formData, setFormData] = React.useState({
    name: '',
    username: '',
    email: '',
    password: '',
    role: ''
  })

  React.useEffect(() => {

    let mounted = true

    penggunaService.getById(id)

      .then(res => {

        const data = res.data.data || res.data
        if (mounted) {

          setFormData({
            name: data.name || '',
            username: data.username || '',
            email: data.email || '',
            password: '',
            role: data.role || ''
          })

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
    await penggunaService.update(id, formData)
    await successAlert('Berhasil', 'Pengguna berhasil diupdate')  // ← tambah ini
    navigate('/pengguna')

  } catch (err) {
    await errorAlert('Gagal', err.response?.data?.message || 'Gagal mengupdate data')  // ← tambah ini
  }
}

  if (loading) {
    return (
      <DashboardLayout title="Edit Pengguna">
      </DashboardLayout>
    )
  }

  return (

    <DashboardLayout 
      title="Edit Pengguna"
      actions={
        <div className="d-flex gap-2 flex-wrap">
          <button
            type="submit"
            form="pengguna-edit-form"
            className="btn btn-success"
          >
            Update
          </button>

          <Link
            to="/pengguna"
            className="btn btn-secondary"
          >
            Kembali
          </Link>
        </div>
      }
    >

      <form id="pengguna-edit-form" onSubmit={handleSubmit}>

        <div className="white-box">

          <div className="mb-3">

            <label className="form-label">
              Nama
            </label>

            <input
              type="text"
              className="form-control"
              value={formData.name}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  name: e.target.value
                })
              }
            />

          </div>

          <div className="mb-3">

            <label className="form-label">
              Username
            </label>

            <input
              type="text"
              className="form-control"
              value={formData.username}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  username: e.target.value
                })
              }
            />

          </div>

          <div className="mb-3">

            <label className="form-label">
              Email
            </label>

            <input
              type="email"
              className="form-control"
              value={formData.email}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  email: e.target.value
                })
              }
            />

          </div>

          <div className="mb-3">

            <label className="form-label">
              Password Baru
            </label>

            <input
              type="password"
              className="form-control"
              value={formData.password}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  password: e.target.value
                })
              }
            />

            <small className="text-muted">
              Kosongkan jika tidak ingin mengubah password
            </small>

          </div>

          <div className="mb-3">

            <label className="form-label">
              Role
            </label>

            <select
              className="form-select"
              value={formData.role}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  role: e.target.value
                })
              }
            >

              <option value="admin_lapangan">
                Admin Lapangan
              </option>

              <option value="admin_pusat">
                Admin Pusat
              </option>

            </select>

          </div>

        </div>

      </form>

    </DashboardLayout>

  )
}
