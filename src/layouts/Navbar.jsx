import React from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext' 

export default function Navbar({ website }) {
  const FILE_URL = 'https://codemy.my.id'
  const { user, isAuthenticated, logout } = useAuth()

  const getProfileLink = () => {
    if (user?.role === 'admin_pusat') return '/admin_pusat/profile'
    if (user?.role === 'admin_lapangan') return '/admin_lapangan/profile'
    return '/dashboard'
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-light sticky-top">
      <div className="container">

        {/* Brand / Logo Start */}
        <Link to="/" className="navbar-brand d-flex align-items-center">
          <img
            src={
              website?.logo
                ? `${FILE_URL}/uploads/profil/${website.logo}?t=${Date.now()}`
                : `${FILE_URL}/uploads/profil/logo.png?t=${Date.now()}`
            }
            alt="Logo"
            style={{ width: 55, height: 55, objectFit: 'contain' }}
            className="me-2"
          />
          <span className="fw-semibold">
            {website?.nama || 'SIKOMA'}
          </span>
        </Link>
        {/* Brand / Logo End */}

        {/* Toggler Button Mobile */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navigation Links */}
        <div className="collapse navbar-collapse mobile-menu" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-lg-center mobile-nav">
            
            {/* 1. Dropdown: Profil Perusahaan (Sudah Diperbaiki) */}
            <li className="nav-item dropdown custom-hover-dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="/#struktur-organisasi" 
                role="button"
              >
                Profil
              </a>
              <ul className="dropdown-menu">
                <li>
                  <a href="/#struktur-organisasi" className="dropdown-item">
                    Struktur Organisasi
                  </a>
                </li>
                <li>
                  <a href="/#visi-misi" className="dropdown-item">
                    Visi Misi
                  </a>
                </li>
                <li>
                  <a href="/#sejarah" className="dropdown-item">
                    Sejarah UPT KPH Tasik Besar Serkap
                  </a>
                </li>
              </ul>
            </li>

            {/* Nav: Program */}
            <li className="nav-item">
              <NavLink
                to="/program"
                className={({ isActive }) =>
                  `nav-link ${isActive ? 'active' : ''}`
                }
              >
                Program
              </NavLink>
            </li>

            {/* 🔥 2. Dropdown: Informasi & Edukasi (SEKARANG SUDAH DIPERBAIKI)
                - Ditambahkan class 'custom-hover-dropdown' agar aktif saat di-hover
                - Dihapus data-bs-toggle agar link langsung berfungsi saat diklik
            */}
            <li className="nav-item dropdown custom-hover-dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="/informasi-edukasi#kawasan-konservasi"
                role="button"
              >
                Informasi & Edukasi
              </a>
              <ul className="dropdown-menu">
                <li>
                  <a href="/informasi-edukasi#kawasan-konservasi" className="dropdown-item">
                    Kawasan Konservasi
                  </a>
                </li>
                <li>
                  <a href="/informasi-edukasi#dilindungi" className="dropdown-item">
                    Jenis TSL Dilindungi
                  </a>
                </li>
                <li>
                  <a href="/informasi-edukasi#executive-summary" className="dropdown-item">
                    Executive Summary
                  </a>
                </li>
                <li>
                  <a href="/informasi-edukasi#peraturan" className="dropdown-item">
                    Peraturan
                  </a>
                </li>
              </ul>
            </li>

            {/* Nav: Standar Pelayanan */}
            <li className="nav-item">
              <NavLink
                to="/standar-pelayanan"
                className={({ isActive }) =>
                  `nav-link ${isActive ? 'active' : ''}`
                }
              >
                Standar Pelayanan
              </NavLink>
            </li>

            {/* Kondisional Menu Login / Akun User */}
            {!isAuthenticated ? (
              <li className="nav-item ms-lg-2 mt-2 mt-lg-0">
                <NavLink
                  to="/login"
                  className={({ isActive }) =>
                    `nav-link nav-login ${isActive ? 'active' : ''}`
                  }
                >
                  Login
                </NavLink>
              </li>
            ) : (
              <li className="nav-item dropdown ms-lg-2 mt-2 mt-lg-0">
                <a
                  className="nav-link dropdown-toggle nav-login text-center text-lg-start"
                  href="#"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  style={{ minWidth: '120px' }}
                >
                  <i className="fas fa-user-circle me-1"></i> {user?.nama || user?.name || 'User'}
                </a>
                <ul className="dropdown-menu dropdown-menu-end shadow-sm border-0">
                  <li>
                    <Link to="/dashboard" className="dropdown-item py-2">
                      <i className="fas fa-tachometer-alt text-muted me-2"></i> Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link to={getProfileLink()} className="dropdown-item py-2">
                      <i className="fas fa-user-cog text-muted me-2"></i> Profil Saya
                    </Link>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button 
                      onClick={logout} 
                      className="dropdown-item text-danger py-2"
                      style={{ cursor: 'pointer' }}
                    >
                      <i className="fas fa-sign-out-alt me-2"></i> Keluar
                    </button>
                  </li>
                </ul>
              </li>
            )}

          </ul>
        </div>

      </div>
    </nav>
  )
}