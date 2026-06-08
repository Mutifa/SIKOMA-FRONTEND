import React from 'react'
import DashboardLayout from '../../../layouts/DashboardLayout.jsx'
import standarPelayananService from '../../../services/standarPelayananServices.js'

export default function StandarPelayanan() {
  const [data, setData] = React.useState([])
  const [error, setError] = React.useState('')
  const [loading, setLoading] = React.useState(true)
  const [showViewModal, setShowViewModal] = React.useState(false)
  const [selectedItem, setSelectedItem] = React.useState(null)
  const [searchTerm, setSearchTerm] = React.useState('')
  const [currentPage, setCurrentPage] = React.useState(1)
  const [itemsPerPage, setItemsPerPage] = React.useState(10)

  React.useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const res = await standarPelayananService.getStandar()
      setData(res.data.data || res.data)
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal memuat data')
    } finally {
      setLoading(false)
    }
  }

  const handleView = (item) => {
    setSelectedItem(item)
    setShowViewModal(true)
  }

const formatDate = (dateString) => {
  if (!dateString) return '-'
  const bulan = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ]
  const date = new Date(dateString)
  const day = date.getDate()
  const month = bulan[date.getMonth()]
  const year = date.getFullYear()
  return `${day} ${month} ${year}`
}

  const truncateText = (text, maxLength = 80) => {
    if (!text) return '-'
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
  }

  const filteredData = data.filter(item => {
    const keyword = searchTerm.toLowerCase()

    return (
      (item.nama || '').toLowerCase().includes(keyword) ||
      (item.email || '').toLowerCase().includes(keyword) ||
      (item.nomor_hp || '').toLowerCase().includes(keyword) ||
      (item.judul || '').toLowerCase().includes(keyword) ||
      (item.pesan || '').toLowerCase().includes(keyword) ||
      formatDate(item.created_at).toLowerCase().includes(keyword)
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
      <DashboardLayout title="Standar Pelayanan">
        <div className="d-flex justify-content-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout title="Standar Pelayanan">

      {error && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          <i className="fas fa-exclamation-triangle me-2"></i>
          {error}
          <button type="button" className="btn-close" onClick={() => setError('')}></button>
        </div>
      )}

      <div className="row">
        <div className="col-12">
          <div className="box-title mb-3">Pesan Masuk dari Masyarakat</div>

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

            <div className="table-responsive">
              <table className="table table-hover">
                <thead className="table-light">
                  <tr>
                    <th width="5%">No</th>
                    <th width="20%">Nama</th>
                    <th width="20%">Email</th>
                    <th width="15%">No. HP</th>
                    <th width="25%">Judul</th>
                    <th width="10%">Tanggal</th>
                    <th width="5%" className="text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {currentData.length === 0 ? (
                    <tr>
                      <td colSpan="7">
                        <div className="empty-state">
                          <i className="fas fa-envelope-open"></i>
                          <p className="empty-state__title">Belum ada pesan masuk</p>
                          <p className="empty-state__text">
                            {searchTerm ? 'Tidak ada pesan yang sesuai dengan pencarian.' : 'Pesan dari masyarakat akan tampil di sini.'}
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    currentData.map((item, index) => (
                      <tr key={item.id} className="align-middle">
                        <td>{startIndex + index + 1}</td>
                        <td>{item.nama || '-'}</td>
                        <td>{item.email || '-'}</td>
                        <td>{item.nomor_hp || '-'}</td>
                        <td>{truncateText(item.judul, 50)}</td>
                        <td><small className="text-muted">{formatDate(item.created_at)}</small></td>
                        <td className="text-center">
                          <button
                            className="btn btn-outline-info btn-sm"
                            onClick={() => handleView(item)}
                            title="Lihat Detail"
                          >
                            <i className="fas fa-eye"></i>
                          </button>
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

      {/* View Modal */}
      {showViewModal && selectedItem && (
        <div className="modal show d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header bg-info text-white">
                <h5 className="modal-title">
                  <i className="fas fa-envelope me-2"></i>
                  Detail Pesan
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowViewModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold text-muted">Nama</label>
                    <p className="form-control-plaintext border-bottom">{selectedItem.nama || '-'}</p>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold text-muted">No. HP</label>
                    <p className="form-control-plaintext border-bottom">{selectedItem.nomor_hp || '-'}</p>
                  </div>
                  <div className="col-12 mb-3">
                    <label className="form-label fw-semibold text-muted">Email</label>
                    <p className="form-control-plaintext border-bottom">{selectedItem.email || '-'}</p>
                  </div>
                  <div className="col-12 mb-3">
                    <label className="form-label fw-semibold text-muted">Judul</label>
                    <p className="form-control-plaintext border-bottom">{selectedItem.judul || '-'}</p>
                  </div>
                  <div className="col-12 mb-3">
                    <label className="form-label fw-semibold text-muted">Pesan</label>
                    <div className="border rounded p-3 bg-light">
                      <p className="mb-0" style={{whiteSpace: 'pre-wrap'}}>{selectedItem.pesan || '-'}</p>
                    </div>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold text-muted">Tanggal</label>
                    <p className="form-control-plaintext border-bottom">{formatDate(selectedItem.created_at)}</p>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowViewModal(false)}
                >
                  <i className="fas fa-times me-2"></i>
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </DashboardLayout>
  )
}
