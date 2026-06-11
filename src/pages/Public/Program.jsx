import React from 'react'
import Template from '../../layouts/Template.jsx'
import { assetUrl } from '../../lib/assets.js'
import api from '../../lib/api.js'
import { Link } from 'react-router-dom'
import { SkeletonCard } from '../../components/Skeleton.jsx'

// Fungsi strip HTML lalu potong teks bersih
function stripHtml(html = '') {
  return html.replace(/<[^>]*>/g, '').replace(/&[^;]+;/g, ' ').trim()
}

function truncate(text, max = 110) {
  if (text.length <= max) return text
  return text.slice(0, max).replace(/\s+\S*$/, '') + '...'
}

export default function Program() {
  const [items, setItems] = React.useState([])
  const [kategori, setKategori] = React.useState('')
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState('')

  React.useEffect(() => {
    let mounted = true

    api.get('/program')
      .then(res => {
        if (mounted) {
          setItems(Array.isArray(res.data) ? res.data : res.data.data || [])
          setKategori(res.data.kategori || '')
          setLoading(false)
        }
      })
      .catch(err => {
        if (mounted) {
          setError(err.response?.data?.message || 'Gagal memuat program')
          setLoading(false)
        }
      })

    return () => { mounted = false }
  }, [])

  return (
    <Template title="Edukasi" active="edukasi">

      {/* HEADER */}
      <div className="container-fluid page-header py-5 mb-5">
        <div className="container text-center py-5">
          <h1 className="display-5 text-white mb-4">
            {kategori || 'Program'}
          </h1>
        </div>
      </div>

      {/* CONTENT */}
      <section className="container-xxl py-5">
        <div className="container">

          <h2 className="mb-4 heading-green">
            Berbagai kegiatan yang mendukung pengelolaan kawasan hutan.
          </h2>

          {error && <div className="alert alert-danger">{error}</div>}

          <div className="row g-4">
            {loading ? (
              // Skeleton loading: tampilkan 6 skeleton cards dengan reserved space
              Array.from({ length: 6 }).map((_, idx) => (
                <div key={`skeleton-${idx}`} className="col-md-6 col-lg-4 d-flex">
                  <SkeletonCard />
                </div>
              ))
            ) : items.length > 0 ? (
              items.map((p) => (
                <div key={p.id} className="col-md-6 col-lg-4 d-flex">
                  <div className="card w-100 shadow-sm" style={{ borderRadius: 12, overflow: 'hidden' }}>

                    {/* IMAGE */}
                    <img
                      src={`https://codemy.my.id/uploads/program/${p.foto}`}
                      alt={p.judul}
                      className="card-img-top"
                      width={400}
                      height={200}
                      loading="lazy"
                      decoding="async"
                      style={{ objectFit: 'cover', width: '100%' }}
                      onError={e => { e.currentTarget.style.display = 'none' }}
                    />

                    {/* BODY */}
                    <div className="card-body d-flex flex-column p-4">

                      {/* Judul — tinggi tetap 2 baris */}
                      <h5
                        className="card-title fw-bold mb-2"
                        style={{
                          minHeight: '3rem',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {p.judul}
                      </h5>

                      {/* Deskripsi bersih, potong di batas kata */}
                      <p
                        className="card-text text-muted mb-4"
                        style={{
                          fontSize: '0.9rem',
                          lineHeight: '1.6',
                          minHeight: '4rem',
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          textAlign: 'justify', 
                        }}
                      >
                        {truncate(stripHtml(p.deskripsi), 110)}
                      </p>

                      {/* BUTTON selalu di bawah */}
                      <Link
                        to={`/program/${p.id}`}
                        className="btn btn-success mt-auto w-100"
                        style={{ borderRadius: 8 }}
                      >
                        Selengkapnya
                      </Link>

                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted">Belum ada data program.</p>
            )}
          </div>

        </div>
      </section>

    </Template>
  )
}