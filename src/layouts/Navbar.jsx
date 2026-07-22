import React from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'

function Navbar({ website }) {
  const FILE_URL = 'https://codemy.my.id'
  const [logoKey, setLogoKey] = React.useState(Date.now())
  const location = useLocation()
  const isProfilActive = location.pathname.startsWith('/profil')
  const isInformasiActive = location.pathname.startsWith('/informasi-edukasi')

// Gunakan useEffect untuk memperbarui logoKey saat website.logo berubah
  React.useEffect(() => {
    if (website?.logo) setLogoKey(Date.now())
  }, [website?.logo])

  // Tentukan sumber logo berdasarkan apakah website.logo tersedia atau tidak
  const logoSrc = website?.logo
    ? `${FILE_URL}/uploads/profil/${website.logo}?t=${logoKey}`
    : `${FILE_URL}/uploads/profil/logo.png`

    // Render Navbar
  return (
    <nav className="navbar navbar-expand-lg navbar-light sticky-top">
      <div className="container">

        {/* Brand / Logo Start */}
        <Link to="/" className="navbar-brand d-flex align-items-center">
          <img
            src={logoSrc}
            alt="Logo"
            width={55}
            height={55}
            loading="lazy"
            decoding="async"
            style={{ objectFit: 'contain' }}
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
            
            {/* 0. Beranda */}
            <li className="nav-item">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `nav-link ${isActive ? 'active' : ''}`
                }
              >
                Beranda
              </NavLink>
            </li>

            {/* 1. Dropdown: Profil Perusahaan (Sudah Diperbaiki) */}
            <li className="nav-item dropdown custom-hover-dropdown">
              <Link
                to="/profil/visi-misi"
                className={`nav-link dropdown-toggle ${isProfilActive ? 'active' : ''}`}
              >
                Profil
              </Link>
              <ul className="dropdown-menu">
                <li>
                  <NavLink to="/profil/visi-misi" className="dropdown-item">
                    Visi Misi
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/profil/sejarah" className="dropdown-item">
                    Sejarah 
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/profil/struktur-organisasi" className="dropdown-item">
                    Struktur Organisasi
                  </NavLink>
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
              <NavLink
                to="/informasi-edukasi/kawasan-konservasi"
                className={`nav-link dropdown-toggle ${isInformasiActive ? 'active' : ''}`}
              >
                Informasi & Edukasi
              </NavLink>
              <ul className="dropdown-menu">
                <li>
                  <NavLink to="/informasi-edukasi/kawasan-konservasi" className="dropdown-item">
                    Kawasan Konservasi
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/informasi-edukasi/jenis-tsl-dilindungi" className="dropdown-item">
                    Jenis TSL Dilindungi
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/informasi-edukasi/executive-summary" className="dropdown-item">
                    Executive Summary
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/informasi-edukasi/peraturan" className="dropdown-item">
                    Peraturan
                  </NavLink>
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

          </ul>
        </div>

      </div>
    </nav>
  )
}

export default React.memo(Navbar)
