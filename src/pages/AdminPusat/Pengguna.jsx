import React from 'react'
import AdminPusatLayout from '../../layouts/AdminPusatLayout.jsx'
import api from '../../lib/api.js'

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
    password: '',
    role: 'admin_lapangan'
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

  const getRoleBadge = (role) => {
    const map = {
      admin_pusat:    { label: 'Admin Pusat',    color: 'primary' },
      AdminPusat:     { label: 'Admin Pusat',    color: 'primary' },
      super_admin:    { label: 'Super Admin',    color: 'danger'  },
      admin_lapangan: { label: 'Admin Lapangan', color: 'success' },
      AdminLapangan:  { label: 'Admin Lapangan', color: 'success' },
    }
    const r = map[role] || { label: role, color: 'secondary' }
    return <span className={`badge bg-${r.color}`}>{r.label}</span>
  }

  const handleEdit = (user) => {
    setEditingUser(user)
    setFormData({
      name: user.name || '',
      username: user.username || '',
      email: user.email || '',
      password: '',
      role: user.role || 'admin_lapangan'
    })
    setShowModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingUser) {
        const payload = {
          name: formData.name,
          username: formData.username,
          email: formData.email,
          role: formData.role
        }
        if (formData.password && formData.password.length >= 8) {
          payload.password = formData.password
        }
        await api.put(`/admin_pusat/pengguna/${editingUser.id}`, payload)
        setData(data.map(user =>
          user.id === editingUser.id ? { ...user, ...payload } : user
        ))
      } else {
        const response = await api.post('/admin_pusat/pengguna', formData)
        setData([response.data, ...data])
      }

      setShowModal(false)
      setEditingUser(null)
      setFormData({ name: '', username: '', email: '', password: '', role: 'admin_lapangan' })
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
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
          <div className="spinner-border text-success" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </AdminPusatLayout>
    )
  }

  return (
    <AdminPusatLayout title="Pengguna">
      {error && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          <i className="fas fa-exclamation-circle me-2"></i>{error}
          <button type="button" className="btn-close" onClick={() => setError('')}></button>
        </div>
      )}

      <div className="row mb-3">
        <div className="col-12">
          <button
            className="btn btn-primary btn-sm float-end"
            onClick={() => {
              setEditingUser(null)
              setFormData({ name: '', username: '', email: '', password: '', role: 'admin_lapangan' })
              setShowModal(true)
            }}
          >
            <i className="fas fa-plus me-1"></i> Pengguna
          </button>
        </div>
      </div>

      <div className="white-box">
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
                    <td>{getRoleBadge(user.role)}</td>
                    <td>
                      <button
                        className="btn btn-warning btn-sm me-1"
                        onClick={() => handleEdit(user)}
                        title="Edit"
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button
                        className="btn btn-danger btn-sm text-white"
                        onClick={() => handleDelete(user.id)}
                        title="Hapus"
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
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className={`fas ${editingUser ? 'fa-user-edit' : 'fa-user-plus'} me-2`}></i>
                  {editingUser ? 'Edit Pengguna' : 'Tambah Pengguna'}
                </h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleSubmit} autoComplete="off">
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Nama</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      autoComplete="off"
                      placeholder="Masukkan nama"
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Username</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.username}
                      onChange={e => setFormData({ ...formData, username: e.target.value })}
                      autoComplete="off"
                      placeholder="Masukkan username"
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      autoComplete="off"
                      placeholder="Masukkan email"
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Password</label>
                    <input
                      type="password"
                      className="form-control"
                      value={formData.password}
                      onChange={e => setFormData({ ...formData, password: e.target.value })}
                      autoComplete="new-password"
                      placeholder="Masukkan password"
                      required={!editingUser}
                    />
                    {/* Teks info hanya muncul saat Edit, tidak di placeholder agar tidak dobel */}
                    {editingUser && (
                      <small className="text-muted">Kosongkan jika tidak ingin mengubah password</small>
                    )}
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Role</label>
                    <select
                      className="form-control"
                      value={formData.role}
                      onChange={e => setFormData({ ...formData, role: e.target.value })}
                    >
                      <option value="admin_lapangan">Admin Lapangan</option>
                      <option value="admin_pusat">Admin Pusat</option>
                    </select>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                    <i className="fas fa-times me-1"></i> Batal
                  </button>
                  <button type="submit" className="btn btn-primary">
                    <i className="fas fa-save me-1"></i>
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