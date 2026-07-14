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

    informasiEdukasiService
      .getById(id)
      .then((res) => {
        if (!mounted) return
        const result = res.data.data || res.data
        if (!result) setError('Data tidak ditemukan')
        else setData(result)
      })
      .catch((err) => {
        if (!mounted) return
        setError(err.message || 'Gagal memuat detail informasi.')
      })
      .finally(() => {
        if (mounted) setLoading(false)
      })

    return () => {
      mounted = false
    }
  }, [id])

  const tanggal = data?.created_at
    ? new Date(data.created_at).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : null

  const isExecutive = data?.kategori === 'Edukasi' || data?.kategori === 'Executive'

  return (
    <Template title={data?.judul || 'Detail Informasi'} active="informasi">
      <main className="informasi-detail-page">
        <div className="container">
          <button type="button" className="informasi-detail-back" onClick={() => navigate(-1)}>
            &larr; Kembali
          </button>

          {loading && (
            <div className="informasi-detail-article">
              <div className="image-placeholder mb-4" style={{ height: 360, borderRadius: 8 }} />
              <div className="image-placeholder mb-3" style={{ height: 36, maxWidth: 640, borderRadius: 8 }} />
              <div className="image-placeholder" style={{ height: 160, borderRadius: 8 }} />
            </div>
          )}

          {error && (
            <div className="informasi-detail-state">
              <h2>Data tidak dapat ditampilkan</h2>
              <p>{error}</p>
            </div>
          )}

          {!loading && !error && data && (
            <article className={`informasi-detail-article ${isExecutive ? 'is-executive' : ''}`}>
              {data.foto && (
                <div className="informasi-detail-media">
                  <img
                    src={assetUrl(`/uploads/edukasi/${data.foto}`)}
                    alt={data.judul}
                    width={isExecutive ? 500 : 1200}
                    height={isExecutive ? 620 : 600}
                    loading="eager"
                    decoding="async"
                    fetchPriority="high"
                    className={isExecutive ? 'informasi-detail-image executive-image' : 'informasi-detail-image'}
                  />
                </div>
              )}

              <div className="informasi-detail-body">
                <header className="informasi-detail-header">
                  {tanggal && <p className="informasi-detail-meta">{tanggal}</p>}
                  <h1 className="informasi-detail-title">{data.judul}</h1>
                  <div className="informasi-detail-divider" />
                </header>

                {data.deskripsi ? (
                  <div
                    className="informasi-detail-content"
                    dangerouslySetInnerHTML={{ __html: sanitizeHtml(data.deskripsi) }}
                  />
                ) : (
                  <p className="informasi-detail-empty">Tidak ada deskripsi untuk artikel ini.</p>
                )}
              </div>
            </article>
          )}
        </div>
      </main>
    </Template>
  )
}
