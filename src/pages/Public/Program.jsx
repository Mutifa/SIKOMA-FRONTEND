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
      <section className="container-xxl py-5 program-public-page">
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
                  <article className="edukasi-card wow fadeInUp" style={{ width: '100%' }}>
                    <img
                      loading="lazy"
                      decoding="async"
                      src={`https://codemy.my.id/uploads/program/${p.foto}`}
                      alt={p.judul}
                      width={400}
                      height={200}
                      className="edukasi-card-image"
                      onError={e => { e.currentTarget.style.display = 'none' }}
                    />

                    <div className="edukasi-card-body">
                      <h3 className="edukasi-card-title">
                        {p.judul}
                      </h3>

                      <p className="edukasi-card-text" style={{ textAlign: 'justify' }}>
                        {truncate(stripHtml(p.deskripsi), 110)}
                      </p>

                      <div className="edukasi-card-action">
                        <Link to={`/program/${p.id}`} className="edukasi-card-button">
                          Selengkapnya
                        </Link>
                      </div>
                    </div>
                  </article>
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
