import React from 'react'
import Template from '../../layouts/Template.jsx'
import api from '../../lib/api.js'

export default function ForgotPassword() {
  const [email, setEmail] = React.useState('')
  const [message, setMessage] = React.useState('')
  const [error, setError] = React.useState('')

  function onSubmit(e) {
    e.preventDefault()
    setError(''); setMessage('')
    api.post('/api/auth/forgot-password', { email })
      .then(() => setMessage('Link reset telah dikirim ke email.'))
      .catch(err => setError(err.response?.data?.message || 'Gagal mengirim link reset'))
  }
  return (
    <Template title="Lupa Password">
      <section className="container py-5" style={{maxWidth:480}}>
        <h1 className="mb-4">Lupa Password</h1>
        {message && <div className="alert alert-success">{message}</div>}
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={onSubmit}>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input type="email" className="form-control" value={email} onChange={e=>setEmail(e.target.value)} />
          </div>
          <button type="submit" className="btn btn-primary w-100">Kirim Link Reset</button>
        </form>
      </section>
    </Template>
  )
}


