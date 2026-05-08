import React from 'react'

// Routing React Router
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

// Context untuk auth global (login, user, dll)
import { AuthProvider } from './contexts/AuthContext.jsx'

// Guard untuk proteksi role (admin pusat / lapangan)
import RoleGuard from './components/RoleGuard.jsx'

// ================= PUBLIC PAGES =================
import PublicHome from './pages/Public/Home.jsx'
import PublicEdukasi from './pages/Public/Edukasi.jsx'
import PublicEdukasiDetail from './pages/Public/EdukasiDetail.jsx'
import InformasiDetail from './pages/Public/InformasiDetail.jsx'
import PublicInformasi from './pages/Public/Informasi.jsx'
import PublicStandarPelayanan from './pages/Public/StandarPelayanan.jsx'
import Profil from './pages/Public/Profil.jsx'
import Kontak from './pages/Public/Kontak'

// ================= AUTH =================
import Login from './pages/Auth/Login.jsx'
import Register from './pages/Auth/Register.jsx'
import ForgotPassword from './pages/Auth/ForgotPassword.jsx'
import ResetPassword from './pages/Auth/ResetPassword.jsx'
import VerifyEmail from './pages/Auth/VerifyEmail.jsx'

// ================= ADMIN LAPANGAN =================
// import DashboardAdminLapangan from './pages/AdminLapangan/Dashboard'
// import LaporanKonservasi from './pages/AdminLapangan/LaporanKonservasi.jsx'
import LaporanKonservasi from './pages/Main/LaporanKonservasi'
import LaporanTambah from './pages/AdminLapangan/LaporanTambah.jsx'
import LaporanDetail from './pages/AdminLapangan/LaporanDetail.jsx'
import LaporanEdit from './pages/AdminLapangan/LaporanEdit.jsx'
import Akun from './pages/AdminLapangan/Akun.jsx'

// ================= ADMIN PUSAT =================
// import AdminPusatDashboard from './pages/AdminPusat/Dashboard.jsx'
// import AdminPusatPengguna from './pages/AdminPusat/Pengguna.jsx'
import Pengguna from './pages/Main/Pengguna/index'
import PenggunaCreate from './pages/Main/Pengguna/create.jsx'
import PenggunaDetail from './pages/Main/Pengguna/detail.jsx'
import PenggunaEdit from './pages/Main/Pengguna/edit.jsx'
// import AdminPusatGaleri from './pages/AdminPusat/Galeri.jsx'
import Galeri from './pages/Main/Galeri'
// import AdminPusatCustomer from './pages/AdminPusat/Customer.jsx'
// import AdminPusatProfilPerusahaan from './pages/AdminPusat/ProfilPerusahaan.jsx'
import ProfilPerusahaan from './pages/Main/ProfilPerusahaan'

// import AdminPusatProgram from './pages/AdminPusat/Program.jsx'
import Program from './pages/Main/Program'



// import AdminPusatKonten from './pages/AdminPusat/Konten.jsx'
import Konten from './pages/Main/Konten/index.jsx'
// import AdminPusatKawasan from './pages/AdminPusat/Kawasan.jsx'
import Kawasan from './pages/Main/Kawasan'
import AdminPusatLaporan from './pages/AdminPusat/Laporan.jsx'
import AdminPusatLaporanDetail from './pages/AdminPusat/LaporanDetail.jsx'
// import AdminPusatPeraturan from './pages/AdminPusat/Peraturan.jsx'
import Peraturan from './pages/Main/Peraturan'

// import AdminPusatStandarPelayanan from './pages/AdminPusat/StandarPelayanan.jsx'
import StandarPelayanan from './pages/Main/StandarPelayanan'

import AdminPusatAkun from './pages/AdminPusat/Akun.jsx'
import Dashboard from './pages/AdminPusat/Dashboard.jsx'









// ================= UTIL =================
import NotFound from './pages/NotFound.jsx'
import HealthCheck from './pages/HealthCheck.jsx'

