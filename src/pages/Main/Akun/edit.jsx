import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

import DashboardLayout from '../../../layouts/DashboardLayout.jsx'
import api from '../../../lib/api.js'

export default function AkunEdit() {

  const navigate = useNavigate()

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
    api.get('/admin_pusat/dashboard')
      .then(res => {
        if (mounted) {
          const userData = res.data.user || res.data.data || res.data || {}
          setFormData({
            name:     userData.name     || '',
            username: userData.username || '',
            email:    userData.email    || '',
            role:     userData.role     || ''
          })
          setLoading(false)
        }
      })
      .catch(() => {
        setError('Gagal memuat data')
        setLoading(false)
      })
    return () => { mounted = false }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSuccess('')
    try {
      await api.put('/admin_pusat/profile', formData)

      const hasPasswordChange =
        passwordData.current_password ||
        passwordData.password ||
        passwordData.password_confirmation

      if (hasPasswordChange) {
        await api.put('/password', passwordData)
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

      {/* Alert — class dari Dashboard.css */}
      {error   && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <form onSubmit={handleSubmit}>

        {/* ── Section Profil — akun-card dari Dashboard.css ── */}
        <div className="akun-card mb-3">

          <div className="akun-section-title">
            <span className="akun-section-dot"></span>
            Informasi Profil
          </div>

          <div className="mb-3">
            <label className="akun-field-label">Nama</label>
            <input
              type="text"
              className="form-control"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="mb-3">
            <label className="akun-field-label">Username</label>
            <input
              type="text"
              className="form-control"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              required
            />
          </div>

          <div className="mb-3">
            <label className="akun-field-label">Email</label>
            <input
              type="email"
              className="form-control"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div className="mb-3">
            <label className="akun-field-label">Role</label>
            {/* Read-only — tampil seperti field value */}
            <div className="akun-field-value">{formData.role || '-'}</div>
          </div>

        </div>

        {/* ── Section Password — akun-card dari Dashboard.css ── */}
        <div className="akun-card mb-3">

          <div className="akun-section-title">
            <span className="akun-section-dot"></span>
            Ubah Password
          </div>

          <div className="mb-3">
            <label className="akun-field-label">Password Lama</label>
            <input
              type="password"
              className="form-control"
              value={passwordData.current_password}
              onChange={(e) => setPasswordData({ ...passwordData, current_password: e.target.value })}
            />
          </div>

          <div className="mb-3">
            <label className="akun-field-label">Password Baru</label>
            <input
              type="password"
              className="form-control"
              value={passwordData.password}
              onChange={(e) => setPasswordData({ ...passwordData, password: e.target.value })}
            />
          </div>

          <div className="mb-3">
            <label className="akun-field-label">Konfirmasi Password Baru</label>
            <input
              type="password"
              className="form-control"
              value={passwordData.password_confirmation}
              onChange={(e) => setPasswordData({ ...passwordData, password_confirmation: e.target.value })}
            />
          </div>

        </div>

        {/* ── Tombol Aksi ── */}
        <div className="d-flex gap-2">

          {/* Simpan — btn-primary-custom */}
          <button
            type="submit"
            className="btn-primary-custom"
            disabled={saving}
          >
            {saving ? 'Menyimpan...' : 'Simpan'}
          </button>

          {/* Kembali — btn-secondary-custom */}
          <Link to="/akun" className="btn-secondary-custom">
            Kembali
          </Link>

        </div>

      </form>

    </DashboardLayout>

  )
}