import React from 'react'
import AdminPusatLayout from '../../layouts/AdminPusatLayout.jsx'
import api from '../../lib/api.js'

export default function StandarPelayanan() {
  const [data, setData] = React.useState([])
  const [error, setError] = React.useState('')
  const [success, setSuccess] = React.useState('')
  const [loading, setLoading] = React.useState(true)
  const [saving, setSaving] = React.useState(false)
  const [showModal, setShowModal] = React.useState(false)
  const [showViewModal, setShowViewModal] = React.useState(false)
  const [editingItem, setEditingItem] = React.useState(null)
  const [selectedItem, setSelectedItem] = React.useState(null)
  const [formData, setFormData] = React.useState({
    judul: '',
    deskripsi: '',
    kategori: 'Standar Pelayanan'
  })
  const [formErrors, setFormErrors] = React.useState({})

  React.useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const res = await api.get('/api/AdminPusat/standar-pelayanan')
      setData(res.data.data || res.data)
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal memuat data standar pelayanan')
    } finally {
      setLoading(false)
    }
  }

  const validateForm = () => {
    const errors = {}
    if (!formData.judul.trim()) {
      errors.judul = 'Judul wajib diisi'
    }
    if (!formData.deskripsi.trim()) {
      errors.deskripsi = 'Deskripsi wajib diisi'
    }
    if (!formData.kategori.trim()) {
      errors.kategori = 'Kategori wajib diisi'
    }
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setSaving(true)
    setError('')
    setSuccess('')

    const formDataToSend = new FormData()
    formDataToSend.append('judul', formData.judul.trim())
    formDataToSend.append('deskripsi', formData.deskripsi.trim())
    formDataToSend.append('kategori', formData.kategori.trim())

    try {
      if (editingItem) {
        // Laravel workaround: use POST with _method for consistency
        formDataToSend.append('_method', 'PUT')
        await api.post(`/api/AdminPusat/standar-pelayanan/${editingItem.id}`, formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        setSuccess('Standar pelayanan berhasil diperbarui')
      } else {
        await api.post('/api/AdminPusat/standar-pelayanan', formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        setSuccess('Standar pelayanan berhasil ditambahkan')
      }
      
      setShowModal(false)
      resetForm()
      await loadData()
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Gagal menyimpan standar pelayanan'
      setError(errorMessage)
      
      // Handle validation errors from Laravel
      if (err.response?.data?.errors) {
        setFormErrors(err.response.data.errors)
      }
    } finally {
      setSaving(false)
    }
  }

  const resetForm = () => {
    setEditingItem(null)
    setFormData({ judul: '', deskripsi: '', kategori: 'Standar Pelayanan' })
    setFormErrors({})
  }

  const handleEdit = (item) => {
    setEditingItem(item)
    setFormData({
      judul: item.judul || '',
      deskripsi: item.deskripsi || '',
      kategori: item.kategori || 'Standar Pelayanan'
    })
    setFormErrors({})
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus standar pelayanan ini?')) {
      try {
        await api.delete(`/api/AdminPusat/standar-pelayanan/${id}`)
        setSuccess('Standar pelayanan berhasil dihapus')
        await loadData()
      } catch (err) {
        setError(err.response?.data?.message || 'Gagal menghapus standar pelayanan')
      }
    }
  }

  const handleView = (item) => {
    setSelectedItem(item)
    setShowViewModal(true)
  }

  const handleAddNew = () => {
    resetForm()
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    resetForm()
  }

  const formatDate = (dateString) => {
    if (!dateString) return '-'
    const date = new Date(dateString)
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()
    return `${day}-${month}-${year}`
  }

  const truncateText = (text, maxLength = 100) => {
    if (!text) return '-'
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
  }

  if (loading) {
    return (
      <AdminPusatLayout title="Standar Pelayanan">
        <div className="d-flex justify-content-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </AdminPusatLayout>
    )
  }

  return (
    <AdminPusatLayout title="Standar Pelayanan">
      {/* Alert Messages */}
      {error && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          <i className="fas fa-exclamation-triangle me-2"></i>
          {error}
          <button 
            type="button" 
            className="btn-close" 
            onClick={() => setError('')}
            aria-label="Close"
          ></button>
        </div>
      )}
      
      {success && (
        <div className="alert alert-success alert-dismissible fade show" role="alert">
          <i className="fas fa-check-circle me-2"></i>
          {success}
          <button 
            type="button" 
            className="btn-close" 
            onClick={() => setSuccess('')}
            aria-label="Close"
          ></button>
        </div>
      )}
      
      <div className="row">
        <div className="col-12">
          <div className="mb-3">
            <h4 className="mb-0">Manajemen Standar Pelayanan</h4>
          </div>
          
          <div className="white-box">
            <h3 className="box-title">Daftar Standar Pelayanan</h3>
            <div className="table-responsive">
              <table className="table table-hover text-nowrap">
                <thead className="table-light">
                  <tr>
                    <th width="5%">No</th>
                    <th width="25%">Judul</th>
                    <th width="40%">Deskripsi</th>
                    <th width="15%">Kategori</th>
                    <th width="10%">Tanggal</th>
                    <th width="15%">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {data.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center py-4">
                        <div className="text-muted">
                          <i className="fas fa-inbox fa-2x mb-3"></i>
                          <p className="mb-0">Belum ada data standar pelayanan</p>
                          <small>Klik tombol "Tambah Standar Pelayanan" untuk menambah data baru</small>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    data.map((item, index) => (
                      <tr key={item.id} className="align-middle">
                        <td>
                          <span className="fw-bold text-primary">{index + 1}</span>
                        </td>
                        <td>
                          <div className="fw-semibold text-dark">{item.judul}</div>
                        </td>
                        <td>
                          <div className="text-muted small">
                            {truncateText(item.deskripsi, 120)}
                          </div>
                        </td>
                        <td>
                          <span className="badge bg-primary rounded-pill">
                            {item.kategori}
                          </span>
                        </td>
                        <td>
                          <small className="text-muted">
                            {formatDate(item.created_at)}
                          </small>
                        </td>
                        <td>
                          <div className="btn-group" role="group">
                            <button 
                              className="btn btn-outline-info btn-sm"
                              onClick={() => handleView(item)}
                              title="Lihat Detail"
                            >
                              <i className="fas fa-eye"></i>
                            </button>
                            <button 
                              className="btn btn-outline-warning btn-sm"
                              onClick={() => handleEdit(item)}
                              title="Edit"
                              disabled={saving}
                            >
                              <i className="fas fa-edit"></i>
                            </button>
                            <button 
                              className="btn btn-outline-danger btn-sm"
                              onClick={() => handleDelete(item.id)}
                              title="Hapus"
                              disabled={saving}
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
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="modal show d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">
                  <i className={`fas ${editingItem ? 'fa-edit' : 'fa-plus'} me-2`}></i>
                  {editingItem ? 'Edit Standar Pelayanan' : 'Tambah Standar Pelayanan'}
                </h5>
                <button 
                  type="button" 
                  className="btn-close btn-close-white" 
                  onClick={handleCloseModal}
                  disabled={saving}
                ></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      Judul <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className={`form-control ${formErrors.judul ? 'is-invalid' : ''}`}
                      value={formData.judul}
                      onChange={(e) => {
                        setFormData({...formData, judul: e.target.value})
                        if (formErrors.judul) {
                          setFormErrors({...formErrors, judul: ''})
                        }
                      }}
                      placeholder="Masukkan judul standar pelayanan"
                      disabled={saving}
                    />
                    {formErrors.judul && (
                      <div className="invalid-feedback">{formErrors.judul}</div>
                    )}
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      Deskripsi <span className="text-danger">*</span>
                    </label>
                    <textarea
                      className={`form-control ${formErrors.deskripsi ? 'is-invalid' : ''}`}
                      value={formData.deskripsi}
                      onChange={(e) => {
                        setFormData({...formData, deskripsi: e.target.value})
                        if (formErrors.deskripsi) {
                          setFormErrors({...formErrors, deskripsi: ''})
                        }
                      }}
                      rows="5"
                      placeholder="Masukkan deskripsi standar pelayanan"
                      disabled={saving}
                    />
                    {formErrors.deskripsi && (
                      <div className="invalid-feedback">{formErrors.deskripsi}</div>
                    )}
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      Kategori <span className="text-danger">*</span>
                    </label>
                    <select
                      className={`form-select ${formErrors.kategori ? 'is-invalid' : ''}`}
                      value={formData.kategori}
                      onChange={(e) => {
                        setFormData({...formData, kategori: e.target.value})
                        if (formErrors.kategori) {
                          setFormErrors({...formErrors, kategori: ''})
                        }
                      }}
                      disabled={saving}
                    >
                      <option value="Standar Pelayanan">Standar Pelayanan</option>
                      <option value="Standar Operasional">Standar Operasional</option>
                      <option value="Standar Kualitas">Standar Kualitas</option>
                      <option value="Standar Waktu">Standar Waktu</option>
                    </select>
                    {formErrors.kategori && (
                      <div className="invalid-feedback">{formErrors.kategori}</div>
                    )}
                  </div>
                </div>
                <div className="modal-footer">
                  <button 
                    type="button" 
                    className="btn btn-secondary" 
                    onClick={handleCloseModal}
                    disabled={saving}
                  >
                    <i className="fas fa-times me-2"></i>
                    Batal
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={saving}
                  >
                    {saving ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Menyimpan...
                      </>
                    ) : (
                      <>
                        <i className={`fas ${editingItem ? 'fa-save' : 'fa-plus'} me-2`}></i>
                        {editingItem ? 'Update' : 'Simpan'}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {showViewModal && selectedItem && (
        <div className="modal show d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header bg-info text-white">
                <h5 className="modal-title">
                  <i className="fas fa-eye me-2"></i>
                  Detail Standar Pelayanan
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
                    <label className="form-label fw-semibold text-muted">Judul</label>
                    <p className="form-control-plaintext border-bottom">{selectedItem.judul}</p>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold text-muted">Kategori</label>
                    <p className="form-control-plaintext border-bottom">
                      <span className="badge bg-primary rounded-pill">{selectedItem.kategori}</span>
                    </p>
                  </div>
                  <div className="col-12 mb-3">
                    <label className="form-label fw-semibold text-muted">Deskripsi</label>
                    <div className="border rounded p-3 bg-light">
                      <p className="mb-0" style={{whiteSpace: 'pre-wrap'}}>{selectedItem.deskripsi}</p>
                    </div>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold text-muted">Tanggal Dibuat</label>
                    <p className="form-control-plaintext border-bottom">{formatDate(selectedItem.created_at)}</p>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold text-muted">Terakhir Diupdate</label>
                    <p className="form-control-plaintext border-bottom">{formatDate(selectedItem.updated_at)}</p>
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
                <button 
                  type="button" 
                  className="btn btn-warning" 
                  onClick={() => {
                    setShowViewModal(false)
                    handleEdit(selectedItem)
                  }}
                >
                  <i className="fas fa-edit me-2"></i>
                  Edit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminPusatLayout>
  )
}
