import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext.jsx'
import '../assets/css/Dashboard.css'


export default function DashboardLayout({ children, title = "Admin Pusat" }) {

  const location = useLocation()
  const { user, logout } = useAuth()
  console.log('USER LOGIN:', user)
  console.log('ROLE:', user?.role)
  const [sidebarOpen, setSidebarOpen] = React.useState(false)


  const isAdminPusat =
  user?.role === 'admin_pusat' ||
  user?.role === 'AdminPusat' ||
  user?.role === 'super_admin' ||
  user?.role === 'Super Admin'

const isAdminLapangan =
  user?.role === 'admin_lapangan' ||
  user?.role === 'AdminLapangan'


console.log('ROLE:', user?.role)
console.log('isAdminPusat:', isAdminPusat)
console.log('isAdminLapangan:', isAdminLapangan)

let menuItems = []

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

  // ===== LOAD CKEDITOR =====
  React.useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://cdn.ckeditor.com/4.22.1/standard/ckeditor.js'
    script.async = true
    document.head.appendChild(script)
    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script)
      }
    }
  }, [])

  // Tutup sidebar saat route berubah (mobile)
  React.useEffect(() => {
    setSidebarOpen(false)
  }, [location.pathname])

  const handleLogout = async () => {
    await logout()
  }

  return (
    <div id="main-wrapper">

      {/* ===== OVERLAY (mobile) ===== */}
      <div
        className={`sidebar-overlay ${sidebarOpen ? 'visible' : ''}`}
        onClick={() => setSidebarOpen(false)}
      />

     {/* ===== TOPBAR ===== */}
<header className="topbar">
  <nav className="navbar top-navbar navbar-expand-md navbar-dark">

    {/* Logo di topbar — tampil saat sidebar tertutup di mobile */}
    <div className="topbar-brand">
      <img src="/img/logo.png" alt="logo" />
      <span>SIKOMA</span>
    </div>

    {/* Hamburger — mobile only */}
    <button
      type="button"
      className="nav-toggler"
      onClick={() => setSidebarOpen(prev => !prev)}
      aria-label="Toggle sidebar"
    >
      <i className={`fas ${sidebarOpen ? 'fa-times' : 'fa-bars'}`}></i>
    </button>

  
    <div className="navbar-collapse collapse" id="navbarSupportedContent">
      <ul className="navbar-nav ms-auto d-flex align-items-center me-3">
        <li>
          <div className="user-info">
            <img
              className="img-circle"
              src="/img/user.png"
              alt="user"
              width="36"
              height="36"
            />
            <div>
              <div className="name">
                {user?.name && user.name.trim() !== '' ? user.name : 'Admin Pusat'}
              </div>
              <div className="email">
                {user?.email || 'admin@email.com'}
              </div>
            </div>
            <i
              className="fas fa-sign-out-alt logout-icon"
              onClick={handleLogout}
              title="Logout"
            ></i>
          </div>
        </li>
      </ul>
    </div>
  </nav>
</header>

      {/* ===== SIDEBAR ===== */}
      <aside className={`left-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="scroll-sidebar">

          {/* Logo */}
          <div className="sidebar-header-pusat horizontal">
            <img src="/img/logo.png" alt="logo" />
            <span>SIKOMA</span>
          </div>

          {/* Nav */}
          <nav className="sidebar-nav">
            <ul id="sidebarnav">

              {menuItems.map((item) => (
                <li className="sidebar-item" key={item.to}>
                  <Link
                    className={`sidebar-link ${location.pathname === item.to ? 'active' : ''}`}
                    to={item.to}
                  >
                    <i className={`fas ${item.icon}`}></i>
                    <span className="hide-menu">{item.label}</span>
                  </Link>
                </li>
              ))}

              {/* Logout */}
              <li className="sidebar-item logout-item">
                <a
                  className="sidebar-link"
                  href="#"
                  onClick={handleLogout}
                >
                  <i className="fas fa-sign-out-alt"></i>
                  <span className="hide-menu">Logout</span>
                </a>
              </li>

            </ul>
          </nav>
        </div>
      </aside>

      {/* ===== CONTENT ===== */}
      <div className="page-wrapper">

        {/* Breadcrumb */}
        <div className="page-breadcrumb">
          <div className="row align-items-center">
            <div className="col-md-6 col-8 align-self-center">
              <h3 className="page-title">{title}</h3>
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item"><a href="#">Home</a></li>
                  <li className="breadcrumb-item active" aria-current="page">{title}</li>
                </ol>
              </nav>
            </div>
          </div>
        </div>

        {/* Page content */}
        <div className="container-fluid">
          {children}
        </div>

        <footer className="footer">
          © 2026 SIKOMA. All rights reserved.
        </footer>
      </div>
    </div>
  )
}