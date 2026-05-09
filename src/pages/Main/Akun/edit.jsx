import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

import DashboardLayout from '../../../layouts/DashboardLayout.jsx'
import api from '../../../lib/api.js'

const s = {
  input: {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    fontSize: '14px',
    marginTop: '5px'
  },

  section: {
    background: '#fff',
    border: '1px solid #e8e8e8',
    borderRadius: '12px',
    padding: '24px',
    marginBottom: '1rem'
  },

  sectionTitle: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#1a5c35',
    marginBottom: '18px',
    textTransform: 'uppercase'
  },

  label: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#666'
  },

  buttonGroup: {
    display: 'flex',
    gap: '10px',
    marginTop: '1rem'
  }
}

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

          const userData =
            res.data.user ||
            res.data.data ||
            res.data ||
            {}

          setFormData({
            name: userData.name || '',
            username: userData.username || '',
            email: userData.email || '',
            role: userData.role || ''
          })

          setLoading(false)

        }

      })

      .catch(err => {

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

      await api.put(
        '/admin_pusat/profile',
        formData
      )

      const hasPasswordChange =
        passwordData.current_password ||
        passwordData.password ||
        passwordData.password_confirmation

      if (hasPasswordChange) {

        await api.put(
          '/password',
          passwordData
        )

      }

      setSuccess('Profil berhasil diperbarui')

      setTimeout(() => {
        navigate('/akun')
      }, 1000)

    } catch (err) {

      setError(
        err.response?.data?.message ||
        'Gagal memperbarui profil'
      )

    } finally {

      setSaving(false)

    }

  }

  if (loading) {

    return (

      <DashboardLayout title="Edit Akun">

        <div className="d-flex justify-content-center">
          <div className="spinner-border text-success"></div>
        </div>

      </DashboardLayout>

    )

  }

  return (

    <DashboardLayout title="Edit Akun">

      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      {success && (
        <div className="alert alert-success">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit}>

        {/* PROFILE */}
        <div style={s.section}>

          <div style={s.sectionTitle}>
            Informasi Profil
          </div>

          <div className="mb-3">

            <label style={s.label}>
              Nama
            </label>

            <input
              type="text"
              style={s.input}
              value={formData.name}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  name: e.target.value
                })
              }
              required
            />

          </div>

          <div className="mb-3">

            <label style={s.label}>
              Username
            </label>

            <input
              type="text"
              style={s.input}
              value={formData.username}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  username: e.target.value
                })
              }
              required
            />

          </div>

          <div className="mb-3">

            <label style={s.label}>
              Email
            </label>

            <input
              type="email"
              style={s.input}
              value={formData.email}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  email: e.target.value
                })
              }
              required
            />

          </div>

          <div className="mb-3">

            <label style={s.label}>
              Role
            </label>

            <input
              type="text"
              style={s.input}
              value={formData.role}
              readOnly
            />

          </div>

        </div>

        {/* PASSWORD */}
        <div style={s.section}>

          <div style={s.sectionTitle}>
            Ubah Password
          </div>

          <div className="mb-3">

            <label style={s.label}>
              Password Lama
            </label>

            <input
              type="password"
              style={s.input}
              value={passwordData.current_password}
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  current_password: e.target.value
                })
              }
            />

          </div>

          <div className="mb-3">

            <label style={s.label}>
              Password Baru
            </label>

            <input
              type="password"
              style={s.input}
              value={passwordData.password}
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  password: e.target.value
                })
              }
            />

          </div>

          <div className="mb-3">

            <label style={s.label}>
              Konfirmasi Password Baru
            </label>

            <input
              type="password"
              style={s.input}
              value={passwordData.password_confirmation}
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  password_confirmation: e.target.value
                })
              }
            />

          </div>

        </div>

        {/* BUTTON */}
        <div style={s.buttonGroup}>

          <button
            type="submit"
            className="btn btn-success"
            disabled={saving}
          >

            {saving ? 'Menyimpan...' : 'Simpan'}

          </button>

          <Link
            to="/akun"
            className="btn btn-secondary"
          >
            Kembali
          </Link>

        </div>

      </form>

    </DashboardLayout>

  )
}