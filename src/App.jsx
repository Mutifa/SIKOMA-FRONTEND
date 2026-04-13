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
import DashboardAdminLapangan from './pages/AdminLapangan/Dashboard'
import LaporanKonservasi from './pages/AdminLapangan/LaporanKonservasi.jsx'
import LaporanTambah from './pages/AdminLapangan/LaporanTambah.jsx'
import LaporanDetail from './pages/AdminLapangan/LaporanDetail.jsx'
import LaporanEdit from './pages/AdminLapangan/LaporanEdit.jsx'
import Akun from './pages/AdminLapangan/Akun.jsx'

// ================= ADMIN PUSAT =================
import AdminPusatDashboard from './pages/AdminPusat/Dashboard.jsx'
import AdminPusatPengguna from './pages/AdminPusat/Pengguna.jsx'
import AdminPusatGaleri from './pages/AdminPusat/Galeri.jsx'
import AdminPusatCustomer from './pages/AdminPusat/Customer.jsx'
import AdminPusatProfilPerusahaan from './pages/AdminPusat/ProfilPerusahaan.jsx'
import AdminPusatProgram from './pages/AdminPusat/Program.jsx'
import AdminPusatKonten from './pages/AdminPusat/Konten.jsx'
import AdminPusatKawasan from './pages/AdminPusat/Kawasan.jsx'
import AdminPusatLaporan from './pages/AdminPusat/Laporan.jsx'
import AdminPusatLaporanDetail from './pages/AdminPusat/LaporanDetail.jsx'
import AdminPusatPeraturan from './pages/AdminPusat/Peraturan.jsx'
import AdminPusatStandarPelayanan from './pages/AdminPusat/StandarPelayanan.jsx'
import AdminPusatAkun from './pages/AdminPusat/Akun.jsx'

// ================= UTIL =================
import NotFound from './pages/NotFound.jsx'
import HealthCheck from './pages/HealthCheck.jsx'

export default function App() {
  return (
    // 🔐 Bungkus semua dengan AuthProvider (biar login bisa global)
    <AuthProvider>

      {/* 🌐 Router utama */}
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
          <Route path="/standar-pelayanan" element={<PublicStandarPelayanan />} />
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
          <Route path="/admin-pusat/dashboard" element={<AdminPusatDashboard />} />

          {/* ================= ADMIN LAPANGAN ================= */}

          {/* Dashboard admin lapangan (pakai RoleGuard) */}
          <Route path="/admin-lapangan/dashboard" element={
            <RoleGuard allowedRoles={['admin_lapangan']}>
              <DashboardAdminLapangan />
            </RoleGuard>
          } />

          {/* CRUD laporan konservasi */}
          <Route path="/AdminLapangan/laporan" element={
            <RoleGuard allowedRoles={['AdminLapangan']}>
              <LaporanKonservasi />
            </RoleGuard>
          } />

          <Route path="/AdminLapangan/laporan/tambah" element={
            <RoleGuard allowedRoles={['AdminLapangan']}>
              <LaporanTambah />
            </RoleGuard>
          } />

          <Route path="/AdminLapangan/laporan/detail/:id" element={
            <RoleGuard allowedRoles={['AdminLapangan']}>
              <LaporanDetail />
            </RoleGuard>
          } />

          <Route path="/AdminLapangan/laporan/edit/:id" element={
            <RoleGuard allowedRoles={['AdminLapangan']}>
              <LaporanEdit />
            </RoleGuard>
          } />

          {/* Akun */}
          <Route path="/AdminLapangan/akun" element={
            <RoleGuard allowedRoles={['AdminLapangan']}>
              <Akun />
            </RoleGuard>
          } />

          {/* ================= ADMIN PUSAT (PROTECTED) ================= */}

          <Route path="/AdminPusat" element={
            <RoleGuard allowedRoles={['AdminPusat']}>
              <AdminPusatDashboard />
            </RoleGuard>
          } />

          {/* halaman admin pusat lainnya */}
          <Route path="/AdminPusat/pengguna" element={<AdminPusatPengguna />} />
          <Route path="/AdminPusat/galeri" element={<AdminPusatGaleri />} />
          <Route path="/AdminPusat/customer" element={<AdminPusatCustomer />} />
          <Route path="/AdminPusat/profil-perusahaan" element={<AdminPusatProfilPerusahaan />} />
          <Route path="/AdminPusat/program" element={<AdminPusatProgram />} />
          <Route path="/AdminPusat/konten" element={<AdminPusatKonten />} />
          <Route path="/AdminPusat/kawasan" element={<AdminPusatKawasan />} />
          <Route path="/AdminPusat/laporan" element={<AdminPusatLaporan />} />
          <Route path="/AdminPusat/laporan/detail/:id" element={<AdminPusatLaporanDetail />} />
          <Route path="/AdminPusat/peraturan" element={<AdminPusatPeraturan />} />
          <Route path="/AdminPusat/standar-pelayanan" element={<AdminPusatStandarPelayanan />} />
          <Route path="/AdminPusat/akun" element={<AdminPusatAkun />} />

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