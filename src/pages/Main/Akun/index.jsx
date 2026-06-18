import React from 'react'

import DashboardLayout from '../../../layouts/DashboardLayout.jsx'
import { useAuth } from '../../../contexts/AuthContext.jsx'
import { akunService } from '../../../services/akunService.js'
import { successAlert } from '../../../utils/alert.js'

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

const PasswordField = ({ label, value, onChange, autoComplete }) => {
  const [visible, setVisible] = React.useState(false)

  return (
    <div className="akun-settings-field">
      <label>{label}</label>
      <div className="akun-settings-password">
        <input
          type={visible ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
        />
        <button
          type="button"
          onClick={() => setVisible(prev => !prev)}
          aria-label={visible ? 'Sembunyikan password' : 'Tampilkan password'}
        >
          <i className={`fas ${visible ? 'fa-eye-slash' : 'fa-eye'}`}></i>
        </button>
      </div>
    </div>
  )
}

export default function Akun() {
  const { user: authUser } = useAuth()

  const [activeTab, setActiveTab] = React.useState('profile')
  const [loading, setLoading] = React.useState(true)
  const [saving, setSaving] = React.useState(false)
  const [error, setError] = React.useState('')

  const [formData, setFormData] = React.useState({
    name: '',
    username: '',
    email: '',
    role: '',
  })

  const [passwordData, setPasswordData] = React.useState({
    current_password: '',
    password: '',
    password_confirmation: '',
  })

  React.useEffect(() => {
    let mounted = true

    akunService.getProfile()
      .then(res => {
        if (!mounted) return
        const userData = extractProfile(res.data, authUser)
        setFormData({
          name: userData.name || '',
          username: userData.username || '',
          email: userData.email || '',
          role: userData.role || '',
        })
        setLoading(false)
      })
      .catch(() => {
        if (!mounted) return
        if (authUser) {
          const userData = extractProfile(null, authUser)
          setFormData({
            name: userData.name || '',
            username: userData.username || '',
            email: userData.email || '',
            role: userData.role || '',
          })
        } else {
          setError('Gagal memuat data profil')
        }
        setLoading(false)
      })

    return () => { mounted = false }
  }, [authUser])

  const updateForm = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const updatePassword = (field, value) => {
    setPasswordData(prev => ({ ...prev, [field]: value }))
  }

  const handleProfileSubmit = async (event) => {
    event.preventDefault()
    setSaving(true)
    setError('')

    try {
      await akunService.updateProfile(formData)
      await successAlert('Berhasil', 'Profil berhasil disimpan')
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal menyimpan profil')
    } finally {
      setSaving(false)
    }
  }

  const handlePasswordSubmit = async (event) => {
    event.preventDefault()
    setSaving(true)
    setError('')

    if (!passwordData.current_password || !passwordData.password || !passwordData.password_confirmation) {
      setError('Lengkapi semua field password')
      setSaving(false)
      return
    }

    if (passwordData.password.length < 8) {
      setError('Password baru minimal 8 karakter')
      setSaving(false)
      return
    }

    if (passwordData.password !== passwordData.password_confirmation) {
      setError('Konfirmasi password baru tidak sama')
      setSaving(false)
      return
    }

    try {
      await akunService.updatePassword(passwordData)
      setPasswordData({
        current_password: '',
        password: '',
        password_confirmation: '',
      })
      await successAlert('Berhasil', 'Password berhasil diperbarui')
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal memperbarui password')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <DashboardLayout title="Pengaturan Akun">
        <div className="loading-center">
          <div className="spinner-border"></div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout title="Pengaturan Akun">
      <section className="akun-settings-page">
        {error && <div className="alert alert-danger">{error}</div>}

        <div className="akun-settings-tabs" role="tablist" aria-label="Pengaturan akun">
          <button
            type="button"
            className={activeTab === 'profile' ? 'active' : ''}
            onClick={() => setActiveTab('profile')}
          >
            Profil
          </button>
          <button
            type="button"
            className={activeTab === 'password' ? 'active' : ''}
            onClick={() => setActiveTab('password')}
          >
            Password
          </button>
        </div>

        <div className="akun-settings-content">
          {activeTab === 'profile' ? (
            <form className="akun-settings-form" onSubmit={handleProfileSubmit}>
              <div className="akun-settings-fields">
                <div className="akun-settings-field">
                  <label>Nama Lengkap</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => updateForm('name', e.target.value)}
                    autoComplete="name"
                    required
                  />
                </div>

                <div className="akun-settings-field">
                  <label>Username</label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => updateForm('username', e.target.value)}
                    autoComplete="username"
                    required
                  />
                </div>

                <div className="akun-settings-field">
                  <label>Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateForm('email', e.target.value)}
                    autoComplete="email"
                    required
                  />
                </div>

                <button type="submit" className="akun-settings-save" disabled={saving}>
                  {saving ? 'Menyimpan...' : 'Simpan'}
                </button>
              </div>

            </form>
          ) : (
            <form className="akun-settings-form akun-settings-form-password" onSubmit={handlePasswordSubmit}>
              <div className="akun-settings-fields">
                <PasswordField
                  label="Password Lama"
                  value={passwordData.current_password}
                  autoComplete="current-password"
                  onChange={(e) => updatePassword('current_password', e.target.value)}
                />

                <PasswordField
                  label="Password Baru"
                  value={passwordData.password}
                  autoComplete="new-password"
                  onChange={(e) => updatePassword('password', e.target.value)}
                />

                <PasswordField
                  label="Konfirmasi Password Baru"
                  value={passwordData.password_confirmation}
                  autoComplete="new-password"
                  onChange={(e) => updatePassword('password_confirmation', e.target.value)}
                />

                <button type="submit" className="akun-settings-save" disabled={saving}>
                  {saving ? 'Menyimpan...' : 'Simpan Password'}
                </button>
              </div>
            </form>
          )}
        </div>
      </section>
    </DashboardLayout>
  )
}
