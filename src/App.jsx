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


import Galeri from './pages/Main/Galeri'
import GaleriCreate from './pages/Main/Galeri/create'
import GaleriDetail from './pages/Main/Galeri/detail'
import GaleriEdit from './pages/Main/Galeri/edit'


import ProfilPerusahaan from './pages/Main/ProfilPerusahaan'

import Program from './pages/Main/Program'
import ProgramCreate from './pages/Main/Program/create'
import ProgramDetail from './pages/Main/Program/detail'
import ProgramEdit from './pages/Main/Program/edit'

import Konten from './pages/Main/Konten/index.jsx'
import KontenCreate from './pages/Main/Konten/create'
import KontenDetail from './pages/Main/Konten/detail'
import KontenEdit from './pages/Main/Konten/edit'

import Kawasan from './pages/Main/Kawasan'

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

          {/* Edukasi */}
          <Route path="/edukasi" element={<PublicEdukasi />} />

          {/* Detail edukasi (pakai slug) */}
          <Route path="/edukasi/:slug" element={<PublicEdukasiDetail />} />

          {/* Halaman lain */}
          <Route path="/informasi" element={<PublicInformasi />} />
          <Route path="/informasi/:slug" element={<InformasiDetail />} />

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

          <Route path="/dashboard" element={<Dashboard />} />



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
   
          <Route path="/galeri" element={
            <RoleGuard allowedRoles={['admin_pusat', 'admin_lapangan']}>
              <Galeri />
            </RoleGuard>
          } />
          <Route path="/galeri/create" element={
            <RoleGuard allowedRoles={['admin_pusat']}>
              <GaleriCreate />
            </RoleGuard>
          } />
          <Route path="/galeri/detail/:id" element={
            <RoleGuard allowedRoles={['admin_pusat', 'admin_lapangan']}>
              <GaleriDetail />
            </RoleGuard>
          } />
          <Route path="/galeri/edit/:id" element={
            <RoleGuard allowedRoles={['admin_pusat']}>
              <GaleriEdit />
            </RoleGuard>
          } />


          <Route path="/profil-perusahaan" element={
            <RoleGuard allowedRoles={['admin_pusat']}>
              <ProfilPerusahaan />
            </RoleGuard>
          } />

          <Route path="/program" element={
            <RoleGuard allowedRoles={['admin_pusat']}>
              <Program />
            </RoleGuard>
          } />
          <Route
            path="/program/create"
            element={
              <RoleGuard allowedRoles={['admin_pusat']}>
                <ProgramCreate />
              </RoleGuard>
            }
          />

          <Route
            path="/program/detail/:id"
            element={
              <RoleGuard allowedRoles={['admin_pusat']}>
                <ProgramDetail />
              </RoleGuard>
            }
          />

          <Route
            path="/program/edit/:id"
            element={
              <RoleGuard allowedRoles={['admin_pusat']}>
                <ProgramEdit />
              </RoleGuard>
            }
          />

          <Route path="/konten" element={
            <RoleGuard allowedRoles={['admin_pusat']}>
              <Konten />
            </RoleGuard>
          } />
          <Route
            path="/konten/create"
            element={
              <RoleGuard allowedRoles={['admin_pusat']}>
                <KontenCreate />
              </RoleGuard>
            }
          />
          <Route
            path="/konten/detail/:id"
            element={
              <RoleGuard allowedRoles={['admin_pusat']}>
                <KontenDetail />
              </RoleGuard>
            }
          />
          <Route
            path="/konten/edit/:id"
            element={
              <RoleGuard allowedRoles={['admin_pusat']}>
                <KontenEdit />
              </RoleGuard>
            }
          />

          <Route path="/kawasan" element={
            <RoleGuard allowedRoles={['admin_pusat']}>
              <Kawasan />
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

          <Route path="/admin-pusat/standar-pelayanan" element={
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
