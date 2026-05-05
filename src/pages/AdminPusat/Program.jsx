import React from 'react'
import AdminPusatLayout from '../../layouts/AdminPusatLayout.jsx'
import api from '../../lib/api.js'
import { programService } from '../../services/programService'

export default function Program() {
  const [data, setData] = React.useState([])
  const [error, setError] = React.useState('')
  const [loading, setLoading] = React.useState(true)
  const [showModal, setShowModal] = React.useState(false)
  const [editingItem, setEditingItem] = React.useState(null)
  const [searchTerm, setSearchTerm] = React.useState('')
  const [currentPage, setCurrentPage] = React.useState(1)
  const [itemsPerPage, setItemsPerPage] = React.useState(10)
  const [formData, setFormData] = React.useState({
    judul: '',
    deskripsi: '',
    foto: null,
    kategori: 'Program'
  })

  React.useEffect(() => {
    let mounted = true
    api.get('/admin_pusat/program')
      .then(res => { 
        if (mounted) {
          const programData = res.data.data || res.data
          console.log('Program data:', programData)
          setData(programData)
          setLoading(false)
        }
      })
      .catch(err => { 
        if (mounted) {
          console.error('Error loading programs:', err)
          setError(err.response?.data?.message || 'Gagal memuat')
          setLoading(false)
        }
      })
    return () => { mounted = false }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const formDataToSend = new FormData()
    formDataToSend.append('judul', formData.judul)
    formDataToSend.append('deskripsi', formData.deskripsi)
    formDataToSend.append('kategori', formData.kategori)
    if (formData.foto) {
      formDataToSend.append('foto', formData.foto)
    }

    try {
      if (editingItem) {
        // Laravel workaround: use POST with _method for file uploads
        formDataToSend.append('_method', 'PUT')
        await api.post(`/admin_pusat/program/${editingItem.id}`, formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
      } else {
        await api.post('/admin_pusat/program', formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
      }
      setShowModal(false)
      setEditingItem(null)
      setFormData({ judul: '', deskripsi: '', foto: null, kategori: 'Program' })
      // Reload data
      const res = await api.get('/admin_pusat/program')
      setData(res.data.data || res.data)
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal menyimpan program')
    }
  }

  const handleEdit = (item) => {
    setEditingItem(item)
    setFormData({
      judul: item.judul || '',
      deskripsi: item.deskripsi || '',
      foto: null,
      kategori: item.kategori || 'Program'
    })
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus program ini?')) {
      try {
        await api.delete(`/admin_pusat/program/${id}`)
        setData(data.filter(item => item.id !== id))
      } catch (err) {
        setError(err.response?.data?.message || 'Gagal menghapus program')
      }
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()
    return `${day}-${month}-${year}`
  }

  const stripHtmlTags = (html) => {
    if (!html) return ''
    return html.replace(/<[^>]*>/g, '')
  }

  // Filter data based on search term
  const filteredData = data.filter(item =>
    item.judul.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.deskripsi.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentData = filteredData.slice(startIndex, endIndex)

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(parseInt(e.target.value))
    setCurrentPage(1)
  }

  if (loading) {
    return (
      <AdminPusatLayout title="Program">
        <div className="d-flex justify-content-center">
          <div className="spinner-border" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      </AdminPusatLayout>
    )
  }

  return (
    <AdminPusatLayout title="Program">
      {error && <div className="alert alert-danger alert-dismissible fade show" role="alert">
        {error}
        <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>}
      
      <div className="row">
        <div className="col-12">
          <a 
            href="#tambahprogram" 
            type="button" 
            data-bs-toggle="modal" 
            className="btn btn-primary btn-sm float-end"
            onClick={() => {
              setEditingItem(null)
              setFormData({ judul: '', deskripsi: '', foto: null, kategori: 'Program' })
              setShowModal(true)
            }}
          >
            + Tambah Program
          </a>
          <div className="white-box">
            <div className="box-title mb-3">Kelola halaman program</div>

            {/* Search and Filter Controls */}
            <div className="row mb-3">
              <div className="col-md-6">
                <div className="d-flex align-items-center">
                  <label className="me-2">Tampilkan</label>
                  <select 
                    className="form-select form-select-sm me-2" 
                    style={{width: 'auto'}}
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
                <div className="d-flex justify-content-end">
                  <label className="me-2">Cari:</label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    style={{width: '200px'}}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search..."
                  />
                </div>
              </div>
            </div>

            <div className="table-responsive">
              <table id="dataTables" className="table">
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
                        <td className="text-capitalize">
                          {item.foto ? (
                            <img 
                              src={`https://codemy.my.id/uploads/edukasi/${item.foto}`}
                              alt="Foto Program" 
                              className="img-fluid" 
                              width="100px"
                              onError={(e) => {
                                e.target.style.display = 'none'
                                const fallback = e.target.parentNode.querySelector('.fallback-text')
                                if (fallback) fallback.style.display = 'inline'
                              }}
                            />
                          ) : null}
                          <span 
                            className="fallback-text" 
                            style={{display: item.foto ? 'none' : 'inline'}}
                          >
                            &lt;Foto Program&gt;
                          </span>
                        </td>
                        <td className="text-capitalize">{item.judul}</td>
                        <td className="text-capitalize">
                          <div
                            style={{
                              display: '-webkit-box',
                              WebkitLineClamp: 3,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis'
                            }}
                          >
                            {stripHtmlTags(item.deskripsi)}
                          </div>
                        </td>
                        <td>
                          <button 
                            className="btn btn-warning btn-sm"
                            onClick={() => handleEdit(item)}
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                          <button 
                            className="btn btn-danger btn-sm text-white ms-1"
                            onClick={() => handleDelete(item.id)}
                          >
                            <i className="fas fa-trash"></i>
                          </button>
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
                <nav aria-label="Page navigation">
                  <ul className="pagination justify-content-end">
                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                      <button 
                        className="page-link" 
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        Sebelumnya
                      </button>
                    </li>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                        <button 
                          className="page-link" 
                          onClick={() => handlePageChange(page)}
                        >
                          {page}
                        </button>
                      </li>
                    ))}
                    <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                      <button 
                        className="page-link" 
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                      >
                        Berikutnya
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Tambah program */}
      {showModal && (
        <div className="modal show d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
          <div className="modal-dialog modal-lg">
            <form onSubmit={handleSubmit}>
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    {editingItem ? 'Edit Program' : 'Tambah Program'}
                  </h5>
                  <button 
                    type="button" 
                    className="btn-close" 
                    onClick={() => setShowModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Judul</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.judul}
                        onChange={(e) => setFormData({...formData, judul: e.target.value})}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Foto</label>
                      <input
                        type="file"
                        className="form-control"
                        accept="image/*"
                        onChange={(e) => setFormData({...formData, foto: e.target.files[0]})}
                      />
                      {editingItem && editingItem.foto && (
                        <div className="mt-2">
                          <label className="form-label">Foto Saat Ini:</label>
                          <div className="text-center">
                            <img 
                              src={`/uploads/edukasi/${editingItem.foto}`} 
                              alt="Current" 
                              className="img-thumbnail" 
                              style={{maxHeight: '200px'}}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="col-12">
                      <label className="form-label">Deskripsi</label>
                      <textarea
                        className="form-control"
                        value={formData.deskripsi}
                        onChange={(e) => setFormData({...formData, deskripsi: e.target.value})}
                        rows="3"
                      />
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button 
                    type="button" 
                    className="btn btn-secondary" 
                    onClick={() => setShowModal(false)}
                  >
                    Batal
                  </button>
                  <button type="submit" className="btn btn-success">
                    {editingItem ? 'Update' : 'Simpan'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminPusatLayout>
  )
}
