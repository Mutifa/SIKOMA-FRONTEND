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
import AdminDashboard from './pages/AdminLapangan/Dashboard.jsx'
import LaporanKonservasi from './pages/AdminLapangan/LaporanKonservasi.jsx'
import LaporanTambah from './pages/AdminLapangan/LaporanTambah.jsx'
import LaporanDetail from './pages/AdminLapangan/LaporanDetail.jsx'
import LaporanEdit from './pages/AdminLapangan/LaporanEdit.jsx'
import Akun from './pages/AdminLapangan/Akun.jsx'
import SuperadminDashboard from './pages/AdminPusat/Dashboard.jsx'
import SuperadminPengguna from './pages/AdminPusat/Pengguna.jsx'
import SuperadminGaleri from './pages/AdminPusat/Galeri.jsx'
import SuperadminCustomer from './pages/AdminPusat/Customer.jsx'
import SuperadminProfilPerusahaan from './pages/AdminPusat/ProfilPerusahaan.jsx'
import SuperadminProgram from './pages/AdminPusat/Program.jsx'
import SuperadminKonten from './pages/AdminPusat/Konten.jsx'
import SuperadminKawasan from './pages/AdminPusat/Kawasan.jsx'
import SuperadminLaporan from './pages/AdminPusat/Laporan.jsx'
import SuperadminLaporanDetail from './pages/AdminPusat/LaporanDetail.jsx'
import SuperadminPeraturan from './pages/AdminPusat/Peraturan.jsx'
import SuperadminStandarPelayanan from './pages/AdminPusat/StandarPelayanan.jsx'
import SuperadminAkun from './pages/AdminPusat/Akun.jsx'
import NotFound from './pages/NotFound.jsx'
import HealthCheck from './pages/HealthCheck.jsx'

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

          {/* Admin Routes */}cd
          <Route path="/AdminLapangan" element={
            <RoleGuard allowedRoles={['AdminLapangan']}>
              <AdminDashboard />
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
          <Route path="/admin/laporan/edit/:id" element={
            <RoleGuard allowedRoles={['AdminLapangan']}>
              <LaporanEdit />
            </RoleGuard>
          } />
          <Route path="/AdminLapangan/akun" element={
            <RoleGuard allowedRoles={['AdminLapangan']}>
              <Akun />
            </RoleGuard>
          } />

          {/* Superadmin Routes */}
          <Route path="/AdminPusat" element={
            <RoleGuard allowedRoles={['AdminPusat']}>
              <SuperadminDashboard />
            </RoleGuard>
          } />
          <Route path="/AdminPusat/pengguna" element={
            <RoleGuard allowedRoles={['AdminPusat']}>
              <SuperadminPengguna />
            </RoleGuard>
          } />
          <Route path="/AdminPusat/galeri" element={
            <RoleGuard allowedRoles={['AdminPusat']}>
              <SuperadminGaleri />
            </RoleGuard>
          } />
          <Route path="/AdminPusat/customer" element={
            <RoleGuard allowedRoles={['AdminPusat']}>
              <SuperadminCustomer />
            </RoleGuard>
          } />
          <Route path="/AdminPusat/profil-perusahaan" element={
            <RoleGuard allowedRoles={['AdminPusat']}>
              <SuperadminProfilPerusahaan />
            </RoleGuard>
          } />
          <Route path="/AdminPusat/program" element={
            <RoleGuard allowedRoles={['AdminPusat']}>
              <SuperadminProgram />
            </RoleGuard>
          } />
          <Route path="/AdminPusat/konten" element={
            <RoleGuard allowedRoles={['AdminPusat']}>
              <SuperadminKonten />
            </RoleGuard>
          } />
          <Route path="/AdminPusat/kawasan" element={
            <RoleGuard allowedRoles={['AdminPusat']}>
              <SuperadminKawasan />
            </RoleGuard>
          } />
          <Route path="/AdminPusat/laporan" element={
            <RoleGuard allowedRoles={['AdminPusat']}>
              <SuperadminLaporan />
            </RoleGuard>
          } />
          <Route path="/AdminPusat/laporan/detail/:id" element={
            <RoleGuard allowedRoles={['AdminPusat']}>
              <SuperadminLaporanDetail />
            </RoleGuard>
          } />
          <Route path="/AdminPusat/peraturan" element={
            <RoleGuard allowedRoles={['AdminPusat']}>
              <SuperadminPeraturan />
            </RoleGuard>
          } />
          <Route path="/AdminPusat/standar-pelayanan" element={
            <RoleGuard allowedRoles={['AdminPusat']}>
              <SuperadminStandarPelayanan />
            </RoleGuard>
          } />
          <Route path="/AdminPusat/akun" element={
            <RoleGuard allowedRoles={['AdminPusat']}>
              <SuperadminAkun />
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


