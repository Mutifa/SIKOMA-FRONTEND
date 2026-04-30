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

  React.useEffect(() => {
    let mounted = true

    api.get('/admin_pusat/dashboard')
      .then(res => {
        if (mounted) {
          const userData = res.data.user || { name: '', username: '', email: '', role: '' }
          setUser(userData)
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSuccess('')

    // Cek apakah ada perubahan password
    const hasPasswordChange =
      passwordData.current_password ||
      passwordData.password ||
      passwordData.password_confirmation

    if (hasPasswordChange) {
      if (!passwordData.current_password || !passwordData.password || !passwordData.password_confirmation) {
        setError('Lengkapi semua field password jika ingin mengganti password')
        setSaving(false)
        return
      }
      if (passwordData.password !== passwordData.password_confirmation) {
        setError('Konfirmasi password baru tidak cocok')
        setSaving(false)
        return
      }
    }

    try {
      // Update profil
      const profileRes = await api.put('/admin_pusat/profile', user)
      const updatedUser = profileRes.data.user || user
      setUser(updatedUser)

      // Update password jika diisi
      if (hasPasswordChange) {
        await api.put('/password', passwordData)
        setPasswordData({ current_password: '', password: '', password_confirmation: '' })
      }

      setSuccess('Data akun berhasil diperbarui')
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal memperbarui data akun')
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

      <div className="row">
        <div className="col-md-8 col-lg-6">
          <div className="white-box">
            <form onSubmit={handleSubmit}>

              {/* ===== SECTION: PROFIL ===== */}
              <div className="mb-4">
                <h3 className="box-title mb-3">
                  <i className="fas fa-user-circle me-2 text-success"></i>Profil Saya
                </h3>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Nama</label>
                  <input
                    type="text"
                    className="form-control"
                    value={user.name}
                    onChange={e => setUser({ ...user, name: e.target.value })}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Username</label>
                  <input
                    type="text"
                    className="form-control"
                    value={user.username}
                    onChange={e => setUser({ ...user, username: e.target.value })}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    value={user.email || ''}
                    onChange={e => setUser({ ...user, email: e.target.value })}
                    required
                  />
                </div>

                <div className="mb-0">
                  <label className="form-label fw-semibold">Role</label>
                  <div className="form-control bg-light d-flex align-items-center">
                    {getRoleBadge(user.role)}
                  </div>
                  <small className="text-muted">Role tidak dapat diubah.</small>
                </div>
              </div>

              <hr className="my-4" />

              {/* ===== SECTION: PASSWORD ===== */}
              <div className="mb-4">
                <h3 className="box-title mb-1">
                  <i className="fas fa-lock me-2 text-warning"></i>Ubah Password
                </h3>
                <p className="text-muted mb-3" style={{ fontSize: '0.875rem' }}>
                  Kosongkan semua field password jika tidak ingin mengganti password.
                </p>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Password Lama</label>
                  <div className="input-group">
                    <input
                      type={showPasswords.current ? 'text' : 'password'}
                      className="form-control"
                      value={passwordData.current_password}
                      onChange={e => setPasswordData({ ...passwordData, current_password: e.target.value })}
                      placeholder="Masukkan password lama"
                    />
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                    >
                      <i className={`fas ${showPasswords.current ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                    </button>
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Password Baru</label>
                  <div className="input-group">
                    <input
                      type={showPasswords.new ? 'text' : 'password'}
                      className="form-control"
                      value={passwordData.password}
                      onChange={e => setPasswordData({ ...passwordData, password: e.target.value })}
                      placeholder="Masukkan password baru"
                    />
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                    >
                      <i className={`fas ${showPasswords.new ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                    </button>
                  </div>
                </div>

                <div className="mb-0">
                  <label className="form-label fw-semibold">Konfirmasi Password Baru</label>
                  <div className="input-group">
                    <input
                      type={showPasswords.confirm ? 'text' : 'password'}
                      className="form-control"
                      value={passwordData.password_confirmation}
                      onChange={e => setPasswordData({ ...passwordData, password_confirmation: e.target.value })}
                      placeholder="Ulangi password baru"
                    />
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                    >
                      <i className={`fas ${showPasswords.confirm ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                    </button>
                  </div>
                </div>
              </div>

              <hr className="my-4" />

              {/* ===== TOMBOL SIMPAN ===== */}
              <div className="d-flex justify-content-end">
                <button type="submit" className="btn btn-success px-4" disabled={saving}>
                  <i className="fas fa-save me-2"></i>
                  {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>

    </AdminPusatLayout>
  )
}