import React from 'react'
import { Link } from 'react-router-dom'
import Template from '../../layouts/Template.jsx'

export default function VerifyEmail() {

  // ── Render ───────────────────────────────────────────────────
  return (
    <Template title="Verifikasi Email">

      <section className="login-wrapper">

        <div className="login-left">
          <div className="login-box">

            {/* Ikon email */}
            <div className="mb-4" style={{ fontSize: '56px', color: 'var(--primary-green)' }}>
              <i className="fas fa-envelope-open-text"></i>
            </div>

            {/* Judul */}
            <h1 className="login-title">Verifikasi Email</h1>

            {/* Subjudul */}
            <p className="login-subtitle">
              Satu langkah lagi! Cek email Anda untuk menyelesaikan pendaftaran.
            </p>

            {/* Pesan info */}
            <div className="alert alert-info">
              Kami telah mengirim link verifikasi ke email Anda.
              <br />
              Silakan cek inbox atau folder spam.
            </div>

            {/* ── Tombol kembali ke Login ── */}
            <Link to="/login" className="btn-login d-block text-center text-decoration-none mt-4">
              Kembali ke Login
            </Link>

          </div>
        </div>

        {/* ── Kanan: Ilustrasi ── */}
        <div className="login-right">
          <img
            src="/img/login-illustration.png"
            alt="Ilustrasi Verifikasi Email"
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
