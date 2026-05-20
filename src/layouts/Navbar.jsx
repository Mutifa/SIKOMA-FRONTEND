import React from 'react'
import { Link, NavLink } from 'react-router-dom'

export default function Navbar({ website }) {

  const FILE_URL = 'https://codemy.my.id'
    console.log(website)
  return (
    <nav className="navbar navbar-expand-lg navbar-light sticky-top">
      <div className="container">

<Link to="/" className="navbar-brand d-flex align-items-center">
  <img
    src={
      website?.logo
        ? `${FILE_URL}/img/${website.logo}`
        : `${FILE_URL}/img/logo.jpg`
    }
    alt="Logo"
    style={{ width: 40, height: 40, objectFit: 'contain' }}
    className="me-2"
  />
          <span className="fw-semibold">
            {website?.nama || 'SIKOMA'}
          </span>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse mobile-menu" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-lg-center mobile-nav">
            <li className="nav-item dropdown">

              <a
                className="nav-link dropdown-toggle"
                href="/#struktur-organisasi"
              >
                Profil
              </a>

              <ul className="dropdown-menu">

                <li>
                  <a
                    href="/#struktur-organisasi"
                    className="dropdown-item"
                  >
                    Struktur Organisasi
                  </a>
                </li>

                <li>
                  <a
                    href="/#visi-misi"
                    className="dropdown-item"
                  >
                    Visi Misi
                  </a>
                </li>

                <li>
                  <a
                    href="/#sejarah"
                    className="dropdown-item"
                  >
                    Sejarah UPT KPH Tasik Besar Serkap
                  </a>
                </li>

              </ul>

            </li>

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

            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="/informasi-edukasi#kawasan-konservasi"
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
