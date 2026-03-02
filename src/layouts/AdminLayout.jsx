import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext.jsx'
import '../assets/css/admin.css'

export default function AdminLayout({ children, title = "Dashboard Admin" }) {
  const location = useLocation()
  const { user, logout } = useAuth()

  const handleLogout = async () => {
    await logout()
  }

  return (
    <div id="main-wrapper" data-layout="vertical" data-navbarbg="skin5" data-sidebartype="full"
         data-sidebar-position="absolute" data-header-position="absolute" data-boxed-layout="full">
      
      {/* Preloader - DISABLED */}
      {/* <div className="preloader">
        <div className="lds-ripple">
          <div className="lds-pos"></div>
          <div className="lds-pos"></div>
        </div>
      </div> */}

      {/* Topbar header */}
      <header className="topbar" data-navbarbg="skin5">
        <nav className="navbar top-navbar navbar-expand-md navbar-dark">
          <div className="navbar-header" data-logobg="skin6">
            <Link className="navbar-brand" to="/admin">
              <b className="logo-icon">
                <img src="/img/logo.png" height="30px" alt="homepage" />
              </b>
              <span className="logo-text">
                <h2 className="text-dark mt-4 bold" title="SIKOMA">SIKOMA</h2>
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
                  <span className="text-white font-medium">{user?.name || 'Admin User'}</span>
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
              <li className="sidebar-item pt-2">
                <Link 
                  className={`sidebar-link waves-effect waves-dark sidebar-link ${location.pathname === '/admin' ? 'active' : ''}`}
                  to="/admin"
                >
                  <i className="fas fa-home me-3" aria-hidden="true"></i>
                  <span className="hide-menu">Dashboard</span>
                </Link>
              </li>
              <li className="sidebar-item">
                <Link 
                  className={`sidebar-link waves-effect waves-dark sidebar-link ${location.pathname === '/admin/laporan' ? 'active' : ''}`}
                  to="/admin/laporan"
                >
                  <i className="fas fa-file-lines me-3" aria-hidden="true"></i>
                  <span className="hide-menu">Laporan Konservasi</span>
                </Link>
              </li>
              <li className="sidebar-item">
                <Link 
                  className={`sidebar-link waves-effect waves-dark sidebar-link ${location.pathname === '/admin/akun' ? 'active' : ''}`}
                  to="/admin/akun"
                >
                  <i className="fas fa-user-cog me-3" aria-hidden="true"></i>
                  <span className="hide-menu">Akun</span>
                </Link>
              </li>
              <li className="sidebar-item bg-danger">
                <a className="sidebar-link waves-effect waves-dark sidebar-link text-white" 
                   href="#" onClick={handleLogout}>
                  <i className="fas fa-lock-open me-3 text-white"></i>
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
