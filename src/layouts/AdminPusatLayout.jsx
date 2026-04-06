import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext.jsx'
import '../assets/css/AdminLapangan.css'

export default function AdminPusatLayout({ children, title = "Admin Pusat" }) {
  const location = useLocation()
  const { user, logout } = useAuth()

  // Load CKEditor
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

  const handleLogout = async () => {
    await logout()
  }

  return (
    <div id="main-wrapper" data-layout="vertical" data-navbarbg="skin5" data-sidebartype="full"
         data-sidebar-position="absolute" data-header-position="absolute" data-boxed-layout="full">
      
      {/* Topbar header */}
      <header className="topbar" data-navbarbg="skin5">
        <nav className="navbar top-navbar navbar-expand-md navbar-dark">
          <div className="navbar-header" data-logobg="skin6">
            <Link className="navbar-brand" to="/AdminPusat">
              <b className="logo-icon">
                <img src="/img/logo.png" height="30px" alt="homepage" />
              </b>
              <span className="logo-text">
                <h2 className="sikoma-title" title="SIKOMA">SIKOMA aaas</h2>
              </span>
            </Link>
            <a className="nav-toggler waves-effect waves-light text-dark d-block d-md-none mt-2"
               href="javascript:void(0)">
              <i className="fas fa-bars fs-6"></i>
            </a>
          </div>
          
          <div className="navbar-collapse collapse" id="navbarSupportedContent" data-navbarbg="skin5">
            <ul className="navbar-nav ms-auto d-flex align-items-center">
              <li>
                <a className="profile-pic" type="button">
                  <img className="img-circle" src="/img/user.png" alt="user" width="40px" height="40px" />
                  <span className="text-white font-medium">{user?.name || 'Admin Pusat'}</span>
                </a>
              </li>
            </ul>
          </div>
        </nav>
      </header>

      {/* Left Sidebar */}
      <aside className="left-sidebar" data-sidebarbg="skin6">
        <div className="scroll-sidebar">
          <nav className="sidebar-nav">
            <ul id="sidebarnav">
              <li className="sidebar-item">
                <Link 
                  className={`sidebar-link waves-effect waves-dark sidebar-link ${location.pathname === '/AdminPusat' ? 'active' : ''}`}
                  to="/AdminPusat"
                >
                  <i className="fas fa-home" aria-hidden="true"></i>
                  <span className="hide-menu">Dashboard</span>
                </Link>
              </li>
              <li className="sidebar-item">
                <Link 
                  className={`sidebar-link waves-effect waves-dark sidebar-link ${location.pathname === '/AdminPusat/profil-perusahaan' ? 'active' : ''}`}
                  to="/AdminPusat/profil-perusahaan"
                >
                  <i className="fas fa-building" aria-hidden="true"></i>
                  <span className="hide-menu">Profil Perusahaan</span>
                </Link>
              </li>
              <li className="sidebar-item">
                <Link 
                  className={`sidebar-link waves-effect waves-dark sidebar-link ${location.pathname === '/AdminPusat/program' ? 'active' : ''}`}
                  to="/AdminPusat/program"
                >
                  <i className="fas fa-list-ul" aria-hidden="true"></i>
                  <span className="hide-menu">Program</span>
                </Link>
              </li>
              <li className="sidebar-item">
                <Link 
                  className={`sidebar-link waves-effect waves-dark sidebar-link ${location.pathname === '/AdminPusat/konten' ? 'active' : ''}`}
                  to="/AdminPusat/konten"
                >
                  <i className="fas fa-newspaper" aria-hidden="true"></i>
                  <span className="hide-menu">Konten Informasi & Edukasi</span>
                </Link>
              </li>
              <li className="sidebar-item">
                <Link 
                  className={`sidebar-link waves-effect waves-dark sidebar-link ${location.pathname === '/AdminPusat/kawasan' ? 'active' : ''}`}
                  to="/AdminPusat/kawasan"
                >
                  <i className="fas fa-map-marker-alt" aria-hidden="true"></i>
                  <span className="hide-menu">Kawasan Konservasi</span>
                </Link>
              </li>
              <li className="sidebar-item">
                <Link 
                  className={`sidebar-link waves-effect waves-dark sidebar-link ${location.pathname === '/AdminPusat/laporan' ? 'active' : ''}`}
                  to="/AdminPusat/laporan"
                >
                  <i className="fas fa-file-lines" aria-hidden="true"></i>
                  <span className="hide-menu">Laporan Konservasi</span>
                </Link>
              </li>
              <li className="sidebar-item">
                <Link 
                  className={`sidebar-link waves-effect waves-dark sidebar-link ${location.pathname === '/AdminPusat/peraturan' ? 'active' : ''}`}
                  to="/AdminPusat/peraturan"
                >
                  <i className="fas fa-gavel" aria-hidden="true"></i>
                  <span className="hide-menu">Peraturan</span>
                </Link>
              </li>
              <li className="sidebar-item">
                <Link 
                  className={`sidebar-link waves-effect waves-dark sidebar-link ${location.pathname === '/AdminPusat/standar-pelayanan' ? 'active' : ''}`}
                  to="/AdminPusat/standar-pelayanan"
                >
                  <i className="fas fa-clipboard-list" aria-hidden="true"></i>
                  <span className="hide-menu">Standar Pelayanan</span>
                </Link>
              </li>
              <li className="sidebar-item">
                <Link 
                  className={`sidebar-link waves-effect waves-dark sidebar-link ${location.pathname === '/AdminPusat/galeri' ? 'active' : ''}`}
                  to="/AdminPusat/galeri"
                >
                  <i className="fas fa-images" aria-hidden="true"></i>
                  <span className="hide-menu">Galeri</span>
                </Link>
              </li>
              <li className="sidebar-item">
                <Link 
                  className={`sidebar-link waves-effect waves-dark sidebar-link ${location.pathname === '/AdminPusat/pengguna' ? 'active' : ''}`}
                  to="/AdminPusat/pengguna"
                >
                  <i className="fas fa-users" aria-hidden="true"></i>
                  <span className="hide-menu">Pengguna</span>
                </Link>
              </li>
              <li className="sidebar-item">
                <Link 
                  className={`sidebar-link waves-effect waves-dark sidebar-link ${location.pathname === '/AdminPusat/akun' ? 'active' : ''}`}
                  to="/AdminPusat/akun"
                >
                  <i className="fas fa-user-cog" aria-hidden="true"></i>
                  <span className="hide-menu">Akun</span>
                </Link>
              </li>
              <li className="sidebar-item bg-danger">
                <a className="sidebar-link waves-effect waves-dark sidebar-link text-white" 
                   href="#" onClick={handleLogout}>
                  <i className="fas fa-lock-open text-white"></i>
                  <span className="hide-menu">Logout</span>
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </aside>

      {/* Page wrapper */}
      <div className="page-wrapper">
        <div className="d-lg-none"><br /></div>
        
        <div className="page-breadcrumb bg-white">
          <div className="row align-items-center">
            <div className="col-md-6 col-8 align-self-center">
              <h3 className="page-title mb-0 p-0">{title}</h3>
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

        <div className="container-fluid">
          {children}
        </div>

        <footer className="footer text-center">
          © 2024 SIKOMA. All rights reserved.
        </footer>
      </div>
    </div>
  )
}
