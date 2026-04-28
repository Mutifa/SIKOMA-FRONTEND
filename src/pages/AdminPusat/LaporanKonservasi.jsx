import React from 'react'
import AdminPusatLayout from '../../layouts/AdminPusatLayout.jsx'
import api from '../../lib/api.js'
import { ENDPOINTS } from '../../lib/endpoints.js'


export default function LaporanKonservasi() {
  const [data, setData] = React.useState([])
  const [error, setError] = React.useState('')
  const [loading, setLoading] = React.useState(true)
  const [showModal, setShowModal] = React.useState(false)
  const [editingItem, setEditingItem] = React.useState(null)
  const [formData, setFormData] = React.useState({
    namaLaporan: '',
    daerahLokasi: '',
    tanggalLaporan: '',
    deskripsi: '',
    status: 'pending',
    file: null
  })

  React.useEffect(() => {
    let mounted = true
    api.get(ENDPOINTS.LAPORAN_ADMIN.GET)
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
    formDataToSend.append('namaLaporan', formData.namaLaporan)
    formDataToSend.append('daerahLokasi', formData.daerahLokasi)
    formDataToSend.append('tanggalLaporan', formData.tanggalLaporan)
    formDataToSend.append('deskripsi', formData.deskripsi)
    formDataToSend.append('status', formData.status)
    if (formData.file) {
      formDataToSend.append('file', formData.file)
    }

    try {
      if (editingItem) {
await api.put(ENDPOINTS.LAPORAN_ADMIN.UPDATE(editingItem.id), formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
      } else {
        await api.post(ENDPOINTS.LAPORAN_ADMIN.CREATE, formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
      }
      setShowModal(false)
      setEditingItem(null)
      setFormData({ 
        namaLaporan: '', 
        daerahLokasi: '', 
        tanggalLaporan: '', 
        deskripsi: '', 
        status: 'pending', 
        file: null 
      })
      // Reload data
      const res = await api.get(ENDPOINTS.LAPORAN_ADMIN.GET)
      setData(res.data.data || res.data)
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal menyimpan laporan')
    }
  }

  const handleEdit = (item) => {
    setEditingItem(item)
    setFormData({
      namaLaporan: item.namaLaporan || '',
      daerahLokasi: item.daerahLokasi || '',
      tanggalLaporan: item.tanggalLaporan || '',
      deskripsi: item.deskripsi || '',
      status: item.status || 'pending',
      file: null
    })
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus laporan ini?')) {
      try {
        await api.delete(ENDPOINTS.LAPORAN_ADMIN.DELETE(id))
        setData(data.filter(item => item.id !== id))
      } catch (err) {
        setError(err.response?.data?.message || 'Gagal menghapus laporan')
      }
    }
  }

  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.put(ENDPOINTS.LAPORAN_ADMIN.UPDATE_STATUS(id), { status: newStatus })
      setData(data.map(item => 
        item.id === id ? { ...item, status: newStatus } : item
      ))
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal mengubah status')
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()
    return `${day}-${month}-${year}`
  }

  const getStatusBadge = (status) => {
    const badges = {
      'pending': 'warning',
      'approved': 'success',
      'rejected': 'danger'
    }
    return badges[status] || 'secondary'
  }

  const getStatusText = (status) => {
    const texts = {
      'pending': 'Menunggu',
      'approved': 'Disetujui',
      'rejected': 'Ditolak'
    }
    return texts[status] || status
  }

  const stripHtmlTags = (html) => {
    if (!html) return ''
    return html.replace(/<[^>]*>/g, '')
  }

  if (loading) {
    return (
      <AdminPusatLayout title="Laporan Konservasi">
        <div className="d-flex justify-content-center">
          <div className="spinner-border" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      </AdminPusatLayout>
    )
  }

  return (
    <AdminPusatLayout title="Laporan Konservasi">
      {error && <div className="alert alert-danger alert-dismissible fade show" role="alert">
        {error}
        <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>}
      
      <div className="row">
        <div className="col-12">
          <a 
            href="#tambahlaporan" 
            type="button" 
            data-bs-toggle="modal" 
            className="btn btn-primary btn-sm float-end"
            onClick={() => {
              setEditingItem(null)
              setFormData({ 
                namaLaporan: '', 
                daerahLokasi: '', 
                tanggalLaporan: '', 
                deskripsi: '', 
                status: 'pending', 
                file: null 
              })
              setShowModal(true)
            }}
          >
            + Laporan
          </a>
          <div className="white-box">
            <div className="box-title mb-3">Laporan Konservasi</div>
        
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Nama Laporan</th>
                    <th>Daerah Lokasi</th>
                    <th>Tanggal Laporan</th>
                    <th>Status</th>
                    <th>File</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {data.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="text-center">Belum ada laporan</td>
                    </tr>
                  ) : (
                    data.map((item, index) => (
                      <tr key={item.id} className="align-middle">
                        <td>{index + 1}.</td>
                        <td>{item.namaLaporan}</td>
                        <td>{item.daerahLokasi}</td>
                        <td>{formatDate(item.tanggalLaporan)}</td>
                        <td>
                          <span className={`badge bg-${getStatusBadge(item.status)}`}>
                            {getStatusText(item.status)}
                          </span>
                        </td>
                        <td>
                          {item.file && (
                            <a 
                              href={`https://codemy.my.id/uploads/laporan/${item.file}`} 
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

      {/* Modal Form */}
      {showModal && (
        <div className="modal show d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editingItem ? 'Edit Laporan' : 'Tambah Laporan'}
                </h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group mb-3">
                        <label className="form-label">Nama Laporan *</label>
                        <input
                          type="text"
                          className="form-control"
                          value={formData.namaLaporan}
                          onChange={(e) => setFormData({...formData, namaLaporan: e.target.value})}
                          required
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group mb-3">
                        <label className="form-label">Daerah Lokasi *</label>
                        <input
                          type="text"
                          className="form-control"
                          value={formData.daerahLokasi}
                          onChange={(e) => setFormData({...formData, daerahLokasi: e.target.value})}
                          required
                        />
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group mb-3">
                        <label className="form-label">Tanggal Laporan *</label>
                        <input
                          type="date"
                          className="form-control"
                          value={formData.tanggalLaporan}
                          onChange={(e) => setFormData({...formData, tanggalLaporan: e.target.value})}
                          required
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group mb-3">
                        <label className="form-label">Status *</label>
                        <select
                          className="form-control"
                          value={formData.status}
                          onChange={(e) => setFormData({...formData, status: e.target.value})}
                          required
                        >
                          <option value="pending">Menunggu</option>
                          <option value="approved">Disetujui</option>
                          <option value="rejected">Ditolak</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="form-group mb-3">
                    <label className="form-label">Deskripsi</label>
                    <textarea
                      className="form-control"
                      value={formData.deskripsi}
                      onChange={(e) => setFormData({...formData, deskripsi: e.target.value})}
                      rows="4"
                    />
                  </div>
                  <div className="form-group mb-3">
                    <label className="form-label">
                      File {editingItem ? '(kosongkan jika tidak diubah)' : '*'}
                    </label>
                    <input
                      type="file"
                      className="form-control"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => setFormData({...formData, file: e.target.files[0]})}
                      required={!editingItem}
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
              </form>
            </div>
          </div>
        </div>
      )}
    </AdminPusatLayout>
  )
}
