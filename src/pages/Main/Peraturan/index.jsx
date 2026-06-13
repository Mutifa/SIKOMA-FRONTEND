import React from 'react'
import { Link } from 'react-router-dom'

import DashboardLayout from '../../../layouts/DashboardLayout.jsx'
import peraturanService from '../../../services/peraturan.js'
import Swal from 'sweetalert2'
import {
  confirmDelete,
  successAlert,
  errorAlert
} from '../../../utils/alert'

export default function Peraturan() {

  const [data, setData] = React.useState([])
  const [error, setError] = React.useState('')
  const [loading, setLoading] = React.useState(true)
  const [searchTerm, setSearchTerm] = React.useState('')
  const [currentPage, setCurrentPage] = React.useState(1)
  const [itemsPerPage, setItemsPerPage] = React.useState(10)

  React.useEffect(() => {
    let mounted = true
    peraturanService.getAll()
      .then(res => {
        if (mounted) {
          const result = res.data.data || res.data
          const sorted = [...result].sort((a, b) =>
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

  const handleDelete = async (id) => {
    console.log('handleDelete dipanggil, id:', id)
    const result = await confirmDelete()
    console.log('result confirmDelete:', result)
    if (result.isConfirmed) {
      try {
        await peraturanService.delete(id)
        setData(prev => prev.filter(item => item.id !== id))
        console.log('sebelum successAlert')
        await successAlert('Berhasil', 'Peraturan berhasil dihapus')
        console.log('setelah successAlert')
      } catch (err) {
        console.log('masuk catch:', err)
        await errorAlert('Gagal', err.response?.data?.message || 'Gagal menghapus peraturan')
      }
    }
  }

  const filteredData = data.filter(item => {
    const keyword = searchTerm.toLowerCase()
    const tahunNomor = `${item.tahun || ''} ${item.nomor || ''}`

    return (
      (item.nama || '').toLowerCase().includes(keyword) ||
      (item.deskripsi || '').toLowerCase().includes(keyword) ||
      tahunNomor.toLowerCase().includes(keyword)
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
      <DashboardLayout title="Peraturan">
        <div className="d-flex justify-content-center">
          <div className="spinner-border"></div>
        </div>
      </DashboardLayout>
    )
  }

  return (

    <DashboardLayout
      title="Peraturan"
      actions={
        <Link to="/peraturan/create" className="btn-primary-custom">
          <i className="fas fa-plus"></i>
          Tambah Peraturan
        </Link>
      }
    >
      <div className="row">
        <div className="col-12">

          <div className="white-box">


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
          </div>

          {/* Table */}
          <div className="white-box p-0 overflow-hidden">
            <div className="table-responsive">
              <table className="table mb-0">
                <thead>
                  <tr>
                    <th className="ps-3">No</th>
                    <th>Nama</th>
                    <th>Deskripsi</th>
                    <th>Tahun / Nomor</th>
                    <th className="text-center pe-3">Aksi</th>
                  </tr>
                </thead>
                <tbody>

                  {currentData.length === 0 ? (
                    <tr>
                      <td colSpan="5">
                        <div className="empty-state">
                          <i className="fas fa-gavel"></i>
                          <p className="empty-state__title">Belum ada peraturan</p>
                          <p className="empty-state__text">
                            {searchTerm ? 'Tidak ada peraturan yang sesuai dengan pencarian.' : 'Dokumen peraturan akan muncul setelah ditambahkan.'}
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    currentData.map((item, index) => (
                      <tr key={item.id} className="align-middle">

                        <td className="ps-3">{startIndex + index + 1}</td>
                        <td>{item.nama}</td>
                        <td>{item.deskripsi || '-'}</td>

                        <td>
                          {item.tahun || item.nomor ? (
                            <span className="badge bg-secondary">
                              {item.tahun}
                              {item.tahun && item.nomor ? ' / ' : ''}
                              {item.nomor}
                            </span>
                          ) : '-'}
                        </td>

                        <td className="text-center pe-3">
                          <div className="d-flex gap-1 justify-content-center">

                            {/* Detail — btn-primary-custom */}
                            <Link
                              to={`/peraturan/detail/${item.id}`}
                              className="btn-primary-custom btn-sm"
                              title="Detail"
                            >
                              <i className="fas fa-eye"></i>
                            </Link>

                            {/* Edit — btn-warning-custom */}
                            <Link
                              to={`/peraturan/edit/${item.id}`}
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

    </DashboardLayout>

  )
}