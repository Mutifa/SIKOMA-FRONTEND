import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext.jsx'
import '../assets/css/AdminLapangan.css'

export default function AdminPusatLayout({ children, title = "Admin Pusat" }) {

  // Mengambil path URL saat ini (untuk menentukan menu aktif)
  const location = useLocation()

  // Mengambil data user & fungsi logout dari auth context
  const { user, logout } = useAuth()

  // ===== LOAD CKEDITOR =====
  React.useEffect(() => {

    // Membuat elemen script untuk load CKEditor dari CDN
    const script = document.createElement('script')
    script.src = 'https://cdn.ckeditor.com/4.22.1/standard/ckeditor.js'
    script.async = true
    document.head.appendChild(script)

    // Cleanup: hapus script saat component unmount
    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script)
      }
    }
  }, [])

  // Function logout
  const handleLogout = async () => {
    await logout() // Menghapus session/token user
  }

  return (
    <div id="main-wrapper" data-layout="vertical" data-navbarbg="skin5" data-sidebartype="mini-sidebar"
      data-sidebar-position="fixed" data-header-position="absolute" data-boxed-layout="full">

      {/* ===== HEADER / TOPBAR ===== */}
      <header className="topbar" data-navbarbg="skin5">
        <nav className="navbar top-navbar navbar-expand-md navbar-dark px-4">

          {/* Toggle sidebar (mobile) */}
          <button
            type="button"
            className="nav-toggler waves-effect waves-light text-dark d-block d-md-none mt-2 border-0 bg-transparent"
            onClick={() => console.log("toggle")}
          >
            <i className="fas fa-bars fs-6"></i>
          </button>

          {/* Profile user di kanan atas */}
          <div className="navbar-collapse collapse" id="navbarSupportedContent" data-navbarbg="skin5">
            <ul className="navbar-nav ms-auto d-flex align-items-center me-3">
              <li>
              <div className="user-info">

  <img
    className="img-circle"
    src="/img/user.png"
    alt="user"
    width="38"
    height="38"
  />

  <div>
    <div className="name">
      {user?.name && user.name.trim() !== '' ? user.name : 'Super Admin'}
    </div>
    <div className="email">
      {user?.email || 'admin@email.com'}
    </div>
  </div>

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

      {/* ===== SIDEBAR ===== */}
      <aside className="left-sidebar sidebar-admin-pusat">
        <div className="scroll-sidebar">

          <div className="sidebar-header-pusat horizontal">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <img src="/img/logo.png" alt="logo" />
              <span>SIKOMA</span>
            </div>

            <i className="fas fa-sign-out-alt logout-icon"></i>
          </div>

          <nav className="sidebar-nav">
            <ul id="sidebarnav">

              {/* Dashboard */}
              <li className="sidebar-item">
                <Link
                  className={`sidebar-link ${location.pathname === '/admin-pusat/dashboard' ? 'active' : ''}`}
                  to="/admin-pusat/dashboard"
                >
                  <i className="fas fa-home"></i>
                  <span className="hide-menu">Dashboard</span>
                </Link>
              </li>

              {/* Profil Perusahaan */}
              <li className="sidebar-item">
                <Link
                  className={`sidebar-link ${location.pathname === '/admin-pusat/profil-perusahaan' ? 'active' : ''}`}
                  to="/admin-pusat/profil-perusahaan"
                >
                  <i className="fas fa-building" aria-hidden="true"></i>
                  <span className="hide-menu">Profil Perusahaan</span>
                </Link>
              </li>

              {/* Program */}
              <li className="sidebar-item">
                <Link
                  className={`sidebar-link ${location.pathname === '/admin-pusat/program' ? 'active' : ''}`}
                  to="/admin-pusat/program"
                >
                  <i className="fas fa-list-ul" aria-hidden="true"></i>
                  <span className="hide-menu">Program</span>
                </Link>
              </li>

              {/* Konten (pakai CKEditor nanti) */}
              <li className="sidebar-item">
                <Link
                  className={`sidebar-link ${location.pathname === '/admin-pusat/konten' ? 'active' : ''}`}
                  to="/admin-pusat/konten"
                >
                  <i className="fas fa-newspaper" aria-hidden="true"></i>
                  <span className="hide-menu">Konten Informasi & Edukasi</span>
                </Link>
              </li>

              {/* Kawasan */}
              <li className="sidebar-item">
                <Link
                  className={`sidebar-link ${location.pathname === '/admin-pusat/kawasan' ? 'active' : ''}`}
                  to="/admin-pusat/kawasan"
                >
                  <i className="fas fa-map-marker-alt" aria-hidden="true"></i>
                  <span className="hide-menu">Kawasan Konservasi</span>
                </Link>
              </li>

              {/* Laporan */}
              <li className="sidebar-item">
                <Link
                  className={`sidebar-link ${location.pathname === '/admin-pusat/laporan' ? 'active' : ''}`}
                  to="/admin-pusat/laporan"
                >
                  <i className="fas fa-file-lines" aria-hidden="true"></i>
                  <span className="hide-menu">Laporan Konservasi</span>
                </Link>
              </li>

              {/* Peraturan */}
              <li className="sidebar-item">
                <Link
                  className={`sidebar-link ${location.pathname === '/admin-pusat/peraturan' ? 'active' : ''}`}
                  to="/admin-pusat/peraturan"
                >
                  <i className="fas fa-gavel" aria-hidden="true"></i>
                  <span className="hide-menu">Peraturan</span>
                </Link>
              </li>

              {/* Standar Pelayanan */}
              <li className="sidebar-item">
                <Link
                  className={`sidebar-link ${location.pathname === '/admin-pusat/standar-pelayanan' ? 'active' : ''}`}
                  to="/admin-pusat/standar-pelayanan"
                >
                  <i className="fas fa-clipboard-list" aria-hidden="true"></i>
                  <span className="hide-menu">Standar Pelayanan</span>
                </Link>
              </li>

              {/* Galeri */}
              <li className="sidebar-item">
                <Link
                  className={`sidebar-link ${location.pathname === '/admin-pusat/galeri' ? 'active' : ''}`}
                  to="/admin-pusat/galeri"
                >
                  <i className="fas fa-images" aria-hidden="true"></i>
                  <span className="hide-menu">Galeri</span>
                </Link>
              </li>

              {/* Pengguna */}
              <li className="sidebar-item">
                <Link
                  className={`sidebar-link ${location.pathname === '/admin-pusat/pengguna' ? 'active' : ''}`}
                  to="/admin-pusat/pengguna"
                >
                  <i className="fas fa-users" aria-hidden="true"></i>
                  <span className="hide-menu">Pengguna</span>
                </Link>
              </li>

              {/* Akun */}
              <li className="sidebar-item">
                <Link
                  className={`sidebar-link ${location.pathname === '/admin-pusat/akun' ? 'active' : ''}`}
                  to="/admin-pusat/akun"
                >
                  <i className="fas fa-user-cog" aria-hidden="true"></i>
                  <span className="hide-menu">Akun</span>
                </Link>
              </li>

              {/* Logout */}
              <li className="sidebar-item logout-item">
                <a
                  className="sidebar-link text-white"
                  href="#"
                  onClick={handleLogout} // Trigger logout
                >
                  <i className="fas fa-lock-open text-white"></i>
                  <span className="hide-menu">Logout</span>
                </a>
              </li>

            </ul>
          </nav>
        </div>
      </aside>

      {/* ===== CONTENT ===== */}
      <div className="page-wrapper">
        <div className="d-lg-none"><br /></div>

        {/* Judul & Breadcrumb */}
        <div className="page-breadcrumb bg-white">
          <div className="row align-items-center">
            <div className="col-md-6 col-8 align-self-center">

              {/* Title dinamis */}
              <h3 className="page-title mb-0 p-0">{title}</h3>

              {/* Breadcrumb */}
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

        {/* Tempat render halaman */}
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