import React from 'react'
import Template from '../../layouts/Template.jsx'
import api from '../../lib/api.js'

export default function Register() {
  const [nama, setNama] = React.useState('')
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [error, setError] = React.useState('')

  function onSubmit(e) {
    e.preventDefault()
    setError('')
    api.post('/api/auth/register', { name: nama, email, password })
      .then(() => window.location.href = '/login')
      .catch(err => setError(err.response?.data?.message || 'Register gagal'))
  }
  return (
    <Template title="Register">
      <section className="container py-5" style={{maxWidth:480}}>
        <h1 className="mb-4">Register</h1>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={onSubmit}>
          <div className="mb-3">
            <label className="form-label">Nama</label>
            <input type="text" className="form-control" value={nama} onChange={e=>setNama(e.target.value)} />
          </div>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input type="email" className="form-control" value={email} onChange={e=>setEmail(e.target.value)} />
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input type="password" className="form-control" value={password} onChange={e=>setPassword(e.target.value)} />
          </div>
          <button type="submit" className="btn btn-primary w-100">Daftar</button>
        </form>
      </section>
    </Template>
  )
}


