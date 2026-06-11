import React from 'react'
import { Link } from 'react-router-dom'
import Template from '../../layouts/Template.jsx'
import { authService } from '../../services/authService.js'

export default function ResetPassword() {

  // ── State form ───────────────────────────────────────────────
  const [password, setPassword]                         = React.useState('')  // kata sandi baru
  const [password_confirmation, setPasswordConfirmation] = React.useState('')  // konfirmasi kata sandi
  const [showPassword, setShowPassword]                 = React.useState(false) // toggle tampil password

  // ── State UI ─────────────────────────────────────────────────
  const [message, setMessage] = React.useState('')    // pesan sukses
  const [error, setError]     = React.useState('')    // pesan error
  const [loading, setLoading] = React.useState(false) // status loading

  // ── Handler submit ───────────────────────────────────────────
  function onSubmit(e) {
    e.preventDefault()   // cegah reload halaman
    setLoading(true)     // aktifkan loading
    setError('')         // reset error
    setMessage('')       // reset pesan sukses

    // Ambil token dan email dari URL parameter (?token=...&email=...)
    const token = new URLSearchParams(window.location.search).get('token')
    const email = new URLSearchParams(window.location.search).get('email')

    authService.resetPassword({ token, email, password, password_confirmation })
      .then(() => setMessage('Kata sandi berhasil direset. Silakan login kembali.'))
      .catch(err => setError(err.response?.data?.message || 'Gagal mereset kata sandi.'))
      .finally(() => setLoading(false)) // matikan loading setelah selesai
  }

  // ── Render ───────────────────────────────────────────────────
  return (
    <Template title="Reset Kata Sandi">

      <section className="login-wrapper">

        <div className="login-left">
          <div className="login-box">

            {/* Judul */}
            <h1 className="login-title">Reset Kata Sandi</h1>

            {/* Subjudul */}
            <p className="login-subtitle">
              Masukkan kata sandi baru Anda di bawah ini.
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

              {/* ── Input Password Baru ── */}
              <div className="mb-3">
                <label className="form-label fw-semibold">Kata Sandi Baru</label>
                <div className="position-relative">
                  {/* type berubah antara "text" dan "password" sesuai showPassword */}
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="form-control login-input pe-5"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                  />
                  {/* Tombol toggle tampil/sembunyikan password */}
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                  </button>
                </div>
              </div>

              {/* ── Input Konfirmasi Password ── */}
              <div className="mb-3">
                <label className="form-label fw-semibold">Konfirmasi Kata Sandi</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-control login-input"
                  value={password_confirmation}
                  onChange={e => setPasswordConfirmation(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>

              {/* ── Tombol Simpan ── */}
              <button
                type="submit"
                className="btn-login"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Menyimpan...
                  </>
                ) : (
                  'Simpan Kata Sandi'
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
            alt="Ilustrasi Reset Kata Sandi"
            className="login-image"
            width={1058}
            height={733}
            loading="eager"
            decoding="async"
          />
        </div>

      </section>

    </Template>
  )
}
