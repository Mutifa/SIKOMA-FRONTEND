import React from 'react'
import { Link } from 'react-router-dom'
import { penggunaService } from '../../../services/penggunaService.js'
import DashboardLayout from '../../../layouts/DashboardLayout'
import {
  confirmDelete,
  successAlert,
  errorAlert
} from '../../../utils/alert'

export default function Pengguna() {

  const [data, setData] = React.useState([])
  const [error, setError] = React.useState('')
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    let mounted = true
   penggunaService.getAll()
  .then(res => {
    if (mounted) {
      const result = res.data.data || res.data
      // Sort by updated_at, terbaru di atas
      const sorted = result.sort((a, b) => 
        new Date(b.updated_at) - new Date(a.updated_at)
      )
      setData(sorted)
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
      admin_pusat: { label: 'Admin Pusat', bg: '#EAF3DE', color: '#3B6D11' },
      super_admin: { label: 'Super Admin', bg: '#FCEBEB', color: '#A32D2D' },
      admin_lapangan: { label: 'Admin Lapangan', bg: '#dbeafe', color: '#1e3a8a' },
    }
    const r = map[role] || { label: role, bg: '#f3f4f6', color: '#374151' }
    return (
      <span className="akun-role-badge" style={{ background: r.bg, color: r.color }}>
        {r.label}
      </span>
    )
  }

  const handleDelete = async (id) => {
    const result = await confirmDelete()
    if (result.isConfirmed) {
      try {
        await penggunaService.delete(id)
        setData(prev =>
          prev.filter(user => user.id !== id)
        )
        await successAlert('Berhasil', 'Pengguna berhasil dihapus')
      } catch (err) {
        await errorAlert('Gagal', err.response?.data?.message || 'Gagal menghapus data')
      }
    }
  }

  if (loading) {
    return (
      <DashboardLayout title="Pengguna">
        <div className="d-flex justify-content-center">
          <div className="spinner-border"></div>
        </div>
      </DashboardLayout>
    )
  }

  return (

    <DashboardLayout title="Pengguna">

      {error && (
        <div className="alert alert-danger">
          <i className="fas fa-exclamation-circle me-2"></i>
          {error}
          <button
            style={{ float: 'right', background: 'none', border: 'none', cursor: 'pointer', color: '#991b1b' }}
            onClick={() => setError('')}
          >×</button>
        </div>
      )}

      {/* Tombol Tambah — btn-primary-custom */}
      <div className="white-box">

        <div className="admin-card-header">
          <div className="box-title mb-0">Kelola halaman pengguna</div>

          <Link to="/pengguna/create" className="btn-primary-custom">
            <i className="fas fa-plus"></i>
            Tambah Pengguna
          </Link>
        </div>

        {data.length === 0 ? (
          <div className="empty-state">
            <i className="fas fa-users"></i>
            <p className="empty-state__title">Belum ada pengguna</p>
            <p className="empty-state__text">Pengguna baru akan tampil setelah dibuat.</p>
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
                      <div className="d-flex gap-1">

                        {/* Detail — btn-primary-custom */}
                        <Link
                          to={`/pengguna/detail/${user.id}`}
                          className="btn-primary-custom btn-sm"
                          title="Detail"
                        >
                          <i className="fas fa-eye"></i>
                        </Link>

                        {/* Edit — btn-warning-custom */}
                        <Link
                          to={`/pengguna/edit/${user.id}`}
                          className="btn-warning-custom btn-sm"
                          title="Edit"
                        >
                          <i className="fas fa-edit"></i>
                        </Link>

                        {/* Hapus — btn-danger-custom */}
                        <button
                          className="btn-danger-custom btn-sm"
                          onClick={() => handleDelete(user.id)}
                          title="Hapus"
                        >
                          <i className="fas fa-trash"></i>
                        </button>

                      </div>
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
