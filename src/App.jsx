import React from 'react'
// Routing React Router
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
// Context untuk auth global (login, user, dll)
import { AuthProvider } from './contexts/AuthContext.jsx'
// Guard untuk proteksi role (admin pusat / lapangan)
import RoleGuard from './components/RoleGuard.jsx'

// ================= PUBLIC PAGES =================
import PublicHome from './pages/Public/Home.jsx'
import Program from './pages/Public/Program'
import ProgramDetail from './pages/Public/ProgramDetail'
import InformasiEdukasiDetailPublic from './pages/Public/InformasiEdukasiDetail.jsx'
import PublicInformasiEdukasi from './pages/Public/InformasiEdukasi.jsx'
import PublicStandarPelayanan from './pages/Public/StandarPelayanan.jsx'
import Profil from './pages/Public/Profil.jsx'
import Kontak from './pages/Public/Kontak'

// ================= AUTH =================
import Login from './pages/Auth/Login.jsx'
import ForgotPassword from './pages/Auth/ForgotPassword.jsx'
import ResetPassword from './pages/Auth/ResetPassword.jsx'
import VerifyEmail from './pages/Auth/VerifyEmail.jsx'

// ================= ADMIN LAPANGAN =================
import LaporanKonservasi from './pages/Main/LaporanKonservasi'
import LaporanTambah from './pages/Main/LaporanKonservasi/create.jsx'
import LaporanDetail from './pages/Main/LaporanKonservasi/detail.jsx'
import LaporanEdit from './pages/Main/LaporanKonservasi/edit.jsx'


// ================= ADMIN PUSAT =================
import Pengguna from './pages/Main/Pengguna/index'
import PenggunaCreate from './pages/Main/Pengguna/create.jsx'
import PenggunaDetail from './pages/Main/Pengguna/detail.jsx'
import PenggunaEdit from './pages/Main/Pengguna/edit.jsx'


import ProfilPerusahaan from './pages/Main/ProfilPerusahaan'
import ProfilPerusahaanEdit from './pages/Main/ProfilPerusahaan/edit.jsx'

import ProgramAdmin from './pages/Main/Program'
import ProgramCreate from './pages/Main/Program/create'
import ProgramAdminDetail from './pages/Main/Program/detail'
import ProgramEdit from './pages/Main/Program/edit'

import InformasiEdukasi from './pages/Main/InformasiEdukasi/index.jsx'
import InformasiEdukasiCreate from './pages/Main/InformasiEdukasi/create'
import InformasiEdukasiDetail from './pages/Main/InformasiEdukasi/detail'
import InformasiEdukasiEdit from './pages/Main/InformasiEdukasi/edit'

import Kawasan from './pages/Main/Kawasan/index.jsx'
import KawasanEdit from './pages/Main/Kawasan/edit.jsx'

import Peraturan from './pages/Main/Peraturan'
import PeraturanCreate from './pages/Main/Peraturan/create.jsx'
import PeraturanDetail from './pages/Main/Peraturan/detail.jsx'
import PeraturanEdit from './pages/Main/Peraturan/edit.jsx'

import StandarPelayanan from './pages/Main/StandarPelayanan'

import Akun from './pages/Main/Akun/index.jsx'
import AkunEdit from './pages/Main/Akun/edit'

import Dashboard from './pages/Main/Dashboard/index'

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

          {/* Program Public */}
          <Route path="/program" element={<Program />} />
          <Route path="/program/:slug" element={<ProgramDetail />} />

          {/* Halaman lain */}
          <Route path="/informasi-edukasi" element={<PublicInformasiEdukasi />} />
          <Route path="/informasi-edukasi/:slug" element={<InformasiEdukasiDetailPublic />} />

          <Route path="/standar-pelayanan" element={<PublicStandarPelayanan />} />

          <Route path="/profil" element={<Profil />} />
          <Route path="/kontak" element={<Kontak />} />

          {/* ================= AUTH ================= */}

          <Route path="/login" element={<Login />} />
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
              <DashboardAdminLapangan / >
            </RoleGuard>
          } /> */}

          <Route path="/dashboard" element={
            <RoleGuard allowedRoles={['admin_pusat', 'admin_lapangan']}>
              <Dashboard />
            </RoleGuard>
          } />



          {/* CRUD laporan konservasi */}
          <Route path="/laporan-konservasi" element={
            <RoleGuard allowedRoles={['admin_pusat', 'admin_lapangan']}>
              <LaporanKonservasi />
            </RoleGuard>
          } />


          <Route path="/laporan-konservasi/create" element={
            <RoleGuard allowedRoles={['admin_lapangan']}>
              <LaporanTambah />
            </RoleGuard>
          } />


          <Route path="/laporan-konservasi/detail/:id" element={
            <RoleGuard allowedRoles={['admin_pusat', 'admin_lapangan']}>
              <LaporanDetail />
            </RoleGuard>
          } />


          <Route path="/laporan-konservasi/edit/:id" element={
            <RoleGuard allowedRoles={['admin_pusat', 'admin_lapangan']}>
              <LaporanEdit />
            </RoleGuard>
          } />


          {/* Akun */}
          <Route
            path="/akun"
            element={
              <RoleGuard allowedRoles={['admin_pusat', 'admin_lapangan']}>
                <Akun />
              </RoleGuard>
            }
          />

          <Route
            path="/akun/edit"
            element={
              <RoleGuard allowedRoles={['admin_pusat', 'admin_lapangan']}>
                <AkunEdit />
              </RoleGuard>
            }
          />

          {/* ================= ADMIN PUSAT (PROTECTED) ================= */}

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

         

          <Route path="/profil-perusahaan" element={
            <RoleGuard allowedRoles={['admin_pusat']}>
              <ProfilPerusahaan />
            </RoleGuard>
          } />

          <Route path="/profil-perusahaan/edit" element={
            <RoleGuard allowedRoles={['admin_pusat']}>
              <ProfilPerusahaanEdit />
            </RoleGuard>
          } />

          <Route path="/dashboard/program" element={
            <RoleGuard allowedRoles={['admin_pusat']}>
              <ProgramAdmin />
            </RoleGuard>
          } />

          <Route
            path="/dashboard/program/create"
            element={
              <RoleGuard allowedRoles={['admin_pusat']}>
                <ProgramCreate />
              </RoleGuard>
            } />

          <Route
            path="/dashboard/program/detail/:id"
            element={
              <RoleGuard allowedRoles={['admin_pusat']}>
                <ProgramAdminDetail />
              </RoleGuard>
            } />

          <Route
            path="/dashboard/program/edit/:id"
            element={
              <RoleGuard allowedRoles={['admin_pusat']}>
                <ProgramEdit />
              </RoleGuard>
            } />

          <Route path="/dashboard/informasi-edukasi" element={
  <RoleGuard allowedRoles={['admin_pusat']}>
    <InformasiEdukasi />
  </RoleGuard>
} />

<Route
  path="/dashboard/informasi-edukasi/create"
  element={
    <RoleGuard allowedRoles={['admin_pusat']}>
      <InformasiEdukasiCreate />
    </RoleGuard>
  }
/>

<Route
  path="/dashboard/informasi-edukasi/detail/:id"
  element={
    <RoleGuard allowedRoles={['admin_pusat']}>
      <InformasiEdukasiDetail />
    </RoleGuard>
  }
/>

<Route
  path="/dashboard/informasi-edukasi/edit/:id"
  element={
    <RoleGuard allowedRoles={['admin_pusat']}>
      <InformasiEdukasiEdit />
    </RoleGuard>
  }
/>

          <Route path="/kawasan" element={
            <RoleGuard allowedRoles={['admin_pusat']}>
              <Kawasan />
            </RoleGuard>
          } />

          <Route path="/kawasan/edit/:id" element={
            <RoleGuard allowedRoles={['admin_pusat']}>
              <KawasanEdit />
            </RoleGuard>
          } />

          <Route path="/peraturan" element={
            <RoleGuard allowedRoles={['admin_pusat']}>
              <Peraturan />
            </RoleGuard>
          } />

          <Route
            path="/peraturan/create"
            element={
              <RoleGuard allowedRoles={['admin_pusat']}>
                <PeraturanCreate />
              </RoleGuard>
            }
          />

          <Route
            path="/peraturan/detail/:id"
            element={
              <RoleGuard allowedRoles={['admin_pusat']}>
                <PeraturanDetail />
              </RoleGuard>
            }
          />

          <Route
            path="/peraturan/edit/:id"
            element={
              <RoleGuard allowedRoles={['admin_pusat']}>
                <PeraturanEdit />
              </RoleGuard>
            }
          />

          <Route path="/pesan-masuk" element={
            <RoleGuard allowedRoles={['admin_pusat']}>
              <StandarPelayanan />
            </RoleGuard>
          } />

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
