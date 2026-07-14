import React from 'react'
import { Link } from 'react-router-dom'
import Template from '../../../layouts/Template.jsx'
import { assetUrl } from '../../../lib/assets.js'
import { stripHtml, truncate, useInformasiEdukasiData } from './useInformasiEdukasiData.js'

export default function ExecutiveSummary() {
  const { data, loading, error } = useInformasiEdukasiData()

  return (
    <Template title="Executive Summary" active="informasi">
      <section id="executive-summary" className="public-section informasi-section">
        <div className="public-section-header">
          <h1 className="public-section-title animate-title">Executive Summary</h1>
          <p className="public-section-desc">
            Ringkasan materi edukasi untuk membantu pengunjung memahami isu utama konservasi,
            pengelolaan kawasan, dan upaya perlindungan lingkungan secara cepat.
          </p>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}
        {loading && <p className="text-center text-muted">Memuat data...</p>}
        {!loading && data.edukasi?.length === 0 && (
          <p className="text-center text-muted fst-italic">Belum ada data.</p>
        )}

        <div className="executive-summary-list">
          {data.edukasi?.map((p, index) => (
            <article
              key={p.id}
              className="wow fadeInUp"
              data-wow-delay="0.1s"
              style={{
                display: 'flex',
                flexDirection: index % 2 === 0 ? 'row' : 'row-reverse',
                gap: 0,
                marginBottom: 28,
                background: '#fff',
                borderRadius: 12,
                overflow: 'hidden',
                boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                alignItems: 'stretch',
              }}
            >
              <div style={{ flexShrink: 0, width: 260 }}>
                <img
                  loading="lazy"
                  decoding="async"
                  src={assetUrl(`/uploads/edukasi/${p.foto}`)}
                  alt={p.judul}
                  width={260}
                  height={200}
                  style={{ width: '100%', height: '100%', minHeight: 200, objectFit: 'cover', display: 'block' }}
                  onError={(e) => { e.currentTarget.style.display = 'none' }}
                />
              </div>

              <div
                style={{
                  flex: 1,
                  padding: '24px 28px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  borderLeft: index % 2 === 0 ? '4px solid #2d7a3a' : 'none',
                  borderRight: index % 2 !== 0 ? '4px solid #2d7a3a' : 'none',
                }}
              >
                <span
                  style={{
                    fontSize: '0.8rem',
                    color: '#2d7a3a',
                    fontWeight: 600,
                    marginBottom: 8,
                    display: 'block',
                  }}
                >
                  {new Date(p.created_at).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>

                <h2 style={{ fontWeight: 700, fontSize: '1.15rem', marginBottom: 10, color: '#1a1a1a' }}>
                  {p.judul}
                </h2>

                <p
                  style={{
                    color: '#555',
                    fontSize: '0.92rem',
                    lineHeight: '1.7',
                    marginBottom: 20,
                    flex: 1,
                    textAlign: 'justify',
                  }}
                >
                  {truncate(stripHtml(p.deskripsi), 160)}
                </p>

                <div>
                  <Link
                    to={`/informasi-edukasi/${p.id}`}
                    style={{
                      display: 'inline-block',
                      backgroundColor: '#2d7a3a',
                      color: '#fff',
                      padding: '8px 20px',
                      borderRadius: 8,
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      textDecoration: 'none',
                    }}
                  >
                    Selengkapnya -&gt;
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </Template>
  )
}
