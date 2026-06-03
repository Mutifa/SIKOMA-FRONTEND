import React from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import Swal from 'sweetalert2' 

import Template from '../../layouts/Template.jsx'
import { useAuth } from '../../contexts/AuthContext.jsx'

export default function Login() {

  // ── State form ──────────────────────────────────────────────
  const [email, setEmail]             = React.useState('')       // nilai input email
  const [password, setPassword]       = React.useState('')       // nilai input password
  const [showPassword, setShowPassword] = React.useState(false)  // toggle tampil/sembunyikan password
  const [rememberMe, setRememberMe]   = React.useState(false)   // status checkbox "Ingat Saya"

  // ── State UI ─────────────────────────────────────────────────
  const [error, setError]     = React.useState('')   // pesan error login
  const [loading, setLoading] = React.useState(false) // status loading saat proses login

  // ── Hooks ────────────────────────────────────────────────────
  const { login }    = useAuth()       // fungsi login dari AuthContext
  const navigate     = useNavigate()   // untuk redirect setelah login berhasil
  const location     = useLocation()   // untuk membaca halaman asal sebelum diarahkan ke login

  // Halaman tujuan setelah login — kembali ke halaman sebelumnya atau default ke /dashboard
  const from = location.state?.from?.pathname || '/dashboard'


  // ── Handler submit form ──────────────────────────────────────
  async function onSubmit(e) {

    e.preventDefault() // cegah reload halaman saat form disubmit

    setError('')        // reset pesan error
    setLoading(true)    // aktifkan loading spinner


    if (!email && !password) {
  setLoading(false)
  await Swal.fire({ icon: 'warning', title: 'Form Kosong', text: 'Email dan kata sandi wajib diisi.' })
  return
}
if (!email) {
  setLoading(false)
  await Swal.fire({ icon: 'warning', title: 'Email Kosong', text: 'Silakan masukkan email Anda.' })
  return
}
if (!password) {
  setLoading(false)
  await Swal.fire({ icon: 'warning', title: 'Kata Sandi Kosong', text: 'Silakan masukkan kata sandi Anda.' })
  return
}

    try {

      const result = await login(email, password) // panggil fungsi login

      if (result.success) {

        // Login berhasil → arahkan ke halaman tujuan
        navigate(result.redirect || from)

      } else {

        // Login gagal → tampilkan pesan error dari server
        setError(result.message)

      }

    } catch (err) {

      // Error tak terduga (jaringan, server down, dll)
      console.error(err)
      setError('Terjadi kesalahan saat login. Silakan coba lagi.')

    } finally {

      setLoading(false) // matikan loading spinner (berhasil maupun gagal)

    }
  }


  // ── Render ───────────────────────────────────────────────────
  return (

    <Template title="Login">

      <section className="login-wrapper">

        {/* ── KIRI: Form Login ── */}
        <div className="login-left">

          <div className="login-box">

            {/* Judul halaman */}
            <h1 className="login-title">
              Login
            </h1>

            {/* Subjudul */}
            <p className="login-subtitle">
              Silakan isi detail data Anda untuk mengakses akun.
            </p>

            {/* Pesan error — hanya muncul jika ada error */}
            {error && (
              <div className="alert alert-danger">
                {error}
              </div>
            )}

            <form onSubmit={onSubmit}>

              {/* ── Input Email ── */}
              <div className="mb-3">

                <label className="form-label fw-semibold">
                  Email
                </label>

                <input
                  type="email"
                  className="form-control login-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="contoh@email.com"
                  
                />

              </div>

              {/* ── Input Password ── */}
              <div className="mb-3">

                <label className="form-label fw-semibold">
                  Kata Sandi
                </label>

                <div className="position-relative">

                  {/* type berubah antara "text" dan "password" sesuai showPassword */}
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="form-control login-input pe-5"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    
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

              {/* ── Ingat Saya + Lupa Kata Sandi ── */}
              <div className="login-remember-row mb-4">

                <label className="login-remember-label">
                  <input
                    type="checkbox"
                    className="login-remember-check"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  Ingat Saya
                </label>

                <Link to="/forgot-password" className="forgot-link">
                  Lupa Kata Sandi?
                </Link>

              </div>

              {/* ── Tombol Masuk ── */}
              <button
                type="submit"
                className="btn-login"
                disabled={loading}
              >
                {loading ? (
                  <>
                    {/* Spinner muncul saat proses login berlangsung */}
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Memuat...
                  </>
                ) : (
                  'Masuk'
                )}
              </button>

            

            </form>

          </div>

        </div>

        {/* ── KANAN: Ilustrasi ── */}
        <div className="login-right">

          <img
            src="/img/login-illustration.png"
            alt="Ilustrasi Login"
            className="login-image"
          />

        </div>

      </section>

    </Template>

  )
}