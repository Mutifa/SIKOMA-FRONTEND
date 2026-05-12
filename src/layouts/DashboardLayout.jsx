import React from 'react'

// Link → navigasi halaman
// useLocation → membaca route/url aktif sekarang
import { Link, useLocation } from 'react-router-dom'

// Mengambil data login dari AuthContext
import { useAuth } from '../contexts/AuthContext.jsx'

// Import CSS dashboard universal
import '../assets/css/Dashboard.css'


// =====================================================
// DASHBOARD LAYOUT
// =====================================================
// Layout universal dashboard untuk:
// - Admin Pusat
// - Admin Lapangan
//
// Layout ini dipakai oleh semua halaman dashboard:
// Program, Pengguna, Konten, Laporan, dll.
// =====================================================
export default function DashboardLayout({
  children,
  title = "Admin Pusat"
}) {

  // ===================================================
  // useLocation()
  // ===================================================
  // Digunakan untuk membaca route aktif sekarang
  // Contoh:
  // /dashboard
  // /program
  // /pengguna
  //
  // Dipakai untuk memberi class "active"
  // pada sidebar menu
  // ===================================================
  const location = useLocation()


  // ===================================================
  // useAuth()
  // ===================================================
  // Mengambil:
  // - data user login
  // - function logout
  // ===================================================
  const { user, logout } = useAuth()


  // DEBUG ROLE USER
  console.log('USER LOGIN:', user)
  console.log('ROLE:', user?.role)


  // ===================================================
  // STATE SIDEBAR MOBILE
  // ===================================================
  // Digunakan untuk:
  // buka/tutup sidebar di mobile
  // ===================================================
  const [sidebarOpen, setSidebarOpen] =
    React.useState(false)


  // ===================================================
  // ROLE CHECK
  // ===================================================
  // Mengecek role user login
  // agar sidebar berbeda:
  //
  // Admin Pusat:
  // - semua menu
  //
  // Admin Lapangan:
  // - dashboard
  // - laporan
  // - akun
  // ===================================================
  const isAdminPusat =
    user?.role === 'admin_pusat' ||
    user?.role === 'AdminPusat' ||
    user?.role === 'super_admin' ||
    user?.role === 'Super Admin'

  const isAdminLapangan =
    user?.role === 'admin_lapangan' ||
    user?.role === 'AdminLapangan'


  // DEBUG
  console.log('isAdminPusat:', isAdminPusat)
  console.log('isAdminLapangan:', isAdminLapangan)


  // ===================================================
  // MENU SIDEBAR
  // ===================================================
  // Menu dibedakan berdasarkan role
  // ===================================================
  let menuItems = []

  // ===================================================
  // MENU ADMIN PUSAT
  // ===================================================
  if (isAdminPusat) {

    menuItems = [

      {
        to: '/dashboard',
        icon: 'fa-home',
        label: 'Dashboard'
      },

      {
        to: '/pengguna',
        icon: 'fa-users',
        label: 'Pengguna'
      },

      {
        to: '/profil-perusahaan',
        icon: 'fa-building',
        label: 'Profil Perusahaan'
      },

      {
        to: '/program',
        icon: 'fa-list-ul',
        label: 'Program'
      },

      {
        to: '/konten',
        icon: 'fa-newspaper',
        label: 'Konten Informasi & Edukasi'
      },

      {
        to: '/kawasan',
        icon: 'fa-map-marker-alt',
        label: 'Kawasan Konservasi'
      },

      {
        to: '/peraturan',
        icon: 'fa-gavel',
        label: 'Peraturan'
      },

      {
        to: '/standar-pelayanan',
        icon: 'fa-clipboard-list',
        label: 'Standar Pelayanan'
      },

      {
        to: '/galeri',
        icon: 'fa-images',
        label: 'Galeri'
      },

      {
        to: '/laporan-konservasi',
        icon: 'fa-file-lines',
        label: 'Laporan Konservasi'
      },

      {
        to: '/akun',
        icon: 'fa-user-cog',
        label: 'Akun'
      },

    ]

  } else {

    // =================================================
    // MENU ADMIN LAPANGAN
    // =================================================
    menuItems = [

      {
        to: '/dashboard',
        icon: 'fa-home',
        label: 'Dashboard'
      },

      {
        to: '/laporan-konservasi',
        icon: 'fa-file-lines',
        label: 'Laporan Konservasi'
      },

      {
        to: '/akun',
        icon: 'fa-user-cog',
        label: 'Akun'
      },

    ]

  }


  // ===================================================
  // LOAD CKEDITOR
  // ===================================================
  // Digunakan untuk editor text rich text
  // ===================================================
  React.useEffect(() => {

    const script = document.createElement('script')

    script.src =
      'https://cdn.ckeditor.com/4.22.1/standard/ckeditor.js'

    script.async = true

    document.head.appendChild(script)

    return () => {

      if (document.head.contains(script)) {
        document.head.removeChild(script)
      }

    }

  }, [])


  // ===================================================
  // TUTUP SIDEBAR SAAT PINDAH HALAMAN
  // ===================================================
  // Digunakan di mobile
  // ===================================================
  React.useEffect(() => {

    setSidebarOpen(false)

  }, [location.pathname])


  // ===================================================
  // LOGOUT
  // ===================================================
  const handleLogout = async () => {

    await logout()

  }


  // ===================================================
  // RENDER LAYOUT
  // ===================================================
  return (

    <div id="main-wrapper">

      {/* ============================================
          OVERLAY MOBILE
      ============================================ */}
      <div
        className={`sidebar-overlay ${sidebarOpen ? 'visible' : ''}`}
        onClick={() => setSidebarOpen(false)}
      />


      {/* ============================================
          TOPBAR
      ============================================ */}
      <header className="topbar">

        <nav className="navbar top-navbar navbar-expand-md navbar-dark">

          {/* Logo */}
          <div className="topbar-brand">

            <img
              src="/img/logo.png"
              alt="logo"
            />

            <span>SIKOMA</span>

          </div>

          {/* Tombol buka sidebar mobile */}
          <button
            type="button"
            className="nav-toggler"
            onClick={() =>
              setSidebarOpen(prev => !prev)
            }
          >

            <i className={`fas ${sidebarOpen ? 'fa-times' : 'fa-bars'}`}></i>

          </button>


          {/* USER INFO */}
          <div className="navbar-collapse collapse">

            <ul className="navbar-nav ms-auto d-flex align-items-center me-3">

              <li>

                <div className="user-info">

                  {/* Foto user */}
                  <img
                    className="img-circle"
                    src="/img/user.png"
                    alt="user"
                    width="36"
                    height="36"
                  />

                  {/* Nama & Email */}
                  <div>

                    <div className="name">
                      {user?.name || 'Admin'}
                    </div>

                    <div className="email">
                      {user?.email || 'admin@email.com'}
                    </div>

                  </div>

                  {/* Logout */}
                  <i
                    className="fas fa-sign-out-alt logout-icon"
                    onClick={handleLogout}
                  ></i>

                </div>

              </li>

            </ul>

          </div>

        </nav>

      </header>


      {/* ============================================
          SIDEBAR
      ============================================ */}
      <aside className={`left-sidebar ${sidebarOpen ? 'open' : ''}`}>

        <div className="scroll-sidebar">

          {/* Logo */}
          <div className="sidebar-header-pusat horizontal">

            <img
              src="/img/logo.png"
              alt="logo"
            />

            <span>SIKOMA</span>

          </div>


          {/* MENU */}
          <nav className="sidebar-nav">

            <ul id="sidebarnav">

              {menuItems.map((item) => (

                <li
                  className="sidebar-item"
                  key={item.to}
                >

                  <Link
                    className={`sidebar-link ${location.pathname === item.to ? 'active' : ''}`}
                    to={item.to}
                  >

                    {/* Icon */}
                    <i className={`fas ${item.icon}`}></i>

                    {/* Nama menu */}
                    <span className="hide-menu">
                      {item.label}
                    </span>

                  </Link>

                </li>

              ))}

              {/* LOGOUT */}
              <li className="sidebar-item logout-item">

                <a
                  className="sidebar-link"
                  href="#"
                  onClick={handleLogout}
                >

                  <i className="fas fa-sign-out-alt"></i>

                  <span className="hide-menu">
                    Logout
                  </span>

                </a>

              </li>

            </ul>

          </nav>

        </div>

      </aside>


      {/* ============================================
          CONTENT
      ============================================ */}
      <div className="page-wrapper">

        {/* BREADCRUMB */}
        <div className="page-breadcrumb">

          <div className="row align-items-center">

            <div className="col-md-6 col-8 align-self-center">

              {/* Title halaman */}
              <h3 className="page-title">
                {title}
              </h3>

              {/* Breadcrumb */}
              <nav aria-label="breadcrumb">

                <ol className="breadcrumb">

                  <li className="breadcrumb-item">
                    <a href="#">
                      Home
                    </a>
                  </li>

                  <li
                    className="breadcrumb-item active"
                    aria-current="page"
                  >
                    {title}
                  </li>

                </ol>

              </nav>

            </div>

          </div>

        </div>


        {/* ============================================
            ISI HALAMAN
        ============================================ */}
        <div className="container-fluid">

          {/* children = isi page */}
          {children}

        </div>


        {/* ============================================
            FOOTER
        ============================================ */}
        <footer className="footer">

          © 2026 SIKOMA.
          All rights reserved.

        </footer>

      </div>

    </div>

  )

}

