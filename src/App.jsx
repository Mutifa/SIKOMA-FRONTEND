import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext.jsx'
import RoleGuard from './components/RoleGuard.jsx'
import PublicHome from './pages/Public/Home.jsx'
import PublicEdukasi from './pages/Public/Edukasi.jsx'
import PublicEdukasiDetail from './pages/Public/EdukasiDetail.jsx'
import PublicInformasi from './pages/Public/Informasi.jsx'
import PublicStandarPelayanan from './pages/Public/StandarPelayanan.jsx'
import Profil from './pages/Public/Profil.jsx'
import Login from './pages/Auth/Login.jsx'
import Register from './pages/Auth/Register.jsx'
import ForgotPassword from './pages/Auth/ForgotPassword.jsx'
import ResetPassword from './pages/Auth/ResetPassword.jsx'
import VerifyEmail from './pages/Auth/VerifyEmail.jsx'
import AdminLapanganDashboard from './pages/AdminLapangan/Dashboard.jsx'
import LaporanKonservasi from './pages/AdminLapangan/LaporanKonservasi.jsx'
import LaporanTambah from './pages/AdminLapangan/LaporanTambah.jsx'
import LaporanDetail from './pages/AdminLapangan/LaporanDetail.jsx'
import LaporanEdit from './pages/AdminLapangan/LaporanEdit.jsx'
import Akun from './pages/AdminLapangan/Akun.jsx'
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
import NotFound from './pages/NotFound.jsx'
import HealthCheck from './pages/HealthCheck.jsx'
import DashboardAdminLapangan from './pages/AdminLapangan/Dashboard'
import Kontak from './pages/Public/Kontak'
export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<PublicHome />} />
          <Route path="/edukasi" element={<PublicEdukasi />} />
          <Route path="/edukasi/:slug" element={<PublicEdukasiDetail />} />
          <Route path="/informasi" element={<PublicInformasi />} />
          <Route path="/standar-pelayanan" element={<PublicStandarPelayanan />} />
          <Route path="/profil" element={<Profil />} />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/admin-pusat/dashboard" element={<AdminPusatDashboard />} />
          <Route path="/kontak" element={<Kontak />} />

          {/* AdminLapangan Routes */}cd
          <Route path="/admin-lapangan/dashboard" element={
  <RoleGuard allowedRoles={['admin_lapangan']}>
    <DashboardAdminLapangan />
  </RoleGuard>
} />
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
          <Route path="/AdminLapangan/akun" element={
            <RoleGuard allowedRoles={['AdminLapangan']}>
              <Akun />
            </RoleGuard>
          } />

          {/* AdminPusat Routes */}
          <Route path="/AdminPusat" element={
            <RoleGuard allowedRoles={['AdminPusat']}>
              <AdminPusatDashboard />
            </RoleGuard>
          } />
          <Route path="/AdminPusat/pengguna" element={
            <RoleGuard allowedRoles={['AdminPusat']}>
              <AdminPusatPengguna />
            </RoleGuard>
          } />
          <Route path="/AdminPusat/galeri" element={
            <RoleGuard allowedRoles={['AdminPusat']}>
              <AdminPusatGaleri />
            </RoleGuard>
          } />
          <Route path="/AdminPusat/customer" element={
            <RoleGuard allowedRoles={['AdminPusat']}>
              <AdminPusatCustomer />
            </RoleGuard>
          } />
          <Route path="/AdminPusat/profil-perusahaan" element={
            <RoleGuard allowedRoles={['AdminPusat']}>
              <AdminPusatProfilPerusahaan />
            </RoleGuard>
          } />
          <Route path="/AdminPusat/program" element={
            <RoleGuard allowedRoles={['AdminPusat']}>
              <AdminPusatProgram />
            </RoleGuard>
          } />
          <Route path="/AdminPusat/konten" element={
            <RoleGuard allowedRoles={['AdminPusat']}>
              <AdminPusatKonten />
            </RoleGuard>
          } />
          <Route path="/AdminPusat/kawasan" element={
            <RoleGuard allowedRoles={['AdminPusat']}>
              <AdminPusatKawasan />
            </RoleGuard>
          } />
          <Route path="/AdminPusat/laporan" element={
            <RoleGuard allowedRoles={['AdminPusat']}>
              <AdminPusatLaporan />
            </RoleGuard>
          } />
          <Route path="/AdminPusat/laporan/detail/:id" element={
            <RoleGuard allowedRoles={['AdminPusat']}>
              <AdminPusatLaporanDetail />
            </RoleGuard>
          } />
          <Route path="/AdminPusat/peraturan" element={
            <RoleGuard allowedRoles={['AdminPusat']}>
              <AdminPusatPeraturan />
            </RoleGuard>
          } />
          <Route path="/AdminPusat/standar-pelayanan" element={
            <RoleGuard allowedRoles={['AdminPusat']}>
              <AdminPusatStandarPelayanan />
            </RoleGuard>
          } />
          <Route path="/AdminPusat/akun" element={
            <RoleGuard allowedRoles={['AdminPusat']}>
              <AdminPusatAkun />
            </RoleGuard>
          } />
          <Route path="/health" element={<HealthCheck />} />

          <Route path="/home" element={<Navigate to="/" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}


