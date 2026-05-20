import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

import DashboardLayout from '../../../layouts/DashboardLayout.jsx'
import { useAuth } from '../../../contexts/AuthContext.jsx'
import { akunService } from '../../../services/akunService.js'

const roleLabel = {
  admin_pusat: 'Admin Pusat',
  super_admin: 'Super Admin',
  admin_lapangan: 'Admin Lapangan',
}

const PasswordInput = ({ label, value, onChange, autoComplete }) => {
  const [visible, setVisible] = React.useState(false)

  return (
    <div className="akun-password-control">
      <label className="akun-field-label">{label}</label>
      <div className="akun-input-wrap">
        <input
          type={visible ? 'text' : 'password'}
          className="form-control"
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
        />
        <button
          type="button"
          className="akun-input-action"
          onClick={() => setVisible(prev => !prev)}
          aria-label={visible ? 'Sembunyikan password' : 'Tampilkan password'}
        >
          <i className={`fas ${visible ? 'fa-eye-slash' : 'fa-eye'}`}></i>
        </button>
      </div>
    </div>
  )
}

const extractProfile = (payload, fallbackUser = {}) => {
  const data = payload?.data?.user || payload?.user || payload?.data || payload || {}
  return {
    ...fallbackUser,
    ...data,
    name: data.name || data.nama || fallbackUser?.name || '',
    username: data.username || fallbackUser?.username || '',
    email: data.email || fallbackUser?.email || '',
    role: data.role || fallbackUser?.role || '',
  }
}

export default function AkunEdit() {
  const navigate = useNavigate()
  const { user: authUser } = useAuth()

  const [loading, setLoading] = React.useState(true)
  const [saving, setSaving] = React.useState(false)
  const [error, setError] = React.useState('')
  const [success, setSuccess] = React.useState('')

  const [formData, setFormData] = React.useState({
    name: '',
    username: '',
    email: '',
    role: ''
  })

  const [passwordData, setPasswordData] = React.useState({
    current_password: '',
    password: '',
    password_confirmation: ''
  })

  React.useEffect(() => {
    let mounted = true
    akunService.getProfile(authUser?.role)
      .then(res => {
        if (mounted) {
          const userData = extractProfile(res.data, authUser)
          setFormData({
            name: userData.name || '',
            username: userData.username || '',
            email: userData.email || '',
            role: userData.role || ''
          })
          setLoading(false)
        }
      })
      .catch(() => {
        if (mounted) {
          if (authUser) {
            const userData = extractProfile(null, authUser)
            setFormData({
              name: userData.name || '',
              username: userData.username || '',
              email: userData.email || '',
              role: userData.role || ''
            })
          } else {
            setError('Gagal memuat data')
          }
          setLoading(false)
        }
      })
    return () => { mounted = false }
  }, [authUser])

  const updateForm = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const updatePassword = (field, value) => {
    setPasswordData(prev => ({ ...prev, [field]: value }))
  }

  const validatePassword = () => {
    const hasPasswordChange =
      passwordData.current_password ||
      passwordData.password ||
      passwordData.password_confirmation

    if (!hasPasswordChange) return true

    if (!passwordData.current_password || !passwordData.password || !passwordData.password_confirmation) {
      setError('Lengkapi semua field password jika ingin mengganti password')
      return false
    }

    if (passwordData.password.length < 8) {
      setError('Password baru minimal 8 karakter')
      return false
    }

    if (passwordData.password !== passwordData.password_confirmation) {
      setError('Konfirmasi password baru tidak sama')
      return false
    }

    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSuccess('')

    if (!validatePassword()) {
      setSaving(false)
      return
    }

    try {
      await akunService.updateProfile(formData)

      const hasPasswordChange =
        passwordData.current_password ||
        passwordData.password ||
        passwordData.password_confirmation

      if (hasPasswordChange) {
        await akunService.updatePassword(passwordData)
      }

      setSuccess('Profil berhasil diperbarui')
      setTimeout(() => navigate('/akun'), 1000)
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal memperbarui profil')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <DashboardLayout title="Edit Akun">
        <div className="loading-center">
          <div className="spinner-border"></div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout title="Edit Akun">
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <form className="akun-edit-form" onSubmit={handleSubmit}>
        <div className="akun-edit-header">
          <div>
            <h4>Perbarui Profil</h4>
            <p>Ubah informasi akun dan password bila diperlukan.</p>
          </div>
          <Link to="/akun" className="btn-secondary-custom">
            <i className="fas fa-arrow-left"></i>
            Kembali
          </Link>
        </div>

        <div className="akun-edit-grid">
          <div className="akun-card">
            <div className="akun-section-title">
              <span className="akun-section-dot"></span>
              Informasi Profil
            </div>

            <div className="akun-form-grid">
              <div className="akun-form-group">
                <label className="akun-field-label">Nama</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.name}
                  autoComplete="name"
                  onChange={(e) => updateForm('name', e.target.value)}
                  required
                />
              </div>

              <div className="akun-form-group">
                <label className="akun-field-label">Username</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.username}
                  autoComplete="username"
                  onChange={(e) => updateForm('username', e.target.value)}
                  required
                />
              </div>

              <div className="akun-form-group akun-form-wide">
                <label className="akun-field-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  value={formData.email}
                  autoComplete="email"
                  onChange={(e) => updateForm('email', e.target.value)}
                  required
                />
              </div>

              <div className="akun-form-group akun-form-wide">
                <label className="akun-field-label">Role</label>
                <div className="akun-field-value akun-readonly">
                  <i className="fas fa-user-shield"></i>
                  {roleLabel[formData.role] || formData.role || '-'}
                </div>
              </div>
            </div>
          </div>

          <div className="akun-card akun-card-soft">
            <div className="akun-section-title">
              <span className="akun-section-dot"></span>
              Ubah Password
            </div>

            <p className="akun-card-note">
              Kosongkan bagian ini jika password tidak ingin diubah.
            </p>

            <div className="akun-password-stack">
              <PasswordInput
                label="Password Lama"
                value={passwordData.current_password}
                autoComplete="current-password"
                onChange={(e) => updatePassword('current_password', e.target.value)}
              />

              <PasswordInput
                label="Password Baru"
                value={passwordData.password}
                autoComplete="new-password"
                onChange={(e) => updatePassword('password', e.target.value)}
              />

              <PasswordInput
                label="Konfirmasi Password Baru"
                value={passwordData.password_confirmation}
                autoComplete="new-password"
                onChange={(e) => updatePassword('password_confirmation', e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="akun-action-bar">
          <Link to="/akun" className="btn-secondary-custom">
            Batal
          </Link>
          <button
            type="submit"
            className="btn-primary-custom"
            disabled={saving}
          >
            <i className={`fas ${saving ? 'fa-spinner fa-spin' : 'fa-save'}`}></i>
            {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
          </button>
        </div>
      </form>
    </DashboardLayout>
  )
}
