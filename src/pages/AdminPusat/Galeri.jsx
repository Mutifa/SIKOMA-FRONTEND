import React from 'react'
import AdminPusatLayout from '../../layouts/AdminPusatLayout.jsx'
import api from '../../lib/api.js'

export default function Galeri() {
  const [data, setData] = React.useState([])
  const [error, setError] = React.useState('')
  const [loading, setLoading] = React.useState(true)
  const [showModal, setShowModal] = React.useState(false)
  const [editingItem, setEditingItem] = React.useState(null)
  const [currentPage, setCurrentPage] = React.useState(1)
  const [itemsPerPage, setItemsPerPage] = React.useState(8)
  const [formData, setFormData] = React.useState({
    keygaleri: '',
    judul: '',
    deskripsi: '',
    gambar: null
  })

  React.useEffect(() => {
    let mounted = true
    api.get('/api/AdminPusat/galeri')
      .then(res => { 
        if (mounted) {
          setData(res.data.data || res.data)
          setLoading(false)
        }
      })
      .catch(err => { 
        if (mounted) {
          setError(err.response?.data?.message || 'Gagal memuat')
          setLoading(false)
        }
      })
    return () => { mounted = false }
  }, [])

  // Pagination
  const totalPages = Math.ceil(data.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentData = data.slice(startIndex, endIndex)

  const handleEdit = (item) => {
    setEditingItem(item)
    setFormData({
      keygaleri: item.keygaleri || '',
      judul: item.judul || '',
      deskripsi: item.deskripsi || item.keterangan || '',
      gambar: null
    })
    setShowModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const formDataToSend = new FormData()
      formDataToSend.append('keygaleri', formData.keygaleri)
      formDataToSend.append('judul', formData.judul)
      formDataToSend.append('deskripsi', formData.deskripsi)
      if (formData.gambar) {
        formDataToSend.append('gambar', formData.gambar)
      }

      if (editingItem) {
        // Update item - Laravel already uses POST for galeri updates
        await api.post(`/api/AdminPusat/galeri/${editingItem.id}`, formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        const updatedData = data.map(item => item.id === editingItem.id ? {...item, ...formData} : item)
        setData(updatedData)
      } else {
        // Create item
        const response = await api.post('/api/AdminPusat/galeri', formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        const newData = [response.data, ...data]
        setData(newData)
      }
      setShowModal(false)
      setEditingItem(null)
      setFormData({
        keygaleri: '',
        judul: '',
        deskripsi: '',
        gambar: null
      })
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal menyimpan data')
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus item ini?')) {
      try {
        await api.delete(`/api/AdminPusat/galeri/${id}`)
        const newData = data.filter(item => item.id !== id)
        setData(newData)
      } catch (err) {
        setError(err.response?.data?.message || 'Gagal menghapus data')
      }
    }
  }

  if (loading) {
    return (
      <AdminPusatLayout title="Galeri">
        <div className="d-flex justify-content-center">
          <div className="spinner-border" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      </AdminPusatLayout>
    )
  }

  return (
    <AdminPusatLayout title="Galeri">
      {error && <div className="alert alert-danger">{error}</div>}
      
      {/* Header with Add Button */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center">
            <h4 className="mb-0">Galeri</h4>
            <button 
              className="btn btn-success"
              onClick={() => {
                setEditingItem(null)
                setFormData({
                  keygaleri: '',
                  judul: '',
                  deskripsi: '',
                  gambar: null
                })
                setShowModal(true)
              }}
            >
              <i className="fas fa-plus me-2"></i>+ Tambah Galeri
            </button>
          </div>
        </div>
      </div>

      {/* Pagination Controls */}
      <div className="gallery-controls mb-4">
        <div className="row">
          <div className="col-md-6">
            <div className="d-flex align-items-center">
              <label className="me-2">Tampilkan:</label>
              <select 
                className="form-select form-select-sm me-2" 
                style={{width: '80px'}}
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
              >
                <option value={4}>4</option>
                <option value={8}>8</option>
                <option value={12}>12</option>
                <option value={16}>16</option>
              </select>
              <span>entri</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Gallery Grid */}
      <div className="white-box">
        <h5 className="mb-3">Daftar Galeri</h5>
        
        {currentData.length === 0 ? (
          <div className="gallery-empty">
            <i className="fas fa-images fa-3x mb-3"></i>
            <p>Belum ada galeri</p>
          </div>
        ) : (
          <div className="row">
            {currentData.map((item, index) => (
              <div key={item.id} className="col-lg-3 col-md-4 col-sm-6 mb-4">
                <div className="card h-100 gallery-card">
                  <div className="position-relative">
                    {item.gambar ? (
                      <img 
                        src={`/uploads/galeri/${item.gambar}`} 
                        className="card-img-top" 
                        alt={item.judul}
                        style={{height: '200px', objectFit: 'cover'}}
                      />
                    ) : (
                      <div 
                        className="card-img-top d-flex align-items-center justify-content-center gallery-image-placeholder"
                        style={{height: '200px'}}
                      >
                        <div className="text-center text-muted">
                          <i className="fas fa-image fa-3x mb-2"></i>
                          <div className="small">{item.judul || 'Gambar'}</div>
                        </div>
                      </div>
                    )}
                    <div className="position-absolute top-0 start-0 m-2">
                      <span className="badge bg-primary gallery-badge">{item.keygaleri || 'Galeri'}</span>
                    </div>
                  </div>
                  <div className="card-body d-flex flex-column">
                    <h6 className="card-title gallery-title">{item.judul || 'N/A'}</h6>
                    <p className="card-text small text-muted mb-1">
                      <strong>ID:</strong> {item.keygaleri || 'N/A'}
                    </p>
                    <p className="card-text gallery-description flex-grow-1">
                      {item.deskripsi || item.keterangan || 'Tidak ada deskripsi'}
                    </p>
                    <div className="btn-group w-100 mt-auto gallery-actions">
                      <button 
                        className="btn btn-warning btn-sm"
                        onClick={() => handleEdit(item)}
                        title="Edit"
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button 
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(item.id)}
                        title="Hapus"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="gallery-pagination">
            <div className="d-flex justify-content-between align-items-center">
              <div className="text-muted">
                Menampilkan {startIndex + 1} sampai {Math.min(endIndex, data.length)} dari {data.length} entri
              </div>
              <nav>
                <ul className="pagination pagination-sm mb-0">
                  <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <button 
                      className="page-link" 
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      Sebelumnya
                    </button>
                  </li>
                  {[...Array(totalPages)].map((_, index) => (
                    <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                      <button 
                        className="page-link" 
                        onClick={() => setCurrentPage(index + 1)}
                      >
                        {index + 1}
                      </button>
                    </li>
                  ))}
                  <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                    <button 
                      className="page-link" 
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      Berikutnya
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        )}
      </div>

      {/* Modal Form */}
      {showModal && (
        <div className="modal show d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050}}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content gallery-modal">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">
                  <i className="fas fa-images me-2"></i>
                  {editingItem ? 'Edit Galeri' : 'Tambah Galeri'}
                </h5>
                <button 
                  type="button" 
                  className="btn-close btn-close-white" 
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label htmlFor="keygaleri" className="form-label">
                          <i className="fas fa-tag me-1"></i>Key Galeri
                        </label>
                        <select 
                          id="keygaleri" 
                          className="form-select" 
                          value={formData.keygaleri}
                          onChange={(e) => setFormData({...formData, keygaleri: e.target.value})}
                          required
                        >
                          <option value="">Pilih Key Galeri</option>
                          <option value="banner">Banner</option>
                          <option value="galeri">Galeri</option>
                          <option value="program">Program</option>
                          <option value="edukasi">Edukasi</option>
                        </select>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label htmlFor="judul" className="form-label">
                          <i className="fas fa-heading me-1"></i>Judul
                        </label>
                        <input 
                          type="text" 
                          id="judul" 
                          className="form-control" 
                          value={formData.judul}
                          onChange={(e) => setFormData({...formData, judul: e.target.value})}
                          placeholder="Masukkan judul galeri"
                          required 
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="deskripsi" className="form-label">
                      <i className="fas fa-align-left me-1"></i>Deskripsi
                    </label>
                    <textarea 
                      id="deskripsi" 
                      className="form-control" 
                      rows="4"
                      value={formData.deskripsi}
                      onChange={(e) => setFormData({...formData, deskripsi: e.target.value})}
                      placeholder="Masukkan deskripsi galeri (opsional)"
                    ></textarea>
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="gambar" className="form-label">
                      <i className="fas fa-image me-1"></i>Gambar
                    </label>
                    <input 
                      type="file" 
                      id="gambar" 
                      className="form-control" 
                      accept="image/*"
                      onChange={(e) => setFormData({...formData, gambar: e.target.files[0]})}
                      required={!editingItem}
                    />
                    {editingItem && (
                      <div className="form-text">
                        <i className="fas fa-info-circle me-1"></i>
                        Pilih file baru jika ingin mengubah gambar
                      </div>
                    )}
                  </div>

                  {editingItem && editingItem.gambar && (
                    <div className="mb-3">
                      <label className="form-label">Gambar Saat Ini:</label>
                      <div className="text-center">
                        <img 
                          src={`/uploads/galeri/${editingItem.gambar}`} 
                          alt="Current" 
                          className="img-thumbnail" 
                          style={{maxHeight: '200px'}}
                        />
                      </div>
                    </div>
                  )}
                </div>
                <div className="modal-footer">
                  <button 
                    type="button" 
                    className="btn btn-secondary" 
                    onClick={() => setShowModal(false)}
                  >
                    <i className="fas fa-times me-1"></i>Batal
                  </button>
                  <button type="submit" className="btn btn-success">
                    <i className="fas fa-save me-1"></i>
                    {editingItem ? 'Update' : 'Simpan'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </AdminPusatLayout>
  )
}
