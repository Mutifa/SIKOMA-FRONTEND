import React from 'react'
import Template from '../../layouts/Template.jsx'
import api from '../../lib/api.js'
import { assetUrl } from '../../lib/assets.js'

export default function Edukasi() {
  const [items, setItems] = React.useState([])
  const [kategori, setKategori] = React.useState('')
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState('')

  React.useEffect(() => {
    let mounted = true

    api.get('/edukasi')
      .then(res => {
        if (mounted) {
          setItems(res.data.items || [])   // ✅ FIX sesuai API
          setKategori(res.data.kategori || '')
          setLoading(false)
        }
      })
      .catch(err => {
        if (mounted) {
          setError(err.response?.data?.message || 'Gagal memuat edukasi')
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

          <h2 className="mb-4 heading-green">Program / Edukasi</h2>

          {loading && <p>Memuat...</p>}
          {error && <div className="alert alert-danger">{error}</div>}

          <div className="row g-4">

            {items.length > 0 ? (
              items.map((p) => (
                <div key={p.id} className="col-md-6 col-lg-4">

                  <div className="card h-100 shadow-sm">

                    {/* IMAGE */}
                    {p.foto && (
                      <img
                        src={`${p.foto}`}
                        alt={p.judul}
                        className="card-img-top"
                        style={{
                          height: '200px',
                          objectFit: 'cover',
                          width: '100%'
                        }}
                      />
                    )}

                    {/* BODY */}
                    <div className="card-body d-flex flex-column">

                      <h5 className="card-title">{p.judul}</h5>

                      {/* DESKRIPSI (optional tampilkan) */}
                      <div
                        className="card-text mb-3"
                        dangerouslySetInnerHTML={{
                          __html: p.deskripsi?.slice(0, 100) + '...'
                        }}
                      />

                      {/* BUTTON */}
                      <a
                        href={`/edukasi/${p.slug}`}
                        className="btn btn-success mt-auto"
                      >
                        Selengkapnya
                      </a>

                    </div>

                  </div>

                </div>
              ))
            ) : (
              !loading && <p className="text-muted">Belum ada data edukasi</p>
            )}

          </div>

        </div>
      </section>

    </Template>
  )
}