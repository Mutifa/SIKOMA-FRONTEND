import React from 'react'
import AdminPusatLayout from '../../layouts/AdminPusatLayout.jsx'
import api from '../../lib/api.js'

const s = {
  pageTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: '2px',
  },
  breadcrumb: {
    fontSize: '13px',
    color: '#888',
    marginBottom: '1.5rem',
  },
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
    flexShrink: 0,
  },
  fieldLabel: {
    fontSize: '11px',
    fontWeight: '600',
    color: '#999',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
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
  input: {
    width: '100%',
    padding: '9px 12px',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    fontSize: '14px',
    color: '#1a1a1a',
    background: '#fff',
    outline: 'none',
    boxSizing: 'border-box',
  },
  inputDisabled: {
    width: '100%',
    padding: '9px 12px',
    border: '1px solid #efefef',
    borderRadius: '8px',
    fontSize: '14px',
    color: '#888',
    background: '#f8f8f8',
    boxSizing: 'border-box',
    display: 'flex',
    alignItems: 'center',
    minHeight: '38px',
  },
  inputGroup: {
    display: 'flex',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    overflow: 'hidden',
  },
  inputGroupField: {
    flex: 1,
    padding: '9px 12px',
    border: 'none',
    fontSize: '14px',
    color: '#1a1a1a',
    outline: 'none',
    background: '#fff',
  },
  inputGroupBtn: {
    padding: '0 14px',
    border: 'none',
    background: '#f5f5f5',
    color: '#666',
    cursor: 'pointer',
    borderLeft: '1px solid #e0e0e0',
    fontSize: '13px',
  },
  fieldHint: {
    fontSize: '12px',
    color: '#bbb',
    marginTop: '5px',
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
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '7px',
  },
  btnSave: {
    background: '#1a5c35',
    color: '#fff',
    border: 'none',
    padding: '9px 20px',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '500',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '7px',
  },
  btnCancel: {
    background: '#f5f5f5',
    color: '#444',
    border: '1px solid #e0e0e0',
    padding: '9px 20px',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '500',
    cursor: 'pointer',
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
    fontSize: '14px',
    marginBottom: '1rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '8px',
  },
  alertDanger: {
    background: '#FCEBEB',
    color: '#A32D2D',
    border: '1px solid #f5c0c0',
    borderRadius: '10px',
    padding: '12px 16px',
    fontSize: '14px',
    marginBottom: '1rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '8px',
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px',
    color: 'inherit',
    opacity: 0.6,
    lineHeight: 1,
    padding: '0 2px',
  },
  // Modal styles
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 1050,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1rem',
  },
  modalDialog: {
    background: '#fff',
    borderRadius: '14px',
    width: '100%',
    maxWidth: '700px',
    maxHeight: '90vh',
    overflowY: 'auto',
    boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
  },
  modalHeader: {
    background: '#1a5c35',
    color: '#fff',
    padding: '1rem 1.5rem',
    borderRadius: '14px 14px 0 0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalTitle: {
    fontSize: '15px',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    margin: 0,
  },
  modalCloseBtn: {
    background: 'none',
    border: 'none',
    color: '#fff',
    fontSize: '20px',
    cursor: 'pointer',
    lineHeight: 1,
    opacity: 0.8,
    padding: '2px 6px',
  },
  modalBody: {
    padding: '1.5rem',
  },
  modalFooter: {
    padding: '1rem 1.5rem',
    borderTop: '1px solid #f0f0f0',
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
  },
  modalSectionTitle: {
    fontSize: '12px',
    fontWeight: '700',
    color: '#1a5c35',
    textTransform: 'uppercase',
    letterSpacing: '0.07em',
    marginBottom: '1rem',
    marginTop: '0.25rem',
    display: 'flex',
    alignItems: 'center',
    gap: '7px',
  },
  divider: {
    border: 'none',
    borderTop: '1px solid #f0f0f0',
    margin: '1.25rem 0',
  },
}

const roleMap = {
  admin_pusat: { label: 'Admin Pusat', bg: '#EAF3DE', color: '#3B6D11' },
  super_admin: { label: 'Super Admin', bg: '#FCEBEB', color: '#A32D2D' },
}

