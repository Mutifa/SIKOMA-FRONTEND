import React from 'react'
import AdminLapanganLayout from '../../layouts/AdminLapanganLayout.jsx'
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
    api.get('/admin_lapangan/dashboard')
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
      await api.put('/admin_lapangan/dashboard', user)
      setSuccess('Profil berhasil diperbarui')
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
      await api.put('/admin_lapangan/dashboard', passwordData)
      setSuccess('Password berhasil diperbarui')
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

  const togglePassword = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }))
  }

  if (loading) {
    return (
      <AdminLapanganLayout title="Akun">
        <div className="d-flex justify-content-center">
          <div className="spinner-border" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      </AdminLapanganLayout>
    )
  }

  return (
    <AdminLapanganLayout title="Akun">
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}
      
      {/* Profile Information */}
      <div className="white-box">
        <h4 className="box-title">Informasi Profil</h4>
        
        <div className="basic-form">
          <form onSubmit={handleProfileUpdate}>
            <div className="form-group">
              <label htmlFor="name">Nama</label>
              <input 
                type="text" 
                id="name" 
                className="form-control" 
            
                value={user.name || ''}
                onChange={(e) => setUser({...user, name: e.target.value})}
                required 
              />
            </div>

            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input 
                type="text" 
                id="username" 
                className="form-control" 
        
                value={user.username || ''}
                onChange={(e) => setUser({...user, username: e.target.value})}
                required 
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input 
                type="email" 
                id="email" 
                className="form-control" 
               
                value={user.email || ''}
                onChange={(e) => setUser({...user, email: e.target.value})}
                required 
              />
            </div>

          

            <div className="form-group">
              <label htmlFor="role">Role</label>
              <input 
                type="text" 
                id="role" 
                className="form-control" 
                value={user.role || ''}
                disabled
              />
            </div>

            <div className="form-group">
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? 'Menyimpan...' : 'Simpan'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Update Password */}
      <div className="white-box">
        <h4 className="box-title">Ubah Password</h4>
        
        <div className="basic-form">
          <form onSubmit={handlePasswordUpdate}>
            <div className="row">
              <div className="col-lg-4">
                <div className="form-group">
                  <label htmlFor="current_password">Password Lama</label>
                  <div className="position-relative">
                    <input 
                      id="current_password" 
                      type={showPasswords.current ? 'text' : 'password'} 
                      className="form-control"
                      value={passwordData.current_password}
                      onChange={(e) => setPasswordData({...passwordData, current_password: e.target.value})}
                      required
                    />
                    <button 
                      type="button"
                      className="btn btn-outline-secondary btn-sm position-absolute"
                      style={{top: '50%', right: '5px', transform: 'translateY(-50%)'}}
                      onClick={() => togglePassword('current')}
                    >
                      <i className={`fa ${showPasswords.current ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                    </button>
                  </div>
                </div>
              </div>

              <div className="col-lg-4">
                <div className="form-group">
                  <label htmlFor="password">Password Baru</label>
                  <div className="position-relative">
                    <input 
                      id="password" 
                      type={showPasswords.new ? 'text' : 'password'} 
                      className="form-control"
                      value={passwordData.password}
                      onChange={(e) => setPasswordData({...passwordData, password: e.target.value})}
                      required
                    />
                    <button 
                      type="button"
                      className="btn btn-outline-secondary btn-sm position-absolute"
                      style={{top: '50%', right: '5px', transform: 'translateY(-50%)'}}
                      onClick={() => togglePassword('new')}
                    >
                      <i className={`fa ${showPasswords.new ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                    </button>
                  </div>
                </div>
              </div>

              <div className="col-lg-4">
                <div className="form-group">
                  <label htmlFor="password_confirmation">Konfirmasi Password</label>
                  <div className="position-relative">
                    <input 
                      id="password_confirmation" 
                      type={showPasswords.confirm ? 'text' : 'password'} 
                      className="form-control"
                      value={passwordData.password_confirmation}
                      onChange={(e) => setPasswordData({...passwordData, password_confirmation: e.target.value})}
                      required
                    />
                    <button 
                      type="button"
                      className="btn btn-outline-secondary btn-sm position-absolute"
                      style={{top: '50%', right: '5px', transform: 'translateY(-50%)'}}
                      onClick={() => togglePassword('confirm')}
                    >
                      <i className={`fa ${showPasswords.new ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="form-group">
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? 'Menyimpan...' : 'Simpan Password'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLapanganLayout>
  )
}
