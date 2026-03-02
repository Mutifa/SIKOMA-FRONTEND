import React from 'react'
import SuperadminLayout from '../../layouts/SuperadminLayout.jsx'
import api from '../../lib/api.js'

export default function Konten() {
  const [data, setData] = React.useState([])
  const [error, setError] = React.useState('')
  const [loading, setLoading] = React.useState(true)
  const [showModal, setShowModal] = React.useState(false)
  const [editingItem, setEditingItem] = React.useState(null)
  const [formData, setFormData] = React.useState({
    judul: '',
    deskripsi: '',
    foto: null,
    kategori: 'Edukasi'
  })

  React.useEffect(() => {
    let mounted = true
    api.get('/api/superadmin/edukasi')
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
        await api.post(`/api/superadmin/edukasi/${editingItem.id}`, formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
      } else {
        await api.post('/api/superadmin/edukasi', formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
      }
      setShowModal(false)
      setEditingItem(null)
      setFormData({ judul: '', deskripsi: '', foto: null, kategori: 'Edukasi' })
      // Reload data
      const res = await api.get('/api/superadmin/edukasi')
      setData(res.data.data || res.data)
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal menyimpan konten')
    }
  }

  const handleEdit = (item) => {
    setEditingItem(item)
    
    // Map database kategori back to frontend values
    const kategoriReverseMapping = {
      'Satwa': 'Edukasi',
      'Executive': 'Informasi',
      'Program': 'Berita'
    }
    
    setFormData({
      judul: item.judul || '',
      deskripsi: item.deskripsi || '',
      foto: null,
      kategori: kategoriReverseMapping[item.kategori] || 'Edukasi'
    })
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus konten ini?')) {
      try {
        await api.delete(`/api/superadmin/edukasi/${id}`)
        setData(data.filter(item => item.id !== id))
      } catch (err) {
        setError(err.response?.data?.message || 'Gagal menghapus konten')
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

  if (loading) {
    return (
      <SuperadminLayout title="Konten Informasi & Edukasi">
        <div className="d-flex justify-content-center">
          <div className="spinner-border" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      </SuperadminLayout>
    )
  }

  return (
    <SuperadminLayout title="Konten Informasi & Edukasi">
      {error && <div className="alert alert-danger alert-dismissible fade show" role="alert">
        {error}
        <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>}
      
      <div className="row">
        <div className="col-12">
          <a 
            href="#tambahkonten" 
            type="button" 
            data-bs-toggle="modal" 
            className="btn btn-primary btn-sm float-end"
            onClick={() => {
              setEditingItem(null)
              setFormData({ judul: '', deskripsi: '', foto: null, kategori: 'Edukasi' })
              setShowModal(true)
            }}
          >
            + Konten
          </a>
          <div className="white-box">
            <div className="box-title mb-3">Konten Informasi & Edukasi</div>

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
                  {data.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center">Belum ada konten</td>
                    </tr>
                  ) : (
                    data.map((item, index) => (
                      <tr key={item.id} className="align-middle">
                        <td>{index + 1}.</td>
                        <td className="text-capitalize">
                          {item.foto ? (
                            <img 
                              src={`/uploads/edukasi/${item.foto}`}
                              alt="Foto Konten" 
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
                            &lt;Foto Konten&gt;
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
          </div>
        </div>
      </div>

      {/* Modal Tambah konten */}
      {showModal && (
        <div className="modal show d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
          <div className="modal-dialog modal-lg">
            <form onSubmit={handleSubmit}>
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    {editingItem ? 'Edit Konten' : 'Tambah Konten'}
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
                      <label className="form-label">Kategori</label>
                      <select
                        className="form-control"
                        value={formData.kategori}
                        onChange={(e) => setFormData({...formData, kategori: e.target.value})}
                        required
                      >
                        <option value="Edukasi">Edukasi</option>
                        <option value="Informasi">Informasi</option>
                        <option value="Berita">Berita</option>
                      </select>
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
                    <div className="col-12">
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
    </SuperadminLayout>
  )
}