export default function Akun() {
  const [user, setUser] = React.useState({ name: '', username: '', email: '', role: '' })
  const [editUser, setEditUser] = React.useState({ name: '', username: '', email: '', role: '' })
  const [passwordData, setPasswordData] = React.useState({
    current_password: '', password: '', password_confirmation: ''
  })
  const [loading, setLoading] = React.useState(true)
  const [saving, setSaving] = React.useState(false)
  const [error, setError] = React.useState('')
  const [success, setSuccess] = React.useState('')
  const [showModal, setShowModal] = React.useState(false)
  const [showPasswords, setShowPasswords] = React.useState({
    current: false, new: false, confirm: false
  })

 React.useEffect(() => {
  let mounted = true
  api.get('/admin_pusat/dashboard')
    .then(res => {
      if (mounted) {
        console.log('FULL RESPONSE:', res.data)  // ← lihat ini di console
        const userData = res.data.user || res.data.data || res.data || {}
        console.log('userData:', userData)
        setUser(userData)
        setEditUser(userData)
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

  const handleOpenModal = () => {
    setEditUser({ ...user })
    setPasswordData({ current_password: '', password: '', password_confirmation: '' })
    setError('')
    setSuccess('')
    setShowPasswords({ current: false, new: false, confirm: false })
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSuccess('')

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
      const profileRes = await api.put('/admin_pusat/profile', editUser)
      const updatedUser = profileRes.data.user || editUser
      setUser(updatedUser)
      setEditUser(updatedUser)

      if (hasPasswordChange) {
        await api.put('/password', passwordData)
        setPasswordData({ current_password: '', password: '', password_confirmation: '' })
      }

      setSuccess('Data akun berhasil diperbarui')
      setShowModal(false)
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal memperbarui data akun')
    } finally {
      setSaving(false)
    }
  }

  const roleInfo = roleMap[user.role] || { label: user.role || '-', bg: '#f0f0f0', color: '#888' }

  if (loading) {
    return (
      <AdminPusatLayout title="Akun">
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
          <div className="spinner-border text-success" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </AdminPusatLayout>
    )
  }

  return (
    <AdminPusatLayout title="Akun">

      {/* ── Header ── */}
     <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
  <button style={s.btnEdit} onClick={handleOpenModal}>
    <i className="fas fa-pen" style={{ fontSize: '11px' }}></i> Edit Profil
  </button>
</div>

      {/* ── Alerts ── */}
      {error && !showModal && (
        <div style={s.alertDanger}>
          <span><i className="fas fa-exclamation-circle" style={{ marginRight: 8 }}></i>{error}</span>
          <button style={s.closeBtn} onClick={() => setError('')}>×</button>
        </div>
      )}
      {success && (
        <div style={s.alertSuccess}>
          <span><i className="fas fa-check-circle" style={{ marginRight: 8 }}></i>{success}</span>
          <button style={s.closeBtn} onClick={() => setSuccess('')}>×</button>
        </div>
      )}

      {/* ══════════════════════════════
          VIEW MODE — read-only cards
      ══════════════════════════════ */}
      <div style={s.grid}>
        {/* Profil Card */}
        <div style={s.card}>
          <div style={s.sectionTitle}>
            <span style={s.dot}></span>Profil Saya
          </div>
          {[
            { label: 'Nama', value: user.name || '-' },
            { label: 'Username', value: user.username || '-' },
            { label: 'Email', value: user.email || '-' },
          ].map(({ label, value }) => (
            <div key={label} style={{ marginBottom: '14px' }}>
              <label style={s.fieldLabel}>{label}</label>
              <div style={s.fieldValue}>{value}</div>
            </div>
          ))}
          <div>
            <label style={s.fieldLabel}>Role</label>
            <div style={s.inputDisabled}>
              <span style={{ ...s.roleBadge, background: roleInfo.bg, color: roleInfo.color }}>
                {roleInfo.label}
              </span>
            </div>
            <div style={s.fieldHint}>Role tidak dapat diubah.</div>
          </div>
        </div>

        {/* Password Card (view) */}
        <div style={s.card}>
          <div style={s.sectionTitle}>
            <span style={s.dot}></span>Password
          </div>
          <label style={s.fieldLabel}>Password Saat Ini</label>
          <div style={{ ...s.fieldValue, letterSpacing: '4px', color: '#bbb', fontSize: '18px' }}>
            ••••••••
          </div>
          <div style={{ fontSize: '12px', color: '#bbb', marginTop: '10px' }}>
            Klik <strong style={{ color: '#1a5c35' }}>Edit Profil</strong> untuk mengganti password.
          </div>
        </div>
      </div>

      {/* ══════════════════════════════
          MODAL EDIT
      ══════════════════════════════ */}
      {showModal && (
        <div style={s.modalOverlay} onClick={(e) => { if (e.target === e.currentTarget) handleCloseModal() }}>
          <div style={s.modalDialog}>
            {/* Modal Header */}
            <div style={s.modalHeader}>
              <h5 style={s.modalTitle}>
                <i className="fas fa-user-edit"></i> Edit Profil
              </h5>
              <button style={s.modalCloseBtn} onClick={handleCloseModal} type="button">×</button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit}>
              <div style={s.modalBody}>

                {/* Error inside modal */}
                {error && (
                  <div style={s.alertDanger}>
                    <span><i className="fas fa-exclamation-circle" style={{ marginRight: 8 }}></i>{error}</span>
                    <button style={s.closeBtn} onClick={() => setError('')} type="button">×</button>
                  </div>
                )}

                {/* ─ Profil Section ─ */}
                <div style={s.modalSectionTitle}>
                  <span style={s.dot}></span>Informasi Profil
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
                  <div>
                    <label style={s.fieldLabel}>Nama</label>
                    <input
                      style={s.input}
                      type="text"
                      value={editUser.name}
                      onChange={e => setEditUser({ ...editUser, name: e.target.value })}
                      placeholder="Nama lengkap"
                      required
                    />
                  </div>
                  <div>
                    <label style={s.fieldLabel}>Username</label>
                    <input
                      style={s.input}
                      type="text"
                      value={editUser.username}
                      onChange={e => setEditUser({ ...editUser, username: e.target.value })}
                      placeholder="Username"
                      required
                    />
                  </div>
                </div>

                <div style={{ marginTop: '14px' }}>
                  <label style={s.fieldLabel}>Email</label>
                  <input
                    style={s.input}
                    type="email"
                    value={editUser.email || ''}
                    onChange={e => setEditUser({ ...editUser, email: e.target.value })}
                    placeholder="Email"
                    required
                  />
                </div>

                <div style={{ marginTop: '14px' }}>
                  <label style={s.fieldLabel}>Role</label>
                  <div style={s.inputDisabled}>
                    <span style={{ ...s.roleBadge, background: roleInfo.bg, color: roleInfo.color }}>
                      {roleInfo.label}
                    </span>
                  </div>
                  <div style={s.fieldHint}>Role tidak dapat diubah.</div>
                </div>

                <hr style={s.divider} />

                {/* ─ Password Section ─ */}
                <div style={s.modalSectionTitle}>
                  <span style={s.dot}></span>Ubah Password
                </div>
                <div style={{ fontSize: '12px', color: '#aaa', marginBottom: '1rem' }}>
                  Kosongkan semua field jika tidak ingin mengganti password.
                </div>

                {[
                  { label: 'Password Lama', key: 'current_password', show: 'current' },
                  { label: 'Password Baru', key: 'password', show: 'new' },
                  { label: 'Konfirmasi Password Baru', key: 'password_confirmation', show: 'confirm' },
                ].map(({ label, key, show }) => (
                  <div key={key} style={{ marginBottom: '14px' }}>
                    <label style={s.fieldLabel}>{label}</label>
                    <div style={s.inputGroup}>
                      <input
                        style={s.inputGroupField}
                        type={showPasswords[show] ? 'text' : 'password'}
                        value={passwordData[key]}
                        onChange={e => setPasswordData({ ...passwordData, [key]: e.target.value })}
                        placeholder={label}
                      />
                      <button
                        type="button"
                        style={s.inputGroupBtn}
                        onClick={() => setShowPasswords({ ...showPasswords, [show]: !showPasswords[show] })}
                      >
                        <i className={`fas ${showPasswords[show] ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Modal Footer */}
              <div style={s.modalFooter}>
                <button type="button" style={s.btnCancel} onClick={handleCloseModal}>
                  <i className="fas fa-times" style={{ fontSize: '11px' }}></i> Batal
                </button>
                <button
                  type="submit"
                  style={saving ? { ...s.btnSave, opacity: 0.6, cursor: 'not-allowed' } : s.btnSave}
                  disabled={saving}
                >
                  <i className="fas fa-save" style={{ fontSize: '12px' }}></i>
                  {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </AdminPusatLayout>
  )
}