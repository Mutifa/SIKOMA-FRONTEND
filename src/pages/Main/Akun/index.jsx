import React from 'react'
import { Link } from 'react-router-dom'

import DashboardLayout from '../../../layouts/DashboardLayout.jsx'
import api from '../../../lib/api.js'

// ── Mapping role ke label & warna badge ──
const roleMap = {
  admin_pusat: { label: 'Admin Pusat',  bg: '#EAF3DE', color: '#3B6D11' },
  super_admin: { label: 'Super Admin',  bg: '#FCEBEB', color: '#A32D2D' },
  admin_lapangan: { label: 'Admin Lapangan', bg: '#dbeafe', color: '#1e3a8a' },
}

export default function Akun() {

  const [user, setUser] = React.useState({ name: '', username: '', email: '', role: '' })
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState('')
  const [success, setSuccess] = React.useState('')

  React.useEffect(() => {
    let mounted = true
    api.get('/admin_pusat/dashboard')
      .then(res => {
        if (mounted) {
          const userData = res.data.user || res.data.data || res.data || {}
          setUser(userData)
          setLoading(false)
        }
      })
      .catch(() => {
        if (mounted) {
          setError('Gagal memuat data profil')
          setLoading(false)
        }
      })
    return () => { mounted = false }
  }, [])

  const roleInfo = roleMap[user.role] || { label: user.role || '-', bg: '#f0f0f0', color: '#888' }

  if (loading) {
    return (
      <DashboardLayout title="Akun">
        {/* loading-center — class dari Dashboard.css */}
        <div className="loading-center">
          <div className="spinner-border"></div>
        </div>
      </DashboardLayout>
    )
  }

  return (

    <DashboardLayout title="Akun">

      {/* Tombol Edit Profil — btn-primary-custom dari Dashboard.css */}
      <div className="d-flex justify-content-end mb-4">
        <Link to="/akun/edit" className="btn-primary-custom">
          <i className="fas fa-pen"></i>
          Edit Profil
        </Link>
      </div>

      {/* Alert — pakai class dari Dashboard.css */}
      {error   && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {/* Grid — akun-grid dari Dashboard.css */}
      <div className="akun-grid">

        {/* Card Profil — akun-card dari Dashboard.css */}
        <div className="akun-card">

          <div className="akun-section-title">
            <span className="akun-section-dot"></span>
            Profil Saya
          </div>

          {[
            { label: 'Nama',     value: user.name     || '-' },
            { label: 'Username', value: user.username || '-' },
            { label: 'Email',    value: user.email    || '-' },
          ].map(({ label, value }) => (
            <div key={label}>
              {/* akun-field-label & akun-field-value dari Dashboard.css */}
              <label className="akun-field-label">{label}</label>
              <div className="akun-field-value">{value}</div>
            </div>
          ))}

          {/* Field Role — badge dengan warna dinamis */}
          <div>
            <label className="akun-field-label">Role</label>
            <div className="akun-field-value">
              {/* akun-role-badge dari Dashboard.css, warna dari roleMap */}
              <span
                className="akun-role-badge"
                style={{ background: roleInfo.bg, color: roleInfo.color }}
              >
                {roleInfo.label}
              </span>
            </div>
          </div>

        </div>

        {/* Card Password — akun-card dari Dashboard.css */}
        <div className="akun-card">

          <div className="akun-section-title">
            <span className="akun-section-dot"></span>
            Password
          </div>

          <label className="akun-field-label">Password Saat Ini</label>

          {/* akun-field-value + akun-password-dots dari Dashboard.css */}
          <div className="akun-field-value akun-password-dots">
            ••••••••
          </div>

          {/* akun-password-hint dari Dashboard.css */}
          <div className="akun-password-hint">
            Klik <strong>Edit Profil</strong> untuk mengganti password.
          </div>

        </div>

      </div>

    </DashboardLayout>

  )
}