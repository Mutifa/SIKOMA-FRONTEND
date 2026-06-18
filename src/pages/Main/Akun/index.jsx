import React from 'react'
import { Link } from 'react-router-dom'

import DashboardLayout from '../../../layouts/DashboardLayout.jsx'
import { useAuth } from '../../../contexts/AuthContext.jsx'
import { akunService } from '../../../services/akunService.js'

// Pemetaan role ke label dan warna badge
const roleMap = {
  admin_pusat: { label: 'Admin Pusat', bg: '#EAF3DE', color: '#3B6D11' },
  super_admin: { label: 'Super Admin', bg: '#FCEBEB', color: '#A32D2D' },
  admin_lapangan: { label: 'Admin Lapangan', bg: '#dbeafe', color: '#1e3a8a' },
}
// Ambil maksimal 2 huruf pertama dari kata-kata dalam nama untuk dijadikan inisial avatar
// Contoh: "Budi Santoso" -> "BS", kosong -> "A" (default)
const getInitials = (name = '') => {
  const words = name.trim().split(/\s+/).filter(Boolean)
  if (!words.length) return 'A'
  return words.slice(0, 2).map(word => word[0]).join('').toUpperCase()
}

// Komponen baris info (icon + label + value) yang dipakai berulang di card "Informasi Profil"
const InfoItem = ({ icon, label, value }) => (
  <div className="akun-info-item">
    <div className="akun-info-icon">
      <i className={`fas ${icon}`}></i>
    </div>
    <div className="akun-info-content">
      <span className="akun-field-label">{label}</span>
      <div className="akun-field-value">{value || '-'}</div>
    </div>
  </div>
)

// Helper untuk menormalkan struktur response API yang bisa beda-beda bentuk
// (kadang { data: { user } }, kadang { user }, kadang langsung data-nya)
// fallbackUser dipakai sebagai data cadangan kalau field tertentu tidak ada di response
const extractProfile = (payload, fallbackUser = {}) => {
  const data = payload?.data?.user || payload?.user || payload?.data || payload || {}
  return {
    ...fallbackUser,
    ...data,
    name: data.name || data.nama || fallbackUser?.name || '', //// antisipasi field "nama" vs "name"
    username: data.username || fallbackUser?.username || '',
    email: data.email || fallbackUser?.email || '',
    role: data.role || fallbackUser?.role || '',
  }
}

export default function Akun() {
  const { user: authUser } = useAuth()// Ambil data user dari context auth untuk digunakan sebagai fallback jika response API tidak lengkap

  // State untuk menyimpan data profil yang akan ditampilkan, status loading, dan pesan error jika gagal load
  const [user, setUser] = React.useState({ name: '', username: '', email: '', role: '' })
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState('')

  // Ambil data profil dari API saat komponen pertama kali dimuat
  React.useEffect(() => {
    let mounted = true// Flag untuk mencegah update state jika komponen sudah tidak ada (unmounted)
   
    // Panggil API untuk mendapatkan data profil berdasarkan role user yang sedang login
    akunService.getProfile(authUser?.role)
      .then(res => {
        console.log('AKUN RESPONSE:', res.data) // debug log response API (bisa dihapus kalau sudah tidak diperlukan)
        if (mounted) {
          const userData = extractProfile(res.data, authUser)
          setUser(userData)
          setLoading(false)
        }
      })
      .catch(() => {
        // Jika gagal load data profil, tetap tampilkan halaman dengan data dari context auth sebagai fallback
        if (mounted) {
          if (authUser) {
            setUser(extractProfile(null, authUser))
          } else {
            setError('Gagal memuat data profil')
          }
          setLoading(false)
        }
      })
    return () => { mounted = false } // Bersihkan flag saat komponen di-unmount untuk mencegah memory leak
  }, [authUser])

  // Dapatkan informasi role untuk ditampilkan di badge (jika role tidak dikenali, tampilkan label role apa adanya dengan warna netral)
  const roleInfo = roleMap[user.role] || { label: user.role || '-', bg: '#f3f4f6', color: '#374151' }

  // Render loading spinner saat data profil sedang dimuat
  if (loading) {
    return (
      <DashboardLayout title="Akun">
        <div className="loading-center">
          <div className="spinner-border"></div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout title="Akun">
      {error && <div className="alert alert-danger">{error}</div>}

      <section className="akun-shell">
        // Hero section dengan avatar, nama, email, role badge, dan tombol edit profil
        <div className="akun-hero">
          <div className="akun-avatar" aria-hidden="true">
            {getInitials(user.name)}
          </div>

          <div className="akun-hero-main">

            <div>
              <h4 className="akun-name">{user.name || 'Admin'}</h4>
              <p className="akun-email">{user.email || '-'}</p>
              <span
                className="akun-role-badge mt-1"
                style={{ background: roleInfo.bg, color: roleInfo.color }}
              >
                {roleInfo.label}
              </span>
            </div>

            <div className="akun-quick-row">
              <span><i className="fas fa-user"></i>{user.username || '-'}</span>
              <span><i className="fas fa-shield-alt"></i>Akun aktif</span>
            </div>
          </div>

          <Link to="/akun/edit" className="btn-primary-custom akun-edit-button">
            <i className="fas fa-pen"></i>
            Edit Profil
          </Link>
        </div>

        <div className="akun-grid">
          // Kartu informasi profil dengan icon, label, dan value untuk setiap field
          <div className="akun-card">
            <div className="akun-section-title">
              <span className="akun-section-dot"></span>
              Informasi Profil
            </div>

            <div className="akun-info-list">
              <InfoItem icon="fa-id-card" label="Nama" value={user.name} />
              <InfoItem icon="fa-user" label="Username" value={user.username} />
              <InfoItem icon="fa-envelope" label="Email" value={user.email} />
              <InfoItem icon="fa-user-shield" label="Role" value={roleInfo.label} />
            </div>
          </div>

          // Kartu keamanan dengan informasi tentang password dan tombol untuk mengubah password
          <div className="akun-card akun-card-soft">
            <div className="akun-section-title">
              <span className="akun-section-dot"></span>
              Keamanan
            </div>

            <div className="akun-security-box">
              <div className="akun-security-icon">
                <i className="fas fa-lock"></i>
              </div>
              <div>
                <h5>Password</h5>
                <p>Gunakan password yang kuat dan ganti secara berkala.</p>
              </div>
            </div>

            // Tampilkan password sebagai titik-titik untuk menjaga keamanan, dengan aria-label untuk aksesibilitas
            <div className="akun-field-value akun-password-dots" aria-label="Password disembunyikan">
              ********
            </div>

            <Link to="/akun/edit" className="btn-secondary-custom akun-full-button">
              <i className="fas fa-key"></i>
              Ubah Password
            </Link>
          </div>
        </div>
      </section>
    </DashboardLayout>
  )
}
