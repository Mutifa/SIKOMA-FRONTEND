import React from 'react'
import { Link } from 'react-router-dom'

import DashboardLayout from '../../../layouts/DashboardLayout.jsx'
import api from '../../../lib/api.js'
import {
  confirmDelete,
  successAlert,
  errorAlert
} from '../../../utils/alert'

export default function Program() {

  const [data, setData] = React.useState([])
  const [error, setError] = React.useState('')
  const [loading, setLoading] = React.useState(true)
  const [searchTerm, setSearchTerm] = React.useState('')
  const [currentPage, setCurrentPage] = React.useState(1)
  const [itemsPerPage, setItemsPerPage] = React.useState(10)

  React.useEffect(() => {
    let mounted = true
    api.get('/admin_pusat/program')
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

  const handleDelete = async (id) => {
    const result = await confirmDelete()
    if (result.isConfirmed) {
      try {
        await api.delete(`/admin_pusat/program/${id}`)
        setData(prev => prev.filter(item => item.id !== id))
        await successAlert('Berhasil', 'Program berhasil dihapus')
      } catch (err) {
        setError(err.response?.data?.message || 'Gagal menghapus data')
      }
    }
  }

  const stripHtmlTags = (html) => {
    if (!html) return ''
    return html.replace(/<[^>]*>/g, '')
  }

  const filteredData = data.filter(item =>
    item.judul.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.deskripsi.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalPages = Math.ceil(filteredData.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentData = filteredData.slice(startIndex, endIndex)

  const handlePageChange = (page) => setCurrentPage(page)

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(parseInt(e.target.value))
    setCurrentPage(1)
  }

  if (loading) {
    return (
      <DashboardLayout title="Program">
        <div className="d-flex justify-content-center">
          <div className="spinner-border"></div>
        </div>
      </DashboardLayout>
    )
  }

  return (

    <DashboardLayout title="Program">

      {error && <div className="alert alert-danger">{error}</div>}

      {/* Tombol Tambah — btn-primary-custom */}
      <div className="d-flex justify-content-end mb-3">
        <Link to="/program/create" className="btn-primary-custom">
          <i className="fas fa-plus"></i>
          Tambah Program
        </Link>
      </div>

      <div className="white-box">

        <div className="box-title mb-3">Kelola halaman program</div>

        {/* Search & Items per page */}
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
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search..."
              />
            </div>
          </div>

        </div>

        {/* Table */}
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>No</th>
                <th>Foto</th>
                <th>Judul</th>
                <th>Deskripsi</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>

              {currentData.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center">Belum ada program</td>
                </tr>
              ) : (
                currentData.map((item, index) => (
                  <tr key={item.id} className="align-middle">

                    <td>{startIndex + index + 1}.</td>

                    <td>
                      {item.foto ? (
                        <img
                          src={`https://codemy.my.id/uploads/edukasi/${item.foto}`}
                          alt="Foto"
                          width="100"
                          className="img-fluid"
                        />
                      ) : '-'}
                    </td>

                    <td>{item.judul}</td>

                    <td>
                      <div style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {stripHtmlTags(item.deskripsi)}
                      </div>
                    </td>

                    <td>
                      <div className="d-flex gap-1">

                        {/* Detail — btn-primary-custom */}
                        <Link
                          to={`/program/detail/${item.id}`}
                          className="btn-primary-custom btn-sm"
                          title="Detail"
                        >
                          <i className="fas fa-eye"></i>
                        </Link>

                        {/* Edit — btn-warning-custom */}
                        <Link
                          to={`/program/edit/${item.id}`}
                          className="btn-warning-custom btn-sm"
                          title="Edit"
                        >
                          <i className="fas fa-edit"></i>
                        </Link>

                        {/* Hapus — btn-danger-custom */}
                        <button
                          className="btn-danger-custom btn-sm"
                          onClick={() => handleDelete(item.id)}
                          title="Hapus"
                        >
                          <i className="fas fa-trash"></i>
                        </button>

                      </div>
                    </td>

                  </tr>
                ))
              )}

            </tbody>
          </table>
        </div>

        {/* Pagination */}
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

      </div>

    </DashboardLayout>

  )
}