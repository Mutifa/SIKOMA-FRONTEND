import React from 'react'
import { Link } from 'react-router-dom'
import Template from '../../layouts/Template.jsx'
import informasiEdukasiService from '../../services/informasiEdukasiService.js'
import { assetUrl } from '../../lib/assets.js'
import { sanitizeHtml } from '../../utils/sanitizeHtml.js'

function stripHtml(html = '') {
  return html.replace(/<[^>]*>/g, '').replace(/&[^;]+;/g, ' ').trim()
}

function truncate(text, max = 110) {
  if (text.length <= max) return text
  return text.slice(0, max).replace(/\s+\S*$/, '') + '...'
}

export default function Informasi() {
  const [data, setData] = React.useState({ informasi: [], edukasi: [], peraturan: [], kawasan: null })
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState('')

  React.useEffect(() => {
    let mounted = true
    informasiEdukasiService.getAll()
      .then(res => {
        if (mounted) { setData(res.data); setLoading(false) }
      })
      .catch(err => { if (mounted) { setError(err.message); setLoading(false) } })
    return () => { mounted = false }
  }, [])

  return (
    <Template title="Informasi & Edukasi" active="informasi">

      {/* HEADER */}
      <div className="container-fluid page-header py-5 mb-5 wow fadeIn" data-wow-delay="0.1s">
        <div className="container text-center py-5">
          <h1 className="display-5 text-white mb-4 animated slideInDown">
            Informasi dan Edukasi <br />
            Seputar Kawasan Konservasi UPT KPH Tasik Besar Serkap
          </h1>
        </div>
      </div>

      {/* KAWASAN KONSERVASI */}
      <section id="kawasan-konservasi" className="container-fluid py-3 px-4 px-lg-5">
        <div className="row g-4 align-items-start">
          <div className="col-lg-7 col-md-12">
            {loading ? (
              <div style={{ height: 340, background: '#e9ecef', borderRadius: 12 }} />
            ) : data.kawasan?.gambar ? (
              <img
                src={assetUrl(`/uploads/kawasan/${data.kawasan.gambar}`)}
                alt="Peta Kawasan"
                className="img-fluid shadow-sm peta-img"
                width={913}
                height={671}
                loading="lazy"
                decoding="async"
                style={{ borderRadius: 12, width: '100%', aspectRatio: '913 / 671', objectFit: 'cover' }}
              />
            ) : (
              <div style={{ height: 340, background: '#e9ecef', borderRadius: 12 }} />
            )}
          </div>

          <div className="col-lg-5 col-md-12">
            <h4 className="fw-bold mb-3">Kawasan Konservasi</h4>
            {loading ? <p>Memuat...</p> : (
              <div
                style={{ textAlign: 'justify', lineHeight: '1.8', color: '#444', fontSize: '0.95rem' }}
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(data.kawasan?.deskripsi || '') }}
              />
            )}
            <h5 className="fw-bold mt-4 mb-2">Data Statistik</h5>
            <div className="row g-2">
              <div className="col-md-4 d-flex">
                <div className="stat-card yellow w-100">
                  <h5>Luas Kawasan</h5>
                  <p>{data.kawasan?.luasKawasan || '-'}</p>
                </div>
              </div>
              <div className="col-md-4 d-flex">
                <div className="stat-card brown w-100">
                  <h5>Jenis Kawasan</h5>
                  <p>{data.kawasan?.jenisKawasan || '-'}</p>
                </div>
              </div>
              <div className="col-md-4 d-flex">
                <div className="stat-card orange w-100">
                  <h5>Alamat</h5>
                  <p>{data.kawasan?.alamat || '-'}</p>
                </div>
              </div>
            </div>
            <div className="mt-3">
              <h5 className="fw-bold">Status Kawasan</h5>
              <p className="mb-0">{data.kawasan?.status || '-'}</p>
            </div>
          </div>
        </div>
      </section>

      {/* TUMBUHAN & SATWA DILINDUNGI — grid card */}
      <section id="dilindungi" className="public-section informasi-section">
        <div className="public-section-header">
          <h2 className="public-section-title animate-title">Tumbuhan dan Satwa Dilindungi</h2>
          <p className="public-section-desc">
            Kenali jenis tumbuhan dan satwa liar yang perlu dilindungi, termasuk informasi singkat
            mengenai kondisi, habitat, dan perannya dalam menjaga keseimbangan kawasan konservasi.
          </p>
        </div>

        {loading && <p className="text-center text-muted">Memuat data...</p>}
        {!loading && data.informasi?.length === 0 && (
          <p className="text-center text-muted fst-italic">Belum ada data.</p>
        )}

        <div className="edukasi-grid">
          {data.informasi?.map((p) => (
            <article key={p.id} className="edukasi-card wow fadeInUp" data-wow-delay="0.1s">
              <img
                loading="lazy"
                decoding="async"
                src={assetUrl(`/uploads/edukasi/${p.foto}`)}
                alt={p.judul}
                width={360}
                height={220}
                className="edukasi-card-image"
                onError={e => { e.currentTarget.style.display = 'none' }}
              />
              <div className="edukasi-card-body">
                <span className="edukasi-card-date">
                  {new Date(p.created_at).toLocaleDateString('id-ID', {
                    day: 'numeric', month: 'long', year: 'numeric'
                  })}
                </span>
                <h3 className="edukasi-card-title">{p.judul}</h3>
                <p className="edukasi-card-text" style={{ textAlign: 'justify' }}>
                  {truncate(stripHtml(p.deskripsi), 110)}
                </p>
              </div>
              <div className="edukasi-card-action">
                <Link to={`/informasi-edukasi/${p.id}`} className="edukasi-card-button">
                  Selengkapnya
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* EXECUTIVE SUMMARY — layout horizontal artikel berita */}
      <section id="executive-summary" className="public-section informasi-section">
        <div className="public-section-header">
          <h2 className="public-section-title animate-title">Executive Summary</h2>
          <p className="public-section-desc">
            Ringkasan materi edukasi untuk membantu pengunjung memahami isu utama konservasi,
            pengelolaan kawasan, dan upaya perlindungan lingkungan secara cepat.
          </p>
        </div>

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
              {/* Gambar */}
              <div style={{ flexShrink: 0, width: 260 }}>
                <img
                  loading="lazy"
                  decoding="async"
                  src={assetUrl(`/uploads/edukasi/${p.foto}`)}
                  alt={p.judul}
                  width={260}
                  height={200}
                  style={{ width: '100%', height: '100%', minHeight: 200, objectFit: 'cover', display: 'block' }}
                  onError={e => { e.currentTarget.style.display = 'none' }}
                />
              </div>

              {/* Konten */}
              <div style={{
                flex: 1,
                padding: '24px 28px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                borderLeft: index % 2 === 0 ? '4px solid #2d7a3a' : 'none',
                borderRight: index % 2 !== 0 ? '4px solid #2d7a3a' : 'none',
              }}>
                <span style={{
                  fontSize: '0.8rem',
                  color: '#2d7a3a',
                  fontWeight: 600,
                  marginBottom: 8,
                  display: 'block'
                }}>
                  📅 {new Date(p.created_at).toLocaleDateString('id-ID', {
                    day: 'numeric', month: 'long', year: 'numeric'
                  })}
                </span>

                <h3 style={{ fontWeight: 700, fontSize: '1.15rem', marginBottom: 10, color: '#1a1a1a' }}>
                  {p.judul}
                </h3>

                <p style={{
                  color: '#555',
                  fontSize: '0.92rem',
                  lineHeight: '1.7',
                  marginBottom: 20,
                  flex: 1,
                  textAlign: 'justify', 
                }}>
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
                    Selengkapnya →
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

          {/* CONTOH SECTION BARU
<section className="container-xxl py-5 bg-light">
    <div className="container">
        <div className="text-center mb-5">
            <h2>Program Lainnya</h2>
            <p>
                Ini contoh section baru.
            </p>
        </div>
    </div>
</section> */}


      {/* DAFTAR PERATURAN */}
      <section id="peraturan" className="public-section informasi-section">
        <div className="text-center mb-4">
          <h2 className="fw-bold heading-green animate-title">Daftar Peraturan</h2>
        </div>

        {loading && <p className="text-center text-muted">Memuat data...</p>}
        {!loading && data.peraturan?.length === 0 && (
          <p className="text-center text-muted fst-italic">Belum ada peraturan.</p>
        )}

        {data.peraturan?.map((p) => (
          <div key={p.id} className="border rounded p-4 mb-3 shadow-sm" style={{ borderRadius: 10 }}>
            <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3">
              <div>
                <h5 className="fw-bold mb-1">{p.nama}</h5>
                <p className="mb-1 text-muted" style={{ fontSize: '0.9rem' }}>{p.deskripsi}</p>
                <small className="text-secondary">Tahun: {p.tahun} &nbsp;|&nbsp; Nomor: {p.nomor}</small>
              </div>
              <div className="flex-shrink-0">
                <a
                  href={`https://codemy.my.id/uploads/peraturan/${p.file}`} // dapatkan file dari server yang sudah diunggah
                  download
                  className="btn btn-success"
                  style={{ whiteSpace: 'nowrap', borderRadius: 8 }}
                >
                  ⬇ Unduh PDF
                </a>
              </div>
            </div>
          </div>
        ))}
      </section>

    </Template>
  )
}
