import React from 'react'
import { Link } from 'react-router-dom'
import DashboardLayout from '../../../layouts/DashboardLayout.jsx'
import adminInformasiEdukasiService from '../../../services/adminInformasiEdukasiService.js'
import { assetUrl } from '../../../lib/assets.js'
import { successAlert, errorAlert, confirmDelete } from '../../../utils/alert.js'

export default function Konten() {

  const [data, setData] = React.useState([])
  const [error, setError] = React.useState('')
  const [loading, setLoading] = React.useState(true)
  const [searchTerm, setSearchTerm] = React.useState('')
  const [currentPage, setCurrentPage] = React.useState(1)
  const [itemsPerPage, setItemsPerPage] = React.useState(10)

  React.useEffect(() => {
    let mounted = true
    adminInformasiEdukasiService.getAll()
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
        await adminInformasiEdukasiService.delete(id)
        setData(prev => prev.filter(item => item.id !== id))
        await successAlert('Berhasil', 'Konten berhasil dihapus')
      } catch (err) {
        await errorAlert('Gagal menghapus konten')
      }
    }
  }

  const stripHtmlTags = (html) => {
    if (!html) return ''
    return html.replace(/<[^>]*>/g, '')
  }

  const filteredData = data.filter(item => {
    const keyword = searchTerm.toLowerCase()

    return (
      (item.judul || '').toLowerCase().includes(keyword) ||
      stripHtmlTags(item.deskripsi).toLowerCase().includes(keyword)
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

  if (loading) {
    return (
      <DashboardLayout title="Informasi & Edukasi">
        <div className="d-flex justify-content-center">
          <div className="spinner-border"></div>
        </div>
      </DashboardLayout>
    )
  }

  return (

    <DashboardLayout title="Informasi & Edukasi">

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row">
        <div className="col-12">

          {/* Tombol Tambah — btn-primary-custom */}
          <div className="white-box">

            <div className="admin-card-header">
              <div className="box-title mb-0">
                Kelola halaman Informasi & edukasi
              </div>

              <Link to="/dashboard/informasi-edukasi/create" className="btn-primary-custom">
                <i className="fas fa-plus"></i>
                Tambah Edukasi
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
                      <td colSpan="5">
                        <div className="empty-state">
                          <i className="fas fa-newspaper"></i>
                          <p className="empty-state__title">Belum ada konten</p>
                          <p className="empty-state__text">
                            {searchTerm ? 'Tidak ada konten yang sesuai dengan pencarian.' : 'Konten informasi dan edukasi akan muncul setelah ditambahkan.'}
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    currentData.map((item, index) => (
                      <tr key={item.id} className="align-middle">

                        <td>{startIndex + index + 1}.</td>

                        <td>
                          {item.foto ? (
                            <img
                              src={assetUrl(`/uploads/edukasi/${item.foto}`)}
                              alt="Foto Edukasi"
                              className="img-fluid"
                              width="100px"
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
                              to={`/dashboard/informasi-edukasi/detail/${item.id}`}
                              className="btn-primary-custom btn-sm"
                              title="Detail"
                            >
                              <i className="fas fa-eye"></i>
                            </Link>

                            {/* Edit — btn-warning-custom */}
                            <Link
                              to={`/dashboard/informasi-edukasi/edit/${item.id}`}
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

        </div>
      </div>

    </DashboardLayout>

  )
}
