import React from 'react'

// Link → navigasi halaman
// useLocation → membaca route/url aktif sekarang
import { Link, useLocation } from 'react-router-dom'

// Mengambil data login dari AuthContext
import { useAuth } from '../contexts/AuthContext.jsx'
import profilPerusahaanService from '../services/profilPerusahaanService.js'

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
  title = "Admin Pusat",
  actions,
  website // 🔥 Menerima properti data website dari parent component
}) {

  // ===================================================
  // useLocation()
  // ===================================================
  // Digunakan untuk membaca route aktif sekarang
  // ===================================================
  const location = useLocation()


  // ===================================================
  // useAuth()
  // ===================================================
  // Mengambil: data user login & function logout
  // ===================================================
  const { user, logout } = useAuth()

  // ===================================================
  // STATE SIDEBAR MOBILE
  // ===================================================
  const [sidebarOpen, setSidebarOpen] = React.useState(false)
  const [websiteData, setWebsiteData] = React.useState(website || null)
  const [logoKey, setLogoKey] = React.useState(Date.now())

  const FILE_URL = 'https://codemy.my.id'

  // ===================================================
  // ROLE CHECK
  // ===================================================
  const isAdminPusat =
    user?.role === 'admin_pusat' ||
    user?.role === 'AdminPusat' ||
    user?.role === 'super_admin' ||
    user?.role === 'Super Admin'

  const isAdminLapangan =
    user?.role === 'admin_lapangan' ||
    user?.role === 'AdminLapangan'

  // ===================================================
  // MENU SIDEBAR
  // ===================================================
  let menuItems = []

  // MENU ADMIN PUSAT
  if (isAdminPusat) {
    menuItems = [
      { to: '/dashboard', icon: 'fa-home', label: 'Dashboard' },
      { to: '/profil-perusahaan', icon: 'fa-building', label: 'Profil Perusahaan' },
      { to: '/pengguna', icon: 'fa-users', label: 'Pengguna' },
      { to: '/dashboard/program', icon: 'fa-list-ul', label: 'Program' },
      { to: '/dashboard/informasi-edukasi', icon: 'fa-newspaper', label: 'Informasi & Edukasi' },
      { to: '/kawasan', icon: 'fa-map-marker-alt', label: 'Kawasan Konservasi' },
      { to: '/peraturan', icon: 'fa-gavel', label: 'Peraturan' },
      { to: '/laporan-konservasi', icon: 'fa-file-lines', label: 'Laporan Konservasi' },
      { to: '/pesan-masuk', icon: 'fa-clipboard-list', label: 'Standar Pelayanan' },
      { to: '/akun', icon: 'fa-user-cog', label: 'Akun' },
      { to: '/data-satwa', icon: 'fa-database', label: 'Data Satwa' }
    ]

  } else {
    // MENU ADMIN LAPANGAN
    menuItems = [
      { to: '/dashboard', icon: 'fa-home', label: 'Dashboard' },
      { to: '/laporan-konservasi', icon: 'fa-file-lines', label: 'Laporan Konservasi' },
      { to: '/akun', icon: 'fa-user-cog', label: 'Akun' },
    ]
  }


  // ===================================================
  // LOAD CKEDITOR
  // ===================================================
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


  // ===================================================
  // TUTUP SIDEBAR SAAT PINDAH HALAMAN
  // ===================================================
  React.useEffect(() => {
    setSidebarOpen(false)
  }, [location.pathname])

  React.useEffect(() => {
    if (website) return

    let mounted = true

    profilPerusahaanService.get()
      .then(res => {
        if (mounted) {
          setWebsiteData(
            res.data?.website ||
            res.data?.data?.website ||
            res.data?.data ||
            res.data
          )
          setLogoKey(Date.now())
        }
      })
      .catch(() => {})

    return () => { mounted = false }
  }, [website])


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

      {/* OVERLAY MOBILE */}
      <div
        className={`sidebar-overlay ${sidebarOpen ? 'visible' : ''}`}
        onClick={() => setSidebarOpen(false)}
      />


      {/* ============================================
          TOPBAR
      ============================================ */}
      <header className="topbar">
        <nav className="navbar top-navbar navbar-expand-md navbar-dark">

          {/* Logo Topbar Dinamis */}
          <div className="topbar-brand">
            <img
              src={
                websiteData?.logo
                  ? `${FILE_URL}/uploads/profil/${websiteData.logo}?t=${logoKey}`
                  : `${FILE_URL}/uploads/profil/logo.png`
              }
              alt="logo"
              width={40}
              height={40}
              loading="lazy"
              decoding="async"
              style={{ objectFit: 'contain' }}
            />
            <span className="logo-text">
              {websiteData?.nama || 'SIKOMA'}
            </span>
          </div>

          {/* Tombol buka sidebar mobile */}
          <button
            type="button"
            className="nav-toggler"
            onClick={() => setSidebarOpen(prev => !prev)}
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
                    width={36}
                    height={36}
                    loading="lazy"
                    decoding="async"
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

          {/* Logo Sidebar Dinamis */}
          <div className="sidebar-header-pusat horizontal">
            <img
              src={
                websiteData?.logo
                  ? `${FILE_URL}/uploads/profil/${websiteData.logo}?t=${logoKey}`
                  : `${FILE_URL}/uploads/profil/logo.png`
              }
              alt="logo"
              width={40}
              height={40}
              loading="lazy"
              decoding="async"
              style={{ objectFit: 'contain' }}
            />
            <span>
              {websiteData?.nama || 'SIKOMA'}
            </span>
          </div>


          {/* MENU */}
          <nav className="sidebar-nav">
            <ul id="sidebarnav">
              {menuItems.map((item) => (
                <li className="sidebar-item" key={item.to}>
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
          {/* 🔥 Tambahkan class Bootstrap d-flex justify-content-between align-items-center di baris ini */}
          <div className="page-header-row d-flex justify-content-between align-items-center">
            <div className="page-header-main">
              
              {/* Title halaman */}
              <h3 className="page-title">
                {title}
              </h3>

              {/* Breadcrumb */}
              <nav aria-label="breadcrumb">
               <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <a href="#">Home</a>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    {title}
                  </li>
                </ol>
              </nav>

            </div>
            {actions && (
              <div className="page-header-actions">
                {actions}
              </div>
            )}
          </div>
        </div>


        {/* ISI HALAMAN */}
        <div className="container-fluid">
          {children}
        </div>


        {/* FOOTER */}
        <footer className="footer">
          © 2026 {websiteData?.nama || 'SIKOMA'}. All rights reserved.
        </footer>

      </div>

    </div>
  )
}
