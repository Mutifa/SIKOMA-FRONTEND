import React from 'react'
import AdminPusatLayout from '../../layouts/AdminPusatLayout.jsx'
import api from '../../lib/api.js'

export default function Akun() {
  const [user, setUser] = React.useState({
    name: '',
    username: '',
    email: '',
    nohp: '',
    role: ''
  })
  const [passwordData, setPasswordData] = React.useState({
    current_password: '',
    password: '',
    password_confirmation: ''
  })
  const [loading, setLoading] = React.useState(true)
  const [saving, setSaving] = React.useState(false)
  const [error, setError] = React.useState('')
  const [success, setSuccess] = React.useState('')
  const [showPasswords, setShowPasswords] = React.useState({
    current: false,
    new: false,
    confirm: false
  })

  React.useEffect(() => {
    let mounted = true
    // Ambil data user dari dashboard API (karena sudah ada user data di sana)
    api.get('/api/AdminPusat/dashboard')
      .then(res => { 
        if (mounted && res.data.user) {
          setUser(res.data.user)
          setLoading(false)
        }
      })
      .catch(err => { 
        if (mounted) {
          setError('Gagal memuat data profil')
          setLoading(false)
        }
      })
    return () => { mounted = false }
  }, [])

  const handleProfileUpdate = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSuccess('')

    try {
      const response = await api.put('/api/AdminPusat/profile', user)
      setSuccess(response.data.message || 'Profil berhasil diperbarui')
      // Update user data with response
      if (response.data.user) {
        setUser(response.data.user)
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal memperbarui profil')
    } finally {
      setSaving(false)
    }
  }

  const handlePasswordUpdate = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSuccess('')

    if (passwordData.password !== passwordData.password_confirmation) {
      setError('Konfirmasi password tidak cocok')
      setSaving(false)
      return
    }

    try {
      const response = await api.put('/api/AdminPusat/password', passwordData)
      setSuccess(response.data.message || 'Password berhasil diperbarui')
      setPasswordData({
        current_password: '',
        password: '',
        password_confirmation: ''
      })
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal memperbarui password')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <AdminPusatLayout title="Akun">
        <div className="d-flex justify-content-center">
          <div className="spinner-border" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      </AdminPusatLayout>
    )
  }

  return (
    <AdminPusatLayout title="Akun">
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}
      
      <div className="row">
        <div className="col-md-6">
          <div className="white-box">
            <h3 className="box-title">Profil Saya</h3>
            <form onSubmit={handleProfileUpdate}>
              <div className="mb-3">
                <label className="form-label">Nama</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={user.name} 
                  onChange={e => setUser({...user, name: e.target.value})} 
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Username</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={user.username} 
                  onChange={e => setUser({...user, username: e.target.value})} 
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input 
                  type="email" 
                  className="form-control" 
                  value={user.email} 
                  onChange={e => setUser({...user, email: e.target.value})} 
                />
              </div>
              <div className="mb-3">
                <label className="form-label">No. HP</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={user.nohp || ''} 
                  onChange={e => setUser({...user, nohp: e.target.value})} 
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Role</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={user.role} 
                  disabled 
                />
              </div>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
              </button>
            </form>
          </div>
        </div>

        <div className="col-md-6">
          <div className="white-box">
            <h3 className="box-title">Ubah Password</h3>
            <form onSubmit={handlePasswordUpdate}>
              <div className="mb-3">
                <label className="form-label">Password Lama</label>
                <div className="input-group">
                  <input 
                    type={showPasswords.current ? "text" : "password"} 
                    className="form-control" 
                    value={passwordData.current_password} 
                    onChange={e => setPasswordData({...passwordData, current_password: e.target.value})} 
                  />
                  <button 
                    type="button" 
                    className="btn btn-outline-secondary" 
                    onClick={() => setShowPasswords({...showPasswords, current: !showPasswords.current})}
                  >
                    <i className={`fas ${showPasswords.current ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                  </button>
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label">Password Baru</label>
                <div className="input-group">
                  <input 
                    type={showPasswords.new ? "text" : "password"} 
                    className="form-control" 
                    value={passwordData.password} 
                    onChange={e => setPasswordData({...passwordData, password: e.target.value})} 
                  />
                  <button 
                    type="button" 
                    className="btn btn-outline-secondary" 
                    onClick={() => setShowPasswords({...showPasswords, new: !showPasswords.new})}
                  >
                    <i className={`fas ${showPasswords.new ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                  </button>
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label">Konfirmasi Password Baru</label>
                <div className="input-group">
                  <input 
                    type={showPasswords.confirm ? "text" : "password"} 
                    className="form-control" 
                    value={passwordData.password_confirmation} 
                    onChange={e => setPasswordData({...passwordData, password_confirmation: e.target.value})} 
                  />
                  <button 
                    type="button" 
                    className="btn btn-outline-secondary" 
                    onClick={() => setShowPasswords({...showPasswords, confirm: !showPasswords.confirm})}
                  >
                    <i className={`fas ${showPasswords.confirm ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                  </button>
                </div>
              </div>
              <button type="submit" className="btn btn-warning" disabled={saving}>
                {saving ? 'Menyimpan...' : 'Ubah Password'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </AdminPusatLayout>
  )
}
