import React from 'react'
import AdminPusatLayout from '../../layouts/AdminPusatLayout.jsx'
import api from '../../lib/api.js'

export default function Peraturan() {
  const [data, setData] = React.useState([])
  const [error, setError] = React.useState('')
  const [loading, setLoading] = React.useState(true)
  const [showModal, setShowModal] = React.useState(false)
  const [editingItem, setEditingItem] = React.useState(null)
  const [formData, setFormData] = React.useState({
    nama: '',
    deskripsi: '',
    tahun: '',
    nomor: '',
    file: null
  })

  React.useEffect(() => {
    let mounted = true
    api.get('/admin_pusat/peraturan')
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    const formDataToSend = new FormData()
    formDataToSend.append('nama', formData.nama)
    formDataToSend.append('deskripsi', formData.deskripsi)
    formDataToSend.append('tahun', formData.tahun)
    formDataToSend.append('nomor', formData.nomor)
    if (formData.file) {
      formDataToSend.append('file', formData.file)
    }

    try {
      if (editingItem) {
        formDataToSend.append('_method', 'PUT')
        await api.post(`/admin_pusat/peraturan/${editingItem.id}`, formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
      } else {
        await api.post('/admin_pusat/peraturan', formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
      }
      setShowModal(false)
      setEditingItem(null)
      setFormData({ nama: '', deskripsi: '', tahun: '', nomor: '', file: null })
      const res = await api.get('/admin_pusat/peraturan')
      setData(res.data.data || res.data)
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal menyimpan peraturan')
    }
  }

  const handleEdit = (item) => {
    setEditingItem(item)
    setFormData({
      nama: item.nama || '',
      deskripsi: item.deskripsi || '',
      tahun: item.tahun || '',
      nomor: item.nomor || '',
      file: null
    })
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus peraturan ini?')) {
      try {
        await api.delete(`/admin_pusat/peraturan/${id}`)
        setData(data.filter(item => item.id !== id))
      } catch (err) {
        setError(err.response?.data?.message || 'Gagal menghapus peraturan')
      }
    }
  }

  if (loading) {
    return (
      <AdminPusatLayout title="Peraturan">
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </AdminPusatLayout>
    )
  }

  return (
    <AdminPusatLayout title="Peraturan">
      {error && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          <i className="fas fa-exclamation-circle me-2"></i>
          {error}
          <button
            type="button"
            className="btn-close"
            onClick={() => setError('')}
            aria-label="Close"
          ></button>
        </div>
      )}

      <div className="row">
        <div className="col-12">

          {/* Header Section */}
          <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-2 mb-3">
            <div>
                        <div className="box-title">Manajemen halaman peraturan</div>
            </div>
            <button
              type="button"
              className="btn btn-primary btn-sm d-flex align-items-center gap-1"
              onClick={() => {
                setEditingItem(null)
                setFormData({ nama: '', deskripsi: '', tahun: '', nomor: '', file: null })
                setShowModal(true)
              }}
            >
              <i className="fas fa-plus"></i>
              <span>Tambah Peraturan</span>
            </button>
          </div>

          {/* Table / Card Section */}
          <div className="white-box p-0 overflow-hidden">

            {/* Desktop Table — hidden on mobile */}
            <div className="d-none d-md-block table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th className="ps-3" style={{ width: '50px' }}>No</th>
                    <th>Nama</th>
                    <th>Deskripsi</th>
                    <th style={{ width: '150px' }}>Tahun / Nomor</th>
                    <th style={{ width: '100px' }}>File</th>
                    <th className="text-center pe-3" style={{ width: '100px' }}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {data.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center py-5 text-muted">
                        <i className="fas fa-folder-open fa-2x mb-2 d-block"></i>
                        Belum ada peraturan
                      </td>
                    </tr>
                  ) : (
                    data.map((item, index) => (
                      <tr key={item.id} className="align-middle">
                        <td className="ps-3 text-muted">{index + 1}</td>
                        <td className="fw-medium">{item.nama}</td>
                        <td className="text-muted" style={{ maxWidth: '220px' }}>
                          <span className="d-block text-truncate" title={item.deskripsi}>
                            {item.deskripsi || '-'}
                          </span>
                        </td>
                        <td>
                          {item.tahun || item.nomor ? (
                            <span className="badge bg-light text-dark border">
                              {item.tahun} {item.tahun && item.nomor ? '/' : ''} {item.nomor}
                            </span>
                          ) : '-'}
                        </td>
                        <td>
                          {item.file ? (
                            <a
                              href={`https://codemy.my.id/uploads/peraturan/${item.file}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn btn-outline-info btn-sm"
                            >
                              <i className="fas fa-file-alt me-1"></i>Lihat
                            </a>
                          ) : (
                            <span className="text-muted small">-</span>
                          )}
                        </td>
                        <td className="text-center pe-3">
                          <button
                            className="btn btn-warning btn-sm me-1"
                            title="Edit"
                            onClick={() => handleEdit(item)}
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                          <button
                            className="btn btn-danger btn-sm text-white"
                            title="Hapus"
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

            {/* Mobile Card List — visible only on mobile */}
            <div className="d-md-none">
              {data.length === 0 ? (
                <div className="text-center py-5 text-muted">
                  <i className="fas fa-folder-open fa-2x mb-2 d-block"></i>
                  Belum ada peraturan
                </div>
              ) : (
                data.map((item, index) => (
                  <div key={item.id} className="border-bottom p-3">
                    <div className="d-flex justify-content-between align-items-start gap-2">
                      <div className="flex-grow-1 min-width-0">
                        <div className="d-flex align-items-center gap-2 mb-1">
                          <span className="badge bg-secondary" style={{ fontSize: '11px' }}>{index + 1}</span>
                          <span className="fw-semibold text-truncate">{item.nama}</span>
                        </div>
                        {item.deskripsi && (
                          <p className="text-muted small mb-1" style={{ lineHeight: '1.4' }}>{item.deskripsi}</p>
                        )}
                        <div className="d-flex flex-wrap gap-2 mt-2 align-items-center">
                          {(item.tahun || item.nomor) && (
                            <span className="badge bg-light text-dark border" style={{ fontSize: '11px' }}>
                              <i className="fas fa-calendar-alt me-1"></i>
                              {item.tahun}{item.tahun && item.nomor ? ' / ' : ''}{item.nomor}
                            </span>
                          )}
                          {item.file && (
                            <a
                              href={`https://codemy.my.id/uploads/peraturan/${item.file}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="badge bg-info text-white text-decoration-none"
                              style={{ fontSize: '11px' }}
                            >
                              <i className="fas fa-file-alt me-1"></i>Lihat File
                            </a>
                          )}
                        </div>
                      </div>
                      <div className="d-flex flex-column gap-1" style={{ flexShrink: 0 }}>
                        <button
                          className="btn btn-warning btn-sm"
                          title="Edit"
                          onClick={() => handleEdit(item)}
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button
                          className="btn btn-danger btn-sm text-white"
                          title="Hapus"
                          onClick={() => handleDelete(item.id)}
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

          </div>
          {/* End white-box */}

        </div>
      </div>

      {/* Modal Tambah / Edit Peraturan */}
      {showModal && (
        <>
          <div className="modal fade show d-block" tabIndex="-1" style={{ overflowY: 'auto' }}>
            <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
              <form onSubmit={handleSubmit}>
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">
                      <i className={`fas ${editingItem ? 'fa-edit' : 'fa-plus-circle'} me-2`}></i>
                      {editingItem ? 'Edit Peraturan' : 'Tambah Peraturan'}
                    </h5>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => setShowModal(false)}
                    ></button>
                  </div>

                  <div className="modal-body">
                    <div className="mb-3">
                      <label className="form-label fw-medium">Nama <span className="text-danger">*</span></label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Masukkan nama peraturan"
                        value={formData.nama}
                        onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label fw-medium">Deskripsi</label>
                      <textarea
                        className="form-control"
                        rows="3"
                        placeholder="Masukkan deskripsi peraturan (opsional)"
                        value={formData.deskripsi}
                        onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                      />
                    </div>

                    <div className="row g-3 mb-3">
                      <div className="col-6">
                        <label className="form-label fw-medium">Tahun</label>
                        <input
                          type="number"
                          className="form-control"
                          placeholder="Cth: 2024"
                          value={formData.tahun}
                          onChange={(e) => setFormData({ ...formData, tahun: e.target.value })}
                        />
                      </div>
                      <div className="col-6">
                        <label className="form-label fw-medium">Nomor</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Cth: 001/SK"
                          value={formData.nomor}
                          onChange={(e) => setFormData({ ...formData, nomor: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label fw-medium">File</label>
                      <input
                        type="file"
                        className="form-control"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => setFormData({ ...formData, file: e.target.files[0] })}
                      />
                      <div className="form-text">Format: PDF, DOC, DOCX</div>
                      {editingItem && (
                        <div className="form-text text-warning">
                          <i className="fas fa-info-circle me-1"></i>
                          Kosongkan jika tidak ingin mengganti file.
                        </div>
                      )}
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
                    <button type="submit" className="btn btn-primary">
                      <i className={`fas ${editingItem ? 'fa-save' : 'fa-plus'} me-1`}></i>
                      {editingItem ? 'Update' : 'Simpan'}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </>
      )}
    </AdminPusatLayout>
  )
}