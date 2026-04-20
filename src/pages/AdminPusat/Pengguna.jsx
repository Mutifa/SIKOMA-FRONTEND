import React from 'react'
import AdminPusatLayout from '../../layouts/AdminPusatLayout.jsx'
import api from '../../lib/api.js'
import { ENDPOINTS } from '../../lib/endpoints'

export default function Pengguna() {
  const [data, setData] = React.useState([])
  const [error, setError] = React.useState('')
  const [loading, setLoading] = React.useState(true)
  const [showModal, setShowModal] = React.useState(false)
  const [editingUser, setEditingUser] = React.useState(null)
  const [formData, setFormData] = React.useState({
    name: '',
    username: '',
    email: '',
    nohp: '',
    password: '',
    role: 'AdminLapangan'
  })

  React.useEffect(() => {
    let mounted = true
    api.get('/admin_pusat/pengguna')
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

  const handleEdit = (user) => {
    setEditingUser(user)
    setFormData({
      name: user.name || '',
      username: user.username || '',
      email: user.email || '',
      nohp: user.nohp || '',
      password: '',
      role: user.role || 'AdminLapangan'
    })
    setShowModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingUser) {
        // Update user
        await api.put(`/admin_pusat/pengguna/${editingUser.id}`, formData)
        setData(data.map(user => user.id === editingUser.id ? {...user, ...formData} : user))
      } else {
        // Create user
        const response = await api.post('/admin_pusat/pengguna', formData)
        setData([response.data, ...data])
      }
      setShowModal(false)
      setEditingUser(null)
      setFormData({
        name: '',
        username: '',
        email: '',
        nohp: '',
        password: '',
        role: 'AdminLapangan'
      })
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal menyimpan data')
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus pengguna ini?')) {
      try {
        await api.delete(`/admin_pusat/pengguna/${id}`)
        setData(data.filter(user => user.id !== id))
      } catch (err) {
        setError(err.response?.data?.message || 'Gagal menghapus data')
      }
    }
  }

  if (loading) {
    return (
      <AdminPusatLayout title="Pengguna">
        <div className="d-flex justify-content-center">
          <div className="spinner-border" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      </AdminPusatLayout>
    )
  }

  return (
    <AdminPusatLayout title="Pengguna">
      {error && <div className="alert alert-danger">{error}</div>}
      
      <div className="row">
        <div className="col-12">
          <button 
            className="btn btn-primary btn-sm float-end mb-3"
            onClick={() => {
              setEditingUser(null)
              setFormData({
                name: '',
                username: '',
                email: '',
                nohp: '',
                password: '',
                role: 'AdminLapangan'
              })
              setShowModal(true)
            }}
          >
            + Tambah Pengguna
          </button>
        </div>
      </div>
      
      <div className="white-box">
        <h3 className="box-title">Daftar Pengguna</h3>
        
        {data.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-muted">Belum ada pengguna</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table text-nowrap">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Nama</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>No. HP</th>
                  <th>Role</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {data.map((user, index) => (
                  <tr key={user.id} className="align-middle">
                    <td>{index + 1}.</td>
                    <td>{user.name || 'N/A'}</td>
                    <td>{user.username || 'N/A'}</td>
                    <td>{user.email || 'N/A'}</td>
                    <td>{user.nohp || 'N/A'}</td>
                    <td>
                      <span className={`badge ${user.role === 'AdminPusat' ? 'bg-danger' : 'bg-primary'}`}>
                        {user.role || 'AdminLapangan'}
                      </span>
                    </td>
                    <td>
                      <button 
                        className="btn btn-warning btn-sm me-1"
                        onClick={() => handleEdit(user)}
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button 
                        className="btn btn-danger btn-sm text-white"
                        onClick={() => handleDelete(user.id)}
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Form */}
      {showModal && (
        <div className="modal show d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editingUser ? 'Edit Pengguna' : 'Tambah Pengguna'}
                </h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="form-group mb-3">
                    <label htmlFor="name">Nama</label>
                    <input 
                      type="text" 
                      id="name" 
                      className="form-control" 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required 
                    />
                  </div>
                  <div className="form-group mb-3">
                    <label htmlFor="username">Username</label>
                    <input 
                      type="text" 
                      id="username" 
                      className="form-control" 
                      value={formData.username}
                      onChange={(e) => setFormData({...formData, username: e.target.value})}
                      required 
                    />
                  </div>
                  <div className="form-group mb-3">
                    <label htmlFor="email">Email</label>
                    <input 
                      type="email" 
                      id="email" 
                      className="form-control" 
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      required 
                    />
                  </div>
                  <div className="form-group mb-3">
                    <label htmlFor="nohp">No. HP</label>
                    <input 
                      type="text" 
                      id="nohp" 
                      className="form-control" 
                      value={formData.nohp}
                      onChange={(e) => setFormData({...formData, nohp: e.target.value})}
                    />
                  </div>
                  <div className="form-group mb-3">
                    <label htmlFor="password">Password</label>
                    <input 
                      type="password" 
                      id="password" 
                      className="form-control" 
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      required={!editingUser}
                    />
                    {editingUser && (
                      <small className="text-muted">Kosongkan jika tidak ingin mengubah password</small>
                    )}
                  </div>
                  <div className="form-group mb-3">
                    <label htmlFor="role">Role</label>
                    <select 
                      id="role" 
                      className="form-control" 
                      value={formData.role}
                      onChange={(e) => setFormData({...formData, role: e.target.value})}
                    >
                      <option value="AdminLapangan">AdminLapangan</option>
                      <option value="AdminPusat">Admin Pusat</option>
                    </select>
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
                    {editingUser ? 'Update' : 'Simpan'}
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
