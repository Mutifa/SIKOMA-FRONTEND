import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Template from '../../layouts/Template.jsx'
import { useAuth } from '../../contexts/AuthContext.jsx'
import api from '../../lib/api.js'

export default function Login() {
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [error, setError] = React.useState('')
  const [loading, setLoading] = React.useState(false)
  
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  
  const from = location.state?.from?.pathname || '/'


 async function onSubmit(e) {
  e.preventDefault()
  setError('')
  setLoading(true)

  try {
    const result = await login(email, password)

    if (result.success) {
      window.location.href = result.redirect
    } else {
      setError(result.message)
    }

  } catch (err) {
    console.error(err)
    setError('Terjadi kesalahan saat login')
  } finally {
    setLoading(false)
  }
}
  return (
    <Template title="Login">
      <section className="container py-5" style={{maxWidth:480}}>
        <h1 className="mb-4">Login</h1>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={onSubmit}>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input type="email" className="form-control" value={email} onChange={e=>setEmail(e.target.value)} />
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input type="password" className="form-control" value={password} onChange={e=>setPassword(e.target.value)} />
          </div>
          <button type="submit" className="btn btn-primary w-100" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Loading...
              </>
            ) : (
              'Masuk'
            )}
          </button>
        </form>
      </section>
    </Template>
  )
}