export default function App() {
  return (
    //  Bungkus semua dengan AuthProvider (biar login bisa global)
    <AuthProvider>

      {/* Router utama */}
      <BrowserRouter>

        <Routes>

          {/* ================= PUBLIC ROUTES ================= */}

          {/* Halaman utama */}
          <Route path="/" element={<PublicHome />} />

          {/* Edukasi */}
          <Route path="/edukasi" element={<PublicEdukasi />} />

          {/* Detail edukasi (pakai slug) */}
          <Route path="/edukasi/:slug" element={<PublicEdukasiDetail />} />

          {/* Halaman lain */}
          <Route path="/informasi" element={<PublicInformasi />} />
          <Route path="/informasi/:slug" element={<InformasiDetail />} />

          {/* <Route path="/standar-pelayanan" element={<PublicStandarPelayanan />} /> */}
          <Route path="/standar-pelayanan" element={
            <RoleGuard allowedRoles={['admin_pusat']}>
              <PublicStandarPelayanan />
            </RoleGuard>
          } />

          <Route path="/profil" element={<Profil />} />
          <Route path="/kontak" element={<Kontak />} />

          {/* ================= AUTH ================= */}

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/verify-email" element={<VerifyEmail />} />

          {/* ================= ADMIN PUSAT ================= */}

          {/* Dashboard admin pusat (tanpa guard - bisa kamu tambah nanti) */}
          {/* <Route path="/admin-pusat/dashboard" element={<AdminPusatDashboard />} /> */}

          {/* ================= ADMIN LAPANGAN ================= */}
          {/* Dashboard admin lapangan (pakai RoleGuard) */}
          {/* <Route path="/admin-lapangan/dashboard" element={
            <RoleGuard allowedRoles={['admin_lapangan']}>
              <DashboardAdminLapangan />
            </RoleGuard>
          } /> */}

          <Route path="/dashboard" element={<Dashboard />} />



          {/* CRUD laporan konservasi */}
          <Route path="/laporan-konservasi" element={
            <RoleGuard allowedRoles={['admin_pusat', 'admin_lapangan']}>
              <LaporanKonservasi />
            </RoleGuard>
          } />

          {/* <Route path="/admin-lapangan/laporan/tambah" element={
            <RoleGuard allowedRoles={['admin_lapangan']}>
              <LaporanTambah />
            </RoleGuard>
          } /> */}

          <Route path="/laporan-konservasi/create" element={
            <RoleGuard allowedRoles={['admin_lapangan']}>
              <LaporanTambah />
            </RoleGuard>
          } />

          {/* <Route path="/admin-lapangan/laporan/detail/:id" element={
            <RoleGuard allowedRoles={['admin_lapangan']}>
              <LaporanDetail />
            </RoleGuard>
          } /> */}

          <Route path="/laporan-konservasi/detail/:id" element={
            <RoleGuard allowedRoles={['admin_pusat', 'admin_lapangan']}>
              <LaporanDetail />
            </RoleGuard>
          } />

          {/* 
          <Route path="/admin-lapangan/laporan/edit/:id" element={
            <RoleGuard allowedRoles={['admin_lapangan']}>
              <LaporanEdit />
            </RoleGuard>
          } /> */}

          <Route path="/laporan-konservasi/edit/:id" element={
            <RoleGuard allowedRoles={['admin_pusat', 'admin_lapangan']}>
              <LaporanEdit />
            </RoleGuard>
          } />


          {/* Akun */}
          <Route path="/admin-lapangan/akun" element={
            <RoleGuard allowedRoles={['admin_lapangan']}>
              <Akun />
            </RoleGuard>
          } />

          {/* ================= ADMIN PUSAT (PROTECTED) ================= */}

          {/* <Route path="/admin-pusat" element={
            <RoleGuard allowedRoles={['AdminPusat']}>
              <AdminPusatDashboard />
            </RoleGuard>
          } /> */}

          {/* halaman admin pusat lainnya */}
          <Route
            path="/pengguna"
            element={
              <RoleGuard allowedRoles={['admin_pusat']}>
                <Pengguna />
              </RoleGuard>
            }
          />

          <Route
            path="/pengguna/create"
            element={
              <RoleGuard allowedRoles={['admin_pusat']}>
                <PenggunaCreate />
              </RoleGuard>
            }
          />

          <Route
            path="/pengguna/detail/:id"
            element={
              <RoleGuard allowedRoles={['admin_pusat']}>
                <PenggunaDetail />
              </RoleGuard>
            }
          />

          <Route
            path="/pengguna/edit/:id"
            element={
              <RoleGuard allowedRoles={['admin_pusat']}>
                <PenggunaEdit />
              </RoleGuard>
            }
          />
          {/* <Route path="/admin-pusat/galeri" element={<AdminPusatGaleri />} /> */}
          <Route path="/galeri" element={
            <RoleGuard allowedRoles={['admin_pusat', 'admin_lapangan']}>
              <Galeri />
            </RoleGuard>
          } />
          {/* <Route path="/admin-pusat/customer" element={<AdminPusatCustomer />} /> */}
          {/* <Route path="/admin-pusat/profil-perusahaan" element={<AdminPusatProfilPerusahaan />} /> */}
          <Route path="/profil-perusahaan" element={
            <RoleGuard allowedRoles={['admin_pusat']}>
              <ProfilPerusahaan />
            </RoleGuard>
          } />

          {/* <Route path="/admin-pusat/program" element={<AdminPusatProgram />} /> */}
          <Route path="/program" element={
            <RoleGuard allowedRoles={['admin_pusat']}>
              <Program />
            </RoleGuard>
          } />

          {/* <Route path="/admin-pusat/konten" element={<AdminPusatKonten />} /> */}
          <Route path="/konten" element={
            <RoleGuard allowedRoles={['admin_pusat']}>
              <Konten />
            </RoleGuard>
          } />

          {/* <Route path="/admin-pusat/kawasan" element={<AdminPusatKawasan />} /> */}

          <Route path="/kawasan" element={
            <RoleGuard allowedRoles={['admin_pusat']}>
              <Kawasan />
            </RoleGuard>
          } />


          {/* <Route path="/admin-pusat/peraturan" element={<AdminPusatPeraturan />} /> */}
          <Route path="/peraturan" element={
            <RoleGuard allowedRoles={['admin_pusat']}>
              <Peraturan />
            </RoleGuard>
          } />
          {/* 
          <Route path="/admin-pusat/standar-pelayanan" element={<AdminPusatStandarPelayanan />} /> */}
          <Route path="/standar-pelayanan" element={
            <RoleGuard allowedRoles={['admin_pusat']}>
              <StandarPelayanan />
            </RoleGuard>
          } />

          <Route path="/admin-pusat/akun" element={<AdminPusatAkun />} />


          {/* ================= UTIL ================= */}

          {/* Health check */}
          <Route path="/health" element={<HealthCheck />} />

          {/* redirect /home ke / */}
          <Route path="/home" element={<Navigate to="/" replace />} />

          {/* halaman 404 */}
          <Route path="*" element={<NotFound />} />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}