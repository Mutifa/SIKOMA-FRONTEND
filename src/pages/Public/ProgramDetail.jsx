import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Template from '../../layouts/Template.jsx'
import api from '../../lib/api.js'
import { assetUrl } from '../../lib/assets.js'
import { sanitizeHtml } from '../../utils/sanitizeHtml.js'

export default function ProgramDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [data, setData] = React.useState(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState('')

  React.useEffect(() => {
    let mounted = true

    api.get(`/program/${id}`)
      .then(res => {
        if (mounted) {
          setData(res.data.data || res.data)
          setLoading(false)
        }
      })
      .catch(err => {
        if (mounted) {
          setError(err.message)
          setLoading(false)
        }
      })

    return () => { mounted = false }
  }, [id])

  return (
    <Template title={data?.judul || 'Detail Program'} active="edukasi">
      <section className="container my-5">

        {loading && <p>Memuat data program...</p>}
        {error && <div className="alert alert-danger">Terjadi kesalahan: {error}</div>}

        {!loading && !error && data && (
          <div className="row">

            {/* Kolom Gambar */}
            <div className="col-lg-6 mb-4">
              <img
                src={assetUrl(`/uploads/program/${data.foto}`)}
                alt={data.judul}
                width={600}
                height={400}
                loading="eager"
                decoding="async"
                style={{ width: '100%', height: 'auto', objectFit: 'cover', borderRadius: 10 }}
              />
              <div className="mt-3" style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <img
                  src={assetUrl(`/uploads/program/${data.foto}`)}
                  alt={`Thumbnail ${data.judul}`}
                  width={100}
                  height={80}
                  loading="lazy"
                  decoding="async"
                  style={{ objectFit: 'cover', borderRadius: 6 }}
                />
                {data?.galeri?.map((g, idx) => (
                  <img
                    key={g.id}
                    src={assetUrl(`/uploads/galeri/${g.gambar}`)}
                    alt={`Galeri ${g.id}`}
                    width={100}
                    height={80}
                    loading="lazy"
                    decoding="async"
                    style={{ objectFit: 'cover', borderRadius: 6 }}
                  />
                ))}
              </div>
            </div>

            {/* Kolom Deskripsi */}
            <div className="col-lg-6 mb-4">
              <h1 className="mb-2">{data.judul}</h1>
              <hr />
              <div
                style={{ textAlign: 'justify', lineHeight: '1.8' }}
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(data.deskripsi) }}
              />
            </div>

          </div>
        )}
      </section>

      {/* Tombol Kembali Floating */}
      <button
        onClick={() => navigate(-1)}
        style={{
          position: 'fixed',
          bottom: 32,
          left: 32,
          zIndex: 1000,
          backgroundColor: '#2d7a3a',
          color: '#fff',
          border: 'none',
          borderRadius: 50,
          padding: '12px 24px',
          fontSize: '15px',
          fontWeight: 600,
          cursor: 'pointer',
          boxShadow: '0 4px 14px rgba(0,0,0,0.25)',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          transition: 'background-color 0.2s ease, transform 0.2s ease',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.backgroundColor = '#245f2d'
          e.currentTarget.style.transform = 'scale(1.05)'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.backgroundColor = '#2d7a3a'
          e.currentTarget.style.transform = 'scale(1)'
        }}
      >
        ← Kembali
      </button>

    </Template>
  )
}