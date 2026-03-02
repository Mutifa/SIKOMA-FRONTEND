import React from 'react'
import Template from '../../layouts/Template.jsx'
import api from '../../lib/api.js'

export default function ResetPassword() {
  const [password, setPassword] = React.useState('')
  const [password_confirmation, setPasswordConfirmation] = React.useState('')
  const [message, setMessage] = React.useState('')
  const [error, setError] = React.useState('')

  function onSubmit(e) {
    e.preventDefault()
    setError(''); setMessage('')
    // token reset diambil dari URL search param ?token=
    const token = new URLSearchParams(window.location.search).get('token')
    const email = new URLSearchParams(window.location.search).get('email')
    api.post('/api/auth/reset-password', { token, email, password, password_confirmation })
      .then(() => setMessage('Password berhasil direset.'))
      .catch(err => setError(err.response?.data?.message || 'Gagal reset password'))
  }
  return (
    <Template title="Reset Password">
      <section className="container py-5" style={{maxWidth:480}}>
        <h1 className="mb-4">Reset Password</h1>
        {message && <div className="alert alert-success">{message}</div>}
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={onSubmit}>
          <div className="mb-3">
            <label className="form-label">Password Baru</label>
            <input type="password" className="form-control" value={password} onChange={e=>setPassword(e.target.value)} />
          </div>
          <div className="mb-3">
            <label className="form-label">Konfirmasi Password</label>
            <input type="password" className="form-control" value={password_confirmation} onChange={e=>setPasswordConfirmation(e.target.value)} />
          </div>
          <button type="submit" className="btn btn-primary w-100">Simpan</button>
        </form>
      </section>
    </Template>
  )
}


