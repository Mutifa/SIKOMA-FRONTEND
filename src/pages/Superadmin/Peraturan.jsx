import React from 'react'
import SuperadminLayout from '../../layouts/SuperadminLayout.jsx'
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
    api.get('/api/superadmin/peraturan')
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
        // Laravel workaround: use POST with _method for file uploads
        formDataToSend.append('_method', 'PUT')
        await api.post(`/api/superadmin/peraturan/${editingItem.id}`, formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
      } else {
        await api.post('/api/superadmin/peraturan', formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
      }
      setShowModal(false)
      setEditingItem(null)
      setFormData({ nama: '', deskripsi: '', tahun: '', nomor: '', file: null })
      // Reload data
      const res = await api.get('/api/superadmin/peraturan')
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
        await api.delete(`/api/superadmin/peraturan/${id}`)
        setData(data.filter(item => item.id !== id))
      } catch (err) {
        setError(err.response?.data?.message || 'Gagal menghapus peraturan')
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

  if (loading) {
    return (
      <SuperadminLayout title="Peraturan">
        <div className="d-flex justify-content-center">
          <div className="spinner-border" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      </SuperadminLayout>
    )
  }

  return (
    <SuperadminLayout title="Peraturan">
      {error && <div className="alert alert-danger alert-dismissible fade show" role="alert">
        {error}
        <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>}
      
      <div className="row">
        <div className="col-12">
          <a 
            href="#tambahperaturan" 
            type="button" 
            data-bs-toggle="modal" 
            className="btn btn-primary btn-sm float-end"
            onClick={() => {
              setEditingItem(null)
              setFormData({ nama: '', deskripsi: '', tahun: '', nomor: '', file: null })
              setShowModal(true)
            }}
          >
            + Peraturan
          </a>
          <div className="white-box">
            <h3 className="box-title">Peraturan</h3>
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Nama</th>
                    <th>Deskripsi</th>
                    <th>Tahun - Nomor</th>
                    <th>File</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {data.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center">Belum ada peraturan</td>
                    </tr>
                  ) : (
                    data.map((item, index) => (
                      <tr key={item.id} className="align-middle">
                        <td>{index + 1}.</td>
                        <td>{item.nama}</td>
                        <td>{item.deskripsi}</td>
                        <td>{item.tahun} - {item.nomor}</td>
                        <td>
                          {item.file && (
                            <a 
                              href={`/uploads/peraturan/${item.file}`} 
                              target="_blank" 
                              rel="noopener noreferrer"
                            >
                              Lihat File
                            </a>
                          )}
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
          </div>
        </div>
      </div>

      {/* Modal Tambah peraturan */}
      {showModal && (
        <div className="modal show d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
          <div className="modal-dialog">
            <form onSubmit={handleSubmit}>
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
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
                    <label className="form-label">Nama</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.nama}
                      onChange={(e) => setFormData({...formData, nama: e.target.value})}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Deskripsi</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.deskripsi}
                      onChange={(e) => setFormData({...formData, deskripsi: e.target.value})}
                    />
                  </div>

                  <div className="row">
                    <div className="col-6">
                      <div className="mb-3">
                        <label className="form-label">Tahun</label>
                        <input
                          type="number"
                          className="form-control"
                          value={formData.tahun}
                          onChange={(e) => setFormData({...formData, tahun: e.target.value})}
                        />
                      </div>
                    </div>

                    <div className="col-6">
                      <div className="mb-3">
                        <label className="form-label">Nomor</label>
                        <input
                          type="text"
                          className="form-control"
                          value={formData.nomor}
                          onChange={(e) => setFormData({...formData, nomor: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">File</label>
                    <input
                      type="file"
                      className="form-control"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => setFormData({...formData, file: e.target.files[0]})}
                    />
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
                    {editingItem ? 'Update' : 'Simpan'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </SuperadminLayout>
  )
}
