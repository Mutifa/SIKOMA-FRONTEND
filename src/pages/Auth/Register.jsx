import React from 'react'
import { Link } from 'react-router-dom'
import Template from '../../layouts/Template.jsx'
import api from '../../lib/api.js'

export default function ForgotPassword() {

  // ── State ────────────────────────────────────────────────────
  const [email, setEmail]     = React.useState('')   // nilai input email
  const [message, setMessage] = React.useState('')   // pesan sukses
  const [error, setError]     = React.useState('')   // pesan error
  const [loading, setLoading] = React.useState(false) // status loading

  // ── Handler submit ───────────────────────────────────────────
  function onSubmit(e) {
    e.preventDefault()             // cegah reload halaman
    setError('')                   // reset error
    setMessage('')                 // reset pesan sukses
    setLoading(true)               // aktifkan loading

    api.post('/auth/forgot-password', { email })
      .then(() => setMessage('Link reset telah dikirim ke email Anda.'))
      .catch(err => setError(err.response?.data?.message || 'Gagal mengirim link reset.'))
      .finally(() => setLoading(false)) // matikan loading setelah selesai
  }

  // ── Render ───────────────────────────────────────────────────
  return (
    <Template title="Lupa Kata Sandi">

      <section className="login-wrapper">

        <div className="login-left">
          <div className="login-box">

            {/* Judul */}
            <h1 className="login-title">Lupa Kata Sandi</h1>

            {/* Subjudul */}
            <p className="login-subtitle">
              Masukkan email Anda dan kami akan mengirimkan link untuk mereset kata sandi.
            </p>

            {/* Pesan sukses */}
            {message && (
              <div className="alert alert-success">{message}</div>
            )}

            {/* Pesan error */}
            {error && (
              <div className="alert alert-danger">{error}</div>
            )}

            <form onSubmit={onSubmit}>

              {/* ── Input Email ── */}
              <div className="mb-3">
                <label className="form-label fw-semibold">Email</label>
                <input
                  type="email"
                  className="form-control login-input"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="contoh@email.com"
                  required
                />
              </div>

              {/* ── Tombol Kirim ── */}
              <button
                type="submit"
                className="btn-login"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Mengirim...
                  </>
                ) : (
                  'Kirim Link Reset'
                )}
              </button>

              {/* ── Link kembali ke Login ── */}
              <div className="text-center mt-4">
                <Link to="/login" className="applicant-link">
                  Kembali ke Login
                </Link>
              </div>

            </form>

          </div>
        </div>

        {/* ── Kanan: Ilustrasi ── */}
        <div className="login-right">
          <img
            src="/img/login-illustration.png"
            alt="Ilustrasi Lupa Kata Sandi"
            className="login-image"
          />
        </div>

      </section>

    </Template>
  )
}