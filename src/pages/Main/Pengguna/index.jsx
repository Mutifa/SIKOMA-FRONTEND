import React from 'react'
import { Link } from 'react-router-dom'

import api from '../../../lib/api'
import DashboardLayout from '../../../layouts/DashboardLayout'

export default function Pengguna() {

  const [data, setData] = React.useState([])
  const [error, setError] = React.useState('')
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {

    let mounted = true

    api.get('/admin_pusat/pengguna')
      .then(res => {

        if (mounted) {
          setData(res.data.data || res.data)
          setLoading(false)
        }

      })

      .catch(err => {

        if (mounted) {
          setError(err.response?.data?.message || 'Gagal memuat data')
          setLoading(false)
        }

      })

    return () => { mounted = false }

  }, [])

  const getRoleBadge = (role) => {

    const map = {
      admin_pusat: { label: 'Admin Pusat', color: 'primary' },
      super_admin: { label: 'Super Admin', color: 'danger' },
      admin_lapangan: { label: 'Admin Lapangan', color: 'success' },
    }

    const r = map[role] || {
      label: role,
      color: 'secondary'
    }

    return (
      <span className={`badge bg-${r.color}`}>
        {r.label}
      </span>
    )
  }

  const handleDelete = async (id) => {

    if (window.confirm('Apakah Anda yakin ingin menghapus pengguna ini?')) {

      try {

        await api.delete(`/admin_pusat/pengguna/${id}`)

        setData(data.filter(user => user.id !== id))

      } catch (err) {

        setError(
          err.response?.data?.message ||
          'Gagal menghapus data'
        )

      }

    }

  }

  if (loading) {
    return (
      <DashboardLayout title="Pengguna">
      </DashboardLayout>
    )
  }

  return (

    <DashboardLayout title="Pengguna">

      {error && (
        <div className="alert alert-danger alert-dismissible fade show">
          <i className="fas fa-exclamation-circle me-2"></i>
          {error}

          <button
            type="button"
            className="btn-close"
            onClick={() => setError('')}
          ></button>
        </div>
      )}

      <div className="row mb-3">

        <div className="col-12">

          <Link
            to="/pengguna/create"
            className="btn btn-primary btn-sm float-end"
          >
            <i className="fas fa-plus me-1"></i>
            Tambah Pengguna
          </Link>

        </div>

      </div>

      <div className="white-box">

        {data.length === 0 ? (

          <div className="text-center py-4">
            <p className="text-muted">
              Belum ada pengguna
            </p>
          </div>

        ) : (

          <div className="table-responsive">

            <table className="table text-nowrap">

              <thead>
                <tr>
                  <th>No</th>
                  <th>Nama</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Aksi</th>
                </tr>
              </thead>

              <tbody>

                {data.map((user, index) => (

                  <tr key={user.id} className="align-middle">

                    <td>{index + 1}.</td>

                    <td>{user.name || 'N/A'}</td>

                    <td>{user.username || 'N/A'}</td>

                    <td>{user.email || 'N/A'}</td>

                    <td>{getRoleBadge(user.role)}</td>

                    <td>

                      <Link
                        to={`/pengguna/detail/${user.id}`}
                        className="btn btn-success btn-sm me-1"
                        title="Detail"
                      >
                        <i className="fas fa-eye"></i>
                      </Link>

                      <Link
                        to={`/pengguna/edit/${user.id}`}
                        className="btn btn-warning btn-sm me-1"
                        title="Edit"
                      >
                        <i className="fas fa-edit"></i>
                      </Link>

                      <button
                        className="btn btn-danger btn-sm text-white"
                        onClick={() => handleDelete(user.id)}
                        title="Hapus"
                      >
                        <i className="fas fa-trash"></i>
                      </button>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </DashboardLayout>

  )
}