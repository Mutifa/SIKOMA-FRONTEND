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
  const [searchTerm, setSearchTerm] = React.useState('')
  const [currentPage, setCurrentPage] = React.useState(1)
  const [itemsPerPage, setItemsPerPage] = React.useState(10)

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

  const filteredData = data.filter(user => {
    const keyword = searchTerm.toLowerCase()
    const roleText = (user.role || '').replace(/_/g, ' ')

    return (
      (user.name || '').toLowerCase().includes(keyword) ||
      (user.username || '').toLowerCase().includes(keyword) ||
      (user.email || '').toLowerCase().includes(keyword) ||
      roleText.toLowerCase().includes(keyword)
    )
  })

  const totalPages = Math.ceil(filteredData.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentData = filteredData.slice(startIndex, endIndex)

  const handlePageChange = (page) => setCurrentPage(page)

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(parseInt(e.target.value))
    setCurrentPage(1)
  }

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value)
    setCurrentPage(1)
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

        <div className="row mb-3">
          <div className="col-md-6">
            <div className="d-flex align-items-center">
              <label className="me-2">Tampilkan</label>
              <select
                className="form-select form-select-sm me-2"
                style={{ width: 'auto' }}
                value={itemsPerPage}
                onChange={handleItemsPerPageChange}
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <span>entri</span>
            </div>
          </div>

          <div className="col-md-6">
            <div className="d-flex justify-content-end align-items-center">
              <label className="me-2">Cari:</label>
              <input
                type="text"
                className="form-control form-control-sm"
                style={{ width: '200px' }}
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Search..."
              />
            </div>
          </div>
        </div>

        {currentData.length === 0 ? (
          <div className="empty-state">
            <i className="fas fa-users"></i>
            <p className="empty-state__title">Belum ada pengguna</p>
            <p className="empty-state__text">
              {searchTerm ? 'Tidak ada pengguna yang sesuai dengan pencarian.' : 'Pengguna baru akan tampil setelah dibuat.'}
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
                {currentData.map((user, index) => (
                  <tr key={user.id} className="align-middle">

                    <td>{startIndex + index + 1}.</td>
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

        {filteredData.length > 0 && (
          <div className="row mt-3">
            <div className="col-md-6">
              <p className="text-muted">
                Menampilkan {startIndex + 1} sampai {Math.min(endIndex, filteredData.length)} dari {filteredData.length} entri
              </p>
            </div>

            <div className="col-md-6">
              <nav>
                <ul className="pagination justify-content-end">
                  <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <button className="page-link" onClick={() => handlePageChange(currentPage - 1)}>
                      Sebelumnya
                    </button>
                  </li>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                      <button className="page-link" onClick={() => handlePageChange(page)}>
                        {page}
                      </button>
                    </li>
                  ))}

                  <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                    <button className="page-link" onClick={() => handlePageChange(currentPage + 1)}>
                      Berikutnya
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        )}

      </div>

    </DashboardLayout>

  )
}
