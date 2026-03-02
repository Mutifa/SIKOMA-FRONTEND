import React from 'react'
import { Link, NavLink } from 'react-router-dom'
import { assetUrl } from '../lib/assets.js'

export default function Navbar({ active, website }) {
  return (
    <nav className="navbar navbar-expand-lg bg-white navbar-light sticky-top p-0">
      <div className="container-fluid">
        <Link to="/" className="navbar-brand d-flex align-items-center px-4 px-lg-5">
          <img src={assetUrl(`/img/${website?.icon || 'logo.png'}`)} alt="Logo" width="50" height="50" className="me-3" />
          <h1 className="m-0 fs-3">{website?.nama || 'UPT KPH Tasik Besar Serkap'}</h1>
        </Link>
        <button className="navbar-toggler me-4" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarCollapse">
          <div className="navbar-nav ms-auto p-4 p-lg-0">
            <div className="nav-item dropdown">
              <a href="#" className={`nav-link ${active==='profil'?'active':''} dropdown-toggle`} data-bs-toggle="dropdown">Profil</a>
              <div className="dropdown-menu bg-light m-0" style={{ width: 300 }}>
                <a href="/#struktur-organisasi" className="dropdown-item">Struktur Organisasi</a>
                <a href="/#visi-misi" className="dropdown-item">Visi Misi</a>
                <a href="/#sejarah" className="dropdown-item">UPT KPH Tasik Besar Serkap</a>
              </div>
            </div>
            <NavLink to="/edukasi" className={({isActive})=>`nav-item nav-link ${isActive||active==='edukasi'?'active':''}`}>Program</NavLink>
            <div className="nav-item dropdown">
              <a href="#" className={`nav-link ${active==='informasi'?'active':''} dropdown-toggle`} data-bs-toggle="dropdown">Informasi & Edukasi</a>
              <div className="dropdown-menu bg-light m-0" style={{ width: 300 }}>
                <a href="/informasi#kawasan-konservasi" className="dropdown-item">Kawasan Konservasi</a>
                <a href="/informasi#dilindungi" className="dropdown-item">Jenis TSL Dilindungi</a>
                <a href="/informasi#executive-summary" className="dropdown-item">Executive Summary</a>
                <a href="/informasi#peraturan" className="dropdown-item">Peraturan</a>
              </div>
            </div>
            <NavLink to="/standar-pelayanan" className={({isActive})=>`nav-item nav-link ${isActive||active==='standar-pelayanan'?'active':''}`}>Standar Pelayanan</NavLink>
            <NavLink to="/login" className="btn btn-primary py-4 px-lg-4 rounded-0 d-none d-lg-block">Login<i className="fa fa-arrow-right ms-3"></i></NavLink>
          </div>
        </div>
      </div>
    </nav>
  )
}


