import React from 'react'
import AdminPusatLayout from '../../layouts/AdminPusatLayout.jsx'
import api from '../../lib/api.js'

export default function Akun() {
  const [user, setUser] = React.useState({
    name: '',
    username: '',
    email: '',
    role: '',
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

  // Mode: 'view' | 'editProfile' | 'editPassword'
  const [mode, setMode] = React.useState('view')

  // Simpan data asli sebelum edit (untuk cancel)
  const [originalUser, setOriginalUser] = React.useState(null)

  React.useEffect(() => {
    let mounted = true

    api.get('/admin_pusat/dashboard')
      .then(res => {
        if (mounted) {
          const userData = res.data.user || { name: '', username: '', email: '', role: '' }
          setUser(userData)
          setOriginalUser(userData)
          setLoading(false)
        }
      })
      .catch(err => {
        if (mounted) {
          console.error(err)
          setError('Gagal memuat data profil')
          setLoading(false)
        }
      })

    return () => { mounted = false }
  }, [])

  const handleEditProfile = () => {
    setOriginalUser({ ...user })
    setError('')
    setSuccess('')
    setMode('editProfile')
  }

  const handleEditPassword = () => {
    setError('')
    setSuccess('')
    setPasswordData({ current_password: '', password: '', password_confirmation: '' })
    setMode('editPassword')
  }

  const handleCancelProfile = () => {
    setUser({ ...originalUser })
    setError('')
    setSuccess('')
    setMode('view')
  }

  const handleCancelPassword = () => {
    setPasswordData({ current_password: '', password: '', password_confirmation: '' })
    setError('')
    setSuccess('')
    setMode('view')
  }

  const handleProfileUpdate = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSuccess('')

    try {
      const response = await api.put('/admin_pusat/profile', user)
      const updatedUser = response.data.user || user
      setUser(updatedUser)
      setOriginalUser(updatedUser)
      setSuccess(response.data.message || 'Profil berhasil diperbarui')
      setMode('view')
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
      const response = await api.put('/password', passwordData)
      setSuccess(response.data.message || 'Password berhasil diperbarui')
      setPasswordData({ current_password: '', password: '', password_confirmation: '' })
      setMode('view')
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal memperbarui password')
    } finally {
      setSaving(false)
    }
  }

  const getRoleBadge = (role) => {
    const map = {
      admin_pusat: { label: 'Admin Pusat', color: 'primary' },
      super_admin: { label: 'Super Admin', color: 'danger' },
    }
    const r = map[role] || { label: role, color: 'secondary' }
    return <span className={`badge bg-${r.color}`}>{r.label}</span>
  }

  if (loading) {
    return (
      <AdminPusatLayout title="Akun">
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
          <div className="spinner-border text-success" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </AdminPusatLayout>
    )
  }

  return (
    <AdminPusatLayout title="Akun">

      {/* Alert */}
      {error && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          <i className="fas fa-exclamation-circle me-2"></i>{error}
          <button type="button" className="btn-close" onClick={() => setError('')}></button>
        </div>
      )}
      {success && (
        <div className="alert alert-success alert-dismissible fade show" role="alert">
          <i className="fas fa-check-circle me-2"></i>{success}
          <button type="button" className="btn-close" onClick={() => setSuccess('')}></button>
        </div>
      )}

      {/* ===== MODE VIEW ===== */}
      {mode === 'view' && (
        <div className="row">
          {/* Kartu Profil */}
          <div className="col-md-6 mb-4">
            <div className="white-box">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h3 className="box-title mb-0">
                  <i className="fas fa-user-circle me-2 text-success"></i>Profil Saya
                </h3>
                <button className="btn btn-sm btn-outline-primary" onClick={handleEditProfile}>
                  <i className="fas fa-edit me-1"></i> Edit Profil
                </button>
              </div>

              <table className="table table-borderless mb-0">
                <tbody>
                  <tr>
                    <td className="text-muted fw-semibold" style={{ width: '35%' }}>Nama</td>
                    <td>: {user.name || '-'}</td>
                  </tr>
                  <tr>
                    <td className="text-muted fw-semibold">Username</td>
                    <td>: {user.username || '-'}</td>
                  </tr>
                  <tr>
                    <td className="text-muted fw-semibold">Email</td>
                    <td>: {user.email || '-'}</td>
                  </tr>
                  <tr>
                    <td className="text-muted fw-semibold">Role</td>
                    <td>: {getRoleBadge(user.role)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Kartu Password */}
          <div className="col-md-6 mb-4">
            <div className="white-box">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h3 className="box-title mb-0">
                  <i className="fas fa-lock me-2 text-warning"></i>Password
                </h3>
                <button className="btn btn-sm btn-outline-warning" onClick={handleEditPassword}>
                  <i className="fas fa-key me-1"></i> Ubah Password
                </button>
              </div>
              <p className="text-muted mb-0" style={{ fontSize: '0.95rem' }}>
                <i className="fas fa-shield-alt me-2 text-secondary"></i>
                Password Anda tersimpan dengan aman. Klik <strong>Ubah Password</strong> untuk mengganti password akun Anda.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ===== MODE EDIT PROFIL ===== */}
      {mode === 'editProfile' && (
        <div className="row">
          <div className="col-md-6">
            <div className="white-box">
              <h3 className="box-title mb-3">
                <i className="fas fa-user-edit me-2 text-primary"></i>Edit Profil
              </h3>
              <form onSubmit={handleProfileUpdate}>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Nama</label>
                  <input type="text" className="form-control" value={user.name}
                    onChange={e => setUser({ ...user, name: e.target.value })} required />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Username</label>
                  <input type="text" className="form-control" value={user.username}
                    onChange={e => setUser({ ...user, username: e.target.value })} required />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Email</label>
                  <input type="email" className="form-control" value={user.email || ''}
                    onChange={e => setUser({ ...user, email: e.target.value })} required />
                </div>
                <div className="mb-4">
                  <label className="form-label fw-semibold">Role</label>
                  <input type="text" className="form-control" value={user.role || ''} disabled />
                  <small className="text-muted">Role tidak dapat diubah.</small>
                </div>
                <div className="d-flex gap-2">
                  <button type="submit" className="btn btn-primary" disabled={saving}>
                    <i className="fas fa-save me-1"></i>{saving ? 'Menyimpan...' : 'Simpan Perubahan'}
                  </button>
                  <button type="button" className="btn btn-secondary" onClick={handleCancelProfile} disabled={saving}>
                    <i className="fas fa-times me-1"></i> Batal
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ===== MODE EDIT PASSWORD ===== */}
      {mode === 'editPassword' && (
        <div className="row">
          <div className="col-md-6">
            <div className="white-box">
              <h3 className="box-title mb-3">
                <i className="fas fa-key me-2 text-warning"></i>Ubah Password
              </h3>
              <form onSubmit={handlePasswordUpdate}>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Password Lama</label>
                  <div className="input-group">
                    <input type={showPasswords.current ? 'text' : 'password'} className="form-control"
                      value={passwordData.current_password}
                      onChange={e => setPasswordData({ ...passwordData, current_password: e.target.value })} required />
                    <button type="button" className="btn btn-outline-secondary"
                      onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}>
                      <i className={`fas ${showPasswords.current ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                    </button>
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Password Baru</label>
                  <div className="input-group">
                    <input type={showPasswords.new ? 'text' : 'password'} className="form-control"
                      value={passwordData.password}
                      onChange={e => setPasswordData({ ...passwordData, password: e.target.value })} required />
                    <button type="button" className="btn btn-outline-secondary"
                      onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}>
                      <i className={`fas ${showPasswords.new ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                    </button>
                  </div>
                </div>
                <div className="mb-4">
                  <label className="form-label fw-semibold">Konfirmasi Password Baru</label>
                  <div className="input-group">
                    <input type={showPasswords.confirm ? 'text' : 'password'} className="form-control"
                      value={passwordData.password_confirmation}
                      onChange={e => setPasswordData({ ...passwordData, password_confirmation: e.target.value })} required />
                    <button type="button" className="btn btn-outline-secondary"
                      onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}>
                      <i className={`fas ${showPasswords.confirm ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                    </button>
                  </div>
                </div>
                <div className="d-flex gap-2">
                  <button type="submit" className="btn btn-warning text-white" disabled={saving}>
                    <i className="fas fa-save me-1"></i>{saving ? 'Menyimpan...' : 'Simpan Password'}
                  </button>
                  <button type="button" className="btn btn-secondary" onClick={handleCancelPassword} disabled={saving}>
                    <i className="fas fa-times me-1"></i> Batal
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