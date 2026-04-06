import React from 'react'
import AdminPusatLayout from '../../layouts/AdminPusatLayout.jsx'
import api from '../../lib/api.js'

export default function Customer() {
  const [data, setData] = React.useState([])
  const [error, setError] = React.useState('')
  const [loading, setLoading] = React.useState(true)
  const [showModal, setShowModal] = React.useState(false)
  const [selectedItem, setSelectedItem] = React.useState(null)

  React.useEffect(() => {
    let mounted = true
    api.get('/api/AdminPusat/customer')
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

  const handleDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus customer ini?')) {
      try {
        await api.delete(`/api/AdminPusat/customer/${id}`)
        setData(data.filter(item => item.id !== id))
      } catch (err) {
        setError(err.response?.data?.message || 'Gagal menghapus customer')
      }
    }
  }

  const handleView = (item) => {
    setSelectedItem(item)
    setShowModal(true)
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
      <AdminPusatLayout title="Customer">
        <div className="d-flex justify-content-center">
          <div className="spinner-border" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      </AdminPusatLayout>
    )
  }

  return (
    <AdminPusatLayout title="Customer">
      {error && <div className="alert alert-danger alert-dismissible fade show" role="alert">
        {error}
        <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>}
      
      <div className="row">
        <div className="col-12">
          <div className="white-box">
            <h3 className="box-title">Data Customer</h3>
            <div className="table-responsive">
              <table className="table text-nowrap">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Nama</th>
                    <th>Email</th>
                    <th>No. HP</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {data.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center">Belum ada customer</td>
                    </tr>
                  ) : (
                    data.map((item, index) => (
                      <tr key={item.id} className="align-middle">
                        <td>{index + 1}.</td>
                        <td>{item.nama || 'N/A'}</td>
                        <td>{item.email || 'N/A'}</td>
                        <td>{item.nohp || 'N/A'}</td>
                        <td>
                          <button 
                            className="btn btn-primary btn-sm"
                            onClick={() => handleView(item)}
                          >
                            <i className="fas fa-eye"></i>
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

      {/* Modal Detail Customer */}
      {showModal && selectedItem && (
        <div className="modal show d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Detail Customer</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Judul</label>
                  <input
                    className="form-control"
                    value={selectedItem.negara || 'N/A'}
                    readOnly
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Pesan</label>
                  <textarea
                    className="form-control"
                    value={selectedItem.pesan || 'N/A'}
                    rows="4"
                    readOnly
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setShowModal(false)}
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminPusatLayout>
  )
}
