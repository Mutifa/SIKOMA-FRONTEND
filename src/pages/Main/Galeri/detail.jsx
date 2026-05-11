import React from 'react'
import { Link, useParams } from 'react-router-dom'

import DashboardLayout from '../../../layouts/DashboardLayout'
import api from '../../../lib/api.js'

// ─────────────────────────────────────────────
// Halaman Detail Galeri
// Menampilkan data galeri secara read-only berdasarkan ID dari URL
// ─────────────────────────────────────────────
export default function GaleriDetail() {

  // Ambil ID galeri dari parameter URL
  const { id } = useParams()

  // State loading saat fetch data berlangsung
  const [loading, setLoading] = React.useState(true)

  // State data galeri yang ditampilkan
  const [data, setData] = React.useState(null)

  // ─────────────────────────────────────────────
  // Fetch detail galeri berdasarkan ID
  // Re-fetch otomatis jika ID di URL berubah
  // ─────────────────────────────────────────────
  React.useEffect(() => {

    let mounted = true

    api.get(`/admin_pusat/galeri/${id}`)

      .then(res => {

        if (mounted) {

          // Ambil data dari struktur response yang mungkin berbeda
          const result = res.data.data || res.data

          setData(result)

          setLoading(false)

        }

      })

      .catch(err => {

        // Log error ke console (belum ada UI feedback error)
        console.log(err)

        setLoading(false)

      })

    // Cleanup: set mounted = false saat komponen di-unmount
    return () => { mounted = false }

  }, [id])

  // ─────────────────────────────────────────────
  // Tampilkan spinner saat data sedang dimuat
  // ─────────────────────────────────────────────
  if (loading) {

    return (

      <DashboardLayout title="Detail Galeri">

        <div className="d-flex justify-content-center">
          <div className="spinner-border"></div>
        </div>

      </DashboardLayout>

    )

  }

  // ─────────────────────────────────────────────
  // Render utama: tampilan detail galeri (read-only)
  // ─────────────────────────────────────────────
  return (

    <DashboardLayout title="Detail Galeri">

      <div className="white-box">

        {/* Field: Key Galeri (read-only) */}
        <div className="mb-3">

          <label className="form-label fw-bold">
            Key Galeri
          </label>

          <input
            type="text"
            className="form-control"
            value={data?.keygaleri || ''}
            readOnly
          />

        </div>

        {/* Field: Judul (read-only) */}
        <div className="mb-3">

          <label className="form-label fw-bold">
            Judul
          </label>

          <input
            type="text"
            className="form-control"
            value={data?.judul || ''}
            readOnly
          />

        </div>

        {/* Field: Deskripsi (read-only)
            Fallback ke `keterangan` jika `deskripsi` tidak tersedia */}
        <div className="mb-3">

          <label className="form-label fw-bold">
            Deskripsi
          </label>

          <textarea
            className="form-control"
            rows="5"
            value={data?.deskripsi || data?.keterangan || ''}
            readOnly
          />

        </div>

        {/* Field: Gambar
            Tampilkan preview gambar jika ada, atau teks placeholder jika tidak */}
        <div className="mb-3">

          <label className="form-label fw-bold">
            Gambar
          </label>

          <div>

            {data?.gambar ? (

              // Preview gambar dari storage server
              <img
                src={`http://127.0.0.1:8000/uploads/galeri/${data.gambar}`}
                alt="Galeri"
                className="img-thumbnail"
                style={{ maxHeight: '250px' }}
              />

            ) : (

              // Placeholder jika tidak ada gambar
              <p className="text-muted">
                Tidak ada gambar
              </p>

            )}

          </div>

        </div>

        {/* Tombol kembali ke daftar galeri */}
        <Link
          to="/galeri"
          className="btn btn-secondary"
        >
          Kembali
        </Link>

      </div>

    </DashboardLayout>

  )
}