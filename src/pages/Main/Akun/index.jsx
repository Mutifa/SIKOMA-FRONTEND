import React from 'react'
import { Link } from 'react-router-dom'

import DashboardLayout from '../../../layouts/DashboardLayout.jsx'
import { akunService } from '../../../services/akunService.js'

const roleMap = {
  admin_pusat: { label: 'Admin Pusat', bg: '#EAF3DE', color: '#3B6D11' },
  super_admin: { label: 'Super Admin', bg: '#FCEBEB', color: '#A32D2D' },
  admin_lapangan: { label: 'Admin Lapangan', bg: '#dbeafe', color: '#1e3a8a' },
}

const getInitials = (name = '') => {
  const words = name.trim().split(/\s+/).filter(Boolean)
  if (!words.length) return 'A'
  return words.slice(0, 2).map(word => word[0]).join('').toUpperCase()
}

const InfoItem = ({ icon, label, value }) => (
  <div className="akun-info-item">
    <div className="akun-info-icon">
      <i className={`fas ${icon}`}></i>
    </div>
    <div className="akun-info-content">
      <span className="akun-field-label">{label}</span>
      <div className="akun-field-value">{value || '-'}</div>
    </div>
  </div>
)

export default function Akun() {
  const [user, setUser] = React.useState({ name: '', username: '', email: '', role: '' })
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState('')

  React.useEffect(() => {
    let mounted = true
    akunService.getProfile()
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

  const roleInfo = roleMap[user.role] || { label: user.role || '-', bg: '#f3f4f6', color: '#374151' }

  if (loading) {
    return (
      <DashboardLayout title="Akun">
        <div className="loading-center">
          <div className="spinner-border"></div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout title="Akun">
      {error && <div className="alert alert-danger">{error}</div>}

      <section className="akun-shell">
        <div className="akun-hero">
          <div className="akun-avatar" aria-hidden="true">
            {getInitials(user.name)}
          </div>

          <div className="akun-hero-main">
            <div className="akun-hero-title-row">
              <div>
                <h4 className="akun-name">{user.name || 'Admin'}</h4>
                <p className="akun-email">{user.email || '-'}</p>
              </div>

              <span
                className="akun-role-badge"
                style={{ background: roleInfo.bg, color: roleInfo.color }}
              >
                {roleInfo.label}
              </span>
            </div>

            <div className="akun-quick-row">
              <span><i className="fas fa-user"></i>{user.username || '-'}</span>
              <span><i className="fas fa-shield-alt"></i>Akun aktif</span>
            </div>
          </div>

          <Link to="/akun/edit" className="btn-primary-custom akun-edit-button">
            <i className="fas fa-pen"></i>
            Edit Profil
          </Link>
        </div>

        <div className="akun-grid">
          <div className="akun-card">
            <div className="akun-section-title">
              <span className="akun-section-dot"></span>
              Informasi Profil
            </div>

            <div className="akun-info-list">
              <InfoItem icon="fa-id-card" label="Nama" value={user.name} />
              <InfoItem icon="fa-user" label="Username" value={user.username} />
              <InfoItem icon="fa-envelope" label="Email" value={user.email} />
              <InfoItem icon="fa-user-shield" label="Role" value={roleInfo.label} />
            </div>
          </div>

          <div className="akun-card akun-card-soft">
            <div className="akun-section-title">
              <span className="akun-section-dot"></span>
              Keamanan
            </div>

            <div className="akun-security-box">
              <div className="akun-security-icon">
                <i className="fas fa-lock"></i>
              </div>
              <div>
                <h5>Password</h5>
                <p>Gunakan password yang kuat dan ganti secara berkala.</p>
              </div>
            </div>

            <div className="akun-field-value akun-password-dots" aria-label="Password disembunyikan">
              ********
            </div>

            <Link to="/akun/edit" className="btn-secondary-custom akun-full-button">
              <i className="fas fa-key"></i>
              Ubah Password
            </Link>
          </div>
        </div>
      </section>
    </DashboardLayout>
  )
}
