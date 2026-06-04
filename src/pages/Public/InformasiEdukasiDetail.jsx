import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Template from '../../layouts/Template.jsx'
import informasiEdukasiService from '../../services/informasiEdukasiService.js'
import { assetUrl } from '../../lib/assets.js'
import { sanitizeHtml } from '../../utils/sanitizeHtml.js'

export default function InformasiDetail() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [data, setData] = React.useState(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState('')

  React.useEffect(() => {
    let mounted = true
  informasiEdukasiService.getById(id)
  .then(res => {
    if (!mounted) return
    const result = res.data.data || res.data
    if (!result) setError('Data tidak ditemukan')
    else setData(result)
    setLoading(false)
  })
      .catch(err => {
        if (!mounted) return
        setError(err.message)
        setLoading(false)
      })
    return () => { mounted = false }
  }, [id])

  const tanggal = data?.created_at
    ? new Date(data.created_at).toLocaleDateString('id-ID', {
        day: 'numeric', month: 'long', year: 'numeric'
      })
    : null

  return (
    <Template title={data?.judul || 'Detail Informasi'} active="informasi">

      {/* Loading */}
      {loading && (
        <div className="container my-5 text-center">
          <p className="text-muted">Memuat data...</p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="container my-5">
          <div className="alert alert-danger">{error}</div>
        </div>
      )}

      {!loading && !error && data && (
        <>
          {/* Hero Image */}
          {data.foto && (
            <div style={{ width: '100%', maxHeight: 460, overflow: 'hidden' }}>
              <img
                src={assetUrl(`/uploads/edukasi/${data.foto}`)}
                alt={data.judul}
                style={{ width: '100%', height: 460, objectFit: 'cover' }}
              />
            </div>
          )}

          {/* Artikel */}
          <section className="container my-5" style={{ maxWidth: 820 }}>

            {/* Tanggal */}
            {tanggal && (
              <p style={{ color: '#6c757d', fontSize: '0.875rem', marginBottom: 8 }}>
                📅 {tanggal}
              </p>
            )}

            {/* Judul */}
            <h1 className="fw-bold mb-3" style={{ lineHeight: 1.4 }}>
              {data.judul}
            </h1>

            {/* Garis aksen hijau */}
            <div style={{
              width: 60, height: 3,
              backgroundColor: '#2d7a3a',
              borderRadius: 4,
              marginBottom: 28
            }} />

            {/* Deskripsi */}
            {data.deskripsi ? (
              <div
                style={{
                  textAlign: 'justify',
                  lineHeight: '1.85',
                  fontSize: '1rem',
                  color: '#333'
                }}
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(data.deskripsi) }}
              />
            ) : (
              <p className="text-muted fst-italic">Tidak ada deskripsi untuk artikel ini.</p>
            )}

          </section>
        </>
      )}

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