import React from 'react' 
// Import library React untuk menggunakan state dan lifecycle (useEffect)

import Navbar from './Navbar.jsx' 
// Import komponen Navbar (header) → sudah modular

import Footer from './Footer.jsx' 
// Import komponen Footer → reusable di semua halaman

import api from '../lib/api.js' 
// Import instance axios (untuk komunikasi ke backend API)

import Spinner from '../components/Spinner.jsx' 
// Import komponen loading indicator (spinner)


// Komponen Template → digunakan sebagai layout utama halaman public
export default function Template({ title, active, children }) {

  // State untuk menyimpan data website (dari API)
  const [website, setWebsite] = React.useState(null)

  // State untuk mengontrol loading (spinner)
  const [loading, setLoading] = React.useState(false)


  // useEffect dijalankan saat pertama kali komponen di-render (mount)
  React.useEffect(() => {

    let mounted = true 
    // Flag untuk memastikan state hanya di-update jika komponen masih aktif
    // (menghindari memory leak / error async)

    setLoading(true) 
    // Aktifkan spinner saat request dimulai

    api.get('/home') 
    // Request ke endpoint backend untuk mengambil data website

      .then(res => {
        // Jika request berhasil

        if (mounted) {
          // Pastikan komponen masih aktif sebelum update state

          setWebsite(
            res.data.website ||           // jika struktur langsung
            res.data.data?.website ||     // jika nested (optional chaining)
            res.data.data                // fallback jika beda struktur
          )
        }
      })

      .catch(() => {}) 
      // Error handling (disederhanakan, bisa dikembangkan)

      .finally(() => {
        // Akan selalu dijalankan (success / error)

        if (mounted) setLoading(false) 
        // Matikan spinner setelah request selesai
      })

    return () => { mounted = false } 
    // Cleanup function → dijalankan saat komponen unmount
    // untuk mencegah update state setelah komponen hilang

  }, []) 
  // Dependency array kosong → hanya dijalankan sekali saat mount


  // Render tampilan layout
  return (
    <div>

      {/* Spinner → muncul saat loading true */}
      <Spinner show={loading} />

      {/* Navbar → menerima props active (menu aktif) dan data website */}
      <Navbar active={active} website={website} />

      {/* Main content → menampilkan halaman yang dibungkus Template */}
      <main>
        {children}
      </main>

      {/* Footer → menerima data website */}
      <Footer website={website} />

    </div>
  )
}