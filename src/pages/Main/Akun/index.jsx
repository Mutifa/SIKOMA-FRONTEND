import React from 'react'
import { Link } from 'react-router-dom'

import DashboardLayout from '../../../layouts/DashboardLayout.jsx'
import api from '../../../lib/api.js'

const s = {
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '1rem',
  },

  card: {
    background: '#fff',
    border: '1px solid #e8e8e8',
    borderRadius: '12px',
    padding: '1.5rem',
  },

  sectionTitle: {
    fontSize: '13px',
    fontWeight: '700',
    color: '#1a5c35',
    textTransform: 'uppercase',
    letterSpacing: '0.07em',
    marginBottom: '1.25rem',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },

  dot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    background: '#1a5c35',
  },

  fieldLabel: {
    fontSize: '11px',
    fontWeight: '600',
    color: '#999',
    textTransform: 'uppercase',
    marginBottom: '5px',
    display: 'block',
  },

  fieldValue: {
    fontSize: '14px',
    color: '#1a1a1a',
    padding: '9px 12px',
    background: '#f8f9f8',
    border: '1px solid #efefef',
    borderRadius: '8px',
    minHeight: '38px',
    display: 'flex',
    alignItems: 'center',
  },

  roleBadge: {
    display: 'inline-block',
    padding: '4px 12px',
    borderRadius: '999px',
    fontSize: '12px',
    fontWeight: '600',
  },

  btnEdit: {
    background: '#1a5c35',
    color: '#fff',
    border: 'none',
    padding: '8px 18px',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '500',
    textDecoration: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '7px',
  },

  alertSuccess: {
    background: '#EAF3DE',
    color: '#3B6D11',
    border: '1px solid #c3e6a0',
    borderRadius: '10px',
    padding: '12px 16px',
    marginBottom: '1rem',
  },

  alertDanger: {
    background: '#FCEBEB',
    color: '#A32D2D',
    border: '1px solid #f5c0c0',
    borderRadius: '10px',
    padding: '12px 16px',
    marginBottom: '1rem',
  }
}

const roleMap = {
  admin_pusat: {
    label: 'Admin Pusat',
    bg: '#EAF3DE',
    color: '#3B6D11'
  },

  super_admin: {
    label: 'Super Admin',
    bg: '#FCEBEB',
    color: '#A32D2D'
  },
}

export default function Akun() {

  const [user, setUser] = React.useState({
    name: '',
    username: '',
    email: '',
    role: ''
  })

  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState('')
  const [success, setSuccess] = React.useState('')

  React.useEffect(() => {

    let mounted = true

    api.get('/admin_pusat/dashboard')

      .then(res => {

        if (mounted) {

          const userData =
            res.data.user ||
            res.data.data ||
            res.data ||
            {}

          setUser(userData)

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

  const roleInfo =
    roleMap[user.role] || {
      label: user.role || '-',
      bg: '#f0f0f0',
      color: '#888'
    }

  if (loading) {

    return (

      <DashboardLayout title="Akun">

        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '200px'
          }}
        >

          <div className="spinner-border text-success"></div>

        </div>

      </DashboardLayout>

    )

  }

  return (

    <DashboardLayout title="Akun">

      {/* HEADER */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          marginBottom: '1.5rem'
        }}
      >

        <Link
          to="/akun/edit"
          style={s.btnEdit}
        >

          <i className="fas fa-pen"></i>

          Edit Profil

        </Link>

      </div>

      {/* ALERT */}
      {error && (
        <div style={s.alertDanger}>
          {error}
        </div>
      )}

      {success && (
        <div style={s.alertSuccess}>
          {success}
        </div>
      )}

      {/* PROFILE */}
      <div style={s.grid}>

        <div style={s.card}>

          <div style={s.sectionTitle}>
            <span style={s.dot}></span>
            Profil Saya
          </div>

          {[
            { label: 'Nama', value: user.name || '-' },
            { label: 'Username', value: user.username || '-' },
            { label: 'Email', value: user.email || '-' },
          ].map(({ label, value }) => (

            <div key={label} style={{ marginBottom: '14px' }}>

              <label style={s.fieldLabel}>
                {label}
              </label>

              <div style={s.fieldValue}>
                {value}
              </div>

            </div>

          ))}

          <div>

            <label style={s.fieldLabel}>
              Role
            </label>

            <div style={s.fieldValue}>

              <span
                style={{
                  ...s.roleBadge,
                  background: roleInfo.bg,
                  color: roleInfo.color
                }}
              >

                {roleInfo.label}

              </span>

            </div>

          </div>

        </div>

        {/* PASSWORD CARD */}
        <div style={s.card}>

          <div style={s.sectionTitle}>
            <span style={s.dot}></span>
            Password
          </div>

          <label style={s.fieldLabel}>
            Password Saat Ini
          </label>

          <div
            style={{
              ...s.fieldValue,
              letterSpacing: '4px',
              color: '#bbb',
              fontSize: '18px'
            }}
          >

            ••••••••

          </div>

          <div
            style={{
              fontSize: '12px',
              color: '#bbb',
              marginTop: '10px'
            }}
          >

            Klik
            {' '}
            <strong style={{ color: '#1a5c35' }}>
              Edit Profil
            </strong>
            {' '}
            untuk mengganti password.

          </div>

        </div>

      </div>

    </DashboardLayout>

  )
}