import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext.jsx'
import '../assets/css/AdminLapangan.css'

export default function AdminLapanganLayout({ children, title = "Dashboard AdminLapangan" }) {

  // Mengambil lokasi URL saat ini (untuk menandai menu aktif)
  const location = useLocation()

  // Mengambil data user & fungsi logout dari auth context
  const { user, logout } = useAuth()

  // Function untuk logout user
  const handleLogout = async () => {
    await logout() // Panggil logout (biasanya hapus token/session)
  }

  return (
    <div id="main-wrapper" data-layout="vertical" data-navbarbg="skin5" data-sidebartype="full"
         data-sidebar-position="absolute" data-header-position="absolute" data-boxed-layout="full">
      
      {/* Preloader (sudah dimatikan / tidak digunakan) */}
      {/* <div className="preloader">
        <div className="lds-ripple">
          <div className="lds-pos"></div>
          <div className="lds-pos"></div>
        </div>
      </div> */}

      {/* ===== HEADER / TOPBAR ===== */}
      <header className="topbar" data-navbarbg="skin5">
        <nav className="navbar top-navbar navbar-expand-md navbar-dark">

          {/* Logo & brand */}
        
          
          {/* Bagian kanan header (profil user) */}
          <div className="navbar-collapse collapse" id="navbarSupportedContent" data-navbarbg="skin5">
            <ul className="navbar-nav ms-auto d-flex align-items-center me-3">
              <li>
                <a 
  className="profile-pic" 
  type="button"
  onClick={handleLogout}
  style={{ cursor: 'pointer' }}
>
                  <img className="img-circle" src="/img/user.png" alt="user" width="40px" height="40px" />

                  {/* Menampilkan nama user (fallback jika kosong) */}
                  <span className="text-dark font-medium">
                    {user?.name && user.name.trim() !== '' ? user.name : 'Admin Lapangan'}
                  </span>
                </a>
              </li>
            </ul>
          </div>
        </nav>
      </header>

      {/* ===== SIDEBAR (MENU KIRI) ===== */}
      <aside className="left-sidebar" data-sidebarbg="skin6">
        <div className="scroll-sidebar">
          <div className="sidebar-header-pusat horizontal">
  <img src="/img/logo.png" alt="logo" />
  <span>SIKOMA</span>
</div>
          <nav className="sidebar-nav">
            <ul id="sidebarnav">

              {/* Menu Dashboard */}
              <li className="sidebar-item pt-2">
                <Link 
                  className={`sidebar-link waves-effect waves-dark sidebar-link ${location.pathname === '/admin-lapangan/dashboard'? 'active' : ''}`}
                  to="/admin-lapangan/dashboard"
                >
                  <i className="fas fa-home me-3" aria-hidden="true"></i>
                  <span className="hide-menu">Dashboard</span>
                </Link>
              </li>

              {/* Menu Laporan */}
              <li className="sidebar-item">
                <Link 
                  className={`sidebar-link waves-effect waves-dark sidebar-link ${location.pathname === '/admin-lapangan/laporan' ? 'active' : ''}`}
                  to="/admin-lapangan/laporan"
                >
                  <i className="fas fa-file-lines me-3" aria-hidden="true"></i>
                  <span className="hide-menu">Laporan Konservasi</span>
                </Link>
              </li>

              {/* Menu Akun */}
              <li className="sidebar-item">
                <Link 
                  className={`sidebar-link waves-effect waves-dark sidebar-link ${location.pathname === '/admin-lapangan/akun' ? 'active' : ''}`}
                  to="/admin-lapangan/akun"
                >
                  <i className="fas fa-user-cog me-3" aria-hidden="true"></i>
                  <span className="hide-menu">Akun</span>
                </Link>
              </li>

              {/* Menu Logout */}
              <li className="sidebar-item">
                <a 
                  className="sidebar-link waves-effect waves-dark sidebar-link text-white" 
                  href="#" 
                  onClick={handleLogout} // Trigger logout saat diklik
                >
                  <i className="fas fa-lock-open me-3 text-white"></i>
                  <span className="hide-menu">Logout</span>
                </a>
              </li>

            </ul>
          </nav>
        </div>
      </aside>

      {/* ===== CONTENT / HALAMAN UTAMA ===== */}
      <div className="page-wrapper">
        <div className="d-lg-none"><br /></div>
        
        {/* Breadcrumb & Judul Halaman */}
        <div className="page-breadcrumb bg-white">
          <div className="row align-items-center">
            <div className="col-md-6 col-8 align-self-center">

              {/* Title dinamis */}
              <h3 className="page-title mb-0 p-0">{title}</h3>

              {/* Breadcrumb navigation */}
              <div className="d-flex align-items-center">
                <nav aria-label="breadcrumb">
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item"><a href="#">Home</a></li>
                    <li className="breadcrumb-item active" aria-current="page">{title}</li>
                  </ol>
                </nav>
              </div>

            </div>
          </div>
        </div>

        {/* Tempat render halaman (children dari route) */}
        <div className="container-fluid">
          {children}
        </div>

        {/* Footer */}
        <footer className="footer text-center">
          © 2026 SIKOMA. All rights reserved.
        </footer>
      </div>
    </div>
  )
}