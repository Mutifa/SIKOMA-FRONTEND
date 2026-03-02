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
import AdminDashboard from './pages/Admin/Dashboard.jsx'
import LaporanKonservasi from './pages/Admin/LaporanKonservasi.jsx'
import LaporanTambah from './pages/Admin/LaporanTambah.jsx'
import LaporanDetail from './pages/Admin/LaporanDetail.jsx'
import LaporanEdit from './pages/Admin/LaporanEdit.jsx'
import Akun from './pages/Admin/Akun.jsx'
import SuperadminDashboard from './pages/Superadmin/Dashboard.jsx'
import SuperadminPengguna from './pages/Superadmin/Pengguna.jsx'
import SuperadminGaleri from './pages/Superadmin/Galeri.jsx'
import SuperadminCustomer from './pages/Superadmin/Customer.jsx'
import SuperadminProfilPerusahaan from './pages/Superadmin/ProfilPerusahaan.jsx'
import SuperadminProgram from './pages/Superadmin/Program.jsx'
import SuperadminKonten from './pages/Superadmin/Konten.jsx'
import SuperadminKawasan from './pages/Superadmin/Kawasan.jsx'
import SuperadminLaporan from './pages/Superadmin/Laporan.jsx'
import SuperadminLaporanDetail from './pages/Superadmin/LaporanDetail.jsx'
import SuperadminPeraturan from './pages/Superadmin/Peraturan.jsx'
import SuperadminStandarPelayanan from './pages/Superadmin/StandarPelayanan.jsx'
import SuperadminAkun from './pages/Superadmin/Akun.jsx'
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
          <Route path="/admin" element={
            <RoleGuard allowedRoles={['admin']}>
              <AdminDashboard />
            </RoleGuard>
          } />
          <Route path="/admin/laporan" element={
            <RoleGuard allowedRoles={['admin']}>
              <LaporanKonservasi />
            </RoleGuard>
          } />
          <Route path="/admin/laporan/tambah" element={
            <RoleGuard allowedRoles={['admin']}>
              <LaporanTambah />
            </RoleGuard>
          } />
          <Route path="/admin/laporan/detail/:id" element={
            <RoleGuard allowedRoles={['admin']}>
              <LaporanDetail />
            </RoleGuard>
          } />
          <Route path="/admin/laporan/edit/:id" element={
            <RoleGuard allowedRoles={['admin']}>
              <LaporanEdit />
            </RoleGuard>
          } />
          <Route path="/admin/akun" element={
            <RoleGuard allowedRoles={['admin']}>
              <Akun />
            </RoleGuard>
          } />

          {/* Superadmin Routes */}
          <Route path="/superadmin" element={
            <RoleGuard allowedRoles={['superadmin']}>
              <SuperadminDashboard />
            </RoleGuard>
          } />
          <Route path="/superadmin/pengguna" element={
            <RoleGuard allowedRoles={['superadmin']}>
              <SuperadminPengguna />
            </RoleGuard>
          } />
          <Route path="/superadmin/galeri" element={
            <RoleGuard allowedRoles={['superadmin']}>
              <SuperadminGaleri />
            </RoleGuard>
          } />
          <Route path="/superadmin/customer" element={
            <RoleGuard allowedRoles={['superadmin']}>
              <SuperadminCustomer />
            </RoleGuard>
          } />
          <Route path="/superadmin/profil-perusahaan" element={
            <RoleGuard allowedRoles={['superadmin']}>
              <SuperadminProfilPerusahaan />
            </RoleGuard>
          } />
          <Route path="/superadmin/program" element={
            <RoleGuard allowedRoles={['superadmin']}>
              <SuperadminProgram />
            </RoleGuard>
          } />
          <Route path="/superadmin/konten" element={
            <RoleGuard allowedRoles={['superadmin']}>
              <SuperadminKonten />
            </RoleGuard>
          } />
          <Route path="/superadmin/kawasan" element={
            <RoleGuard allowedRoles={['superadmin']}>
              <SuperadminKawasan />
            </RoleGuard>
          } />
          <Route path="/superadmin/laporan" element={
            <RoleGuard allowedRoles={['superadmin']}>
              <SuperadminLaporan />
            </RoleGuard>
          } />
          <Route path="/superadmin/laporan/detail/:id" element={
            <RoleGuard allowedRoles={['superadmin']}>
              <SuperadminLaporanDetail />
            </RoleGuard>
          } />
          <Route path="/superadmin/peraturan" element={
            <RoleGuard allowedRoles={['superadmin']}>
              <SuperadminPeraturan />
            </RoleGuard>
          } />
          <Route path="/superadmin/standar-pelayanan" element={
            <RoleGuard allowedRoles={['superadmin']}>
              <SuperadminStandarPelayanan />
            </RoleGuard>
          } />
          <Route path="/superadmin/akun" element={
            <RoleGuard allowedRoles={['superadmin']}>
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


