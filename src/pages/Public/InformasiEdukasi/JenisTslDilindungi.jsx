import React from 'react'
import { Link } from 'react-router-dom'
import Template from '../../../layouts/Template.jsx'
import { assetUrl } from '../../../lib/assets.js'
import { stripHtml, truncate, useInformasiEdukasiData } from './useInformasiEdukasiData.js'

export default function JenisTslDilindungi() {
  const { data, loading, error } = useInformasiEdukasiData()

  return (
    <Template title="Jenis TSL Dilindungi" active="informasi">
      <section id="dilindungi" className="public-section informasi-section">
        <div className="public-section-header">
          <h1 className="public-section-title animate-title">Tumbuhan dan Satwa Dilindungi</h1>
          <p className="public-section-desc">
            Kenali jenis tumbuhan dan satwa liar yang perlu dilindungi, termasuk informasi singkat
            mengenai kondisi, habitat, dan perannya dalam menjaga keseimbangan kawasan konservasi.
          </p>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}
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
                onError={(e) => { e.currentTarget.style.display = 'none' }}
              />
              <div className="edukasi-card-body">
                <span className="edukasi-card-date">
                  {new Date(p.created_at).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
                <h2 className="edukasi-card-title">{p.judul}</h2>
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
    </Template>
  )
}
