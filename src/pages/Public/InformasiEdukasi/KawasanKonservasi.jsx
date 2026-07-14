import React from 'react'
import Template from '../../../layouts/Template.jsx'
import { assetUrl } from '../../../lib/assets.js'
import { sanitizeHtml } from '../../../utils/sanitizeHtml.js'
import { useInformasiEdukasiData } from './useInformasiEdukasiData.js'

export default function KawasanKonservasi() {
  const { data, loading, error } = useInformasiEdukasiData()

  return (
    <Template title="Kawasan Konservasi" active="informasi">
      <section id="kawasan-konservasi" className="container-fluid py-5 px-4 px-lg-5">
        <div className="public-section-header">
          <h1 className="public-section-title animate-title">Kawasan Konservasi</h1>
          <p className="public-section-desc">
            Informasi kawasan konservasi UPT KPH Tasik Besar Serkap beserta data statistik utamanya.
          </p>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <div className="row g-4 align-items-start">
          <div className="col-lg-7 col-md-12">
            {loading ? (
              <div className="image-placeholder" style={{ height: 340, borderRadius: 12 }} />
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
            {loading ? (
              <p>Memuat...</p>
            ) : (
              <div
                style={{ textAlign: 'justify', lineHeight: '1.8', color: '#444', fontSize: '0.95rem' }}
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(data.kawasan?.deskripsi || '') }}
              />
            )}

            <h2 className="fw-bold mt-4 mb-2" style={{ fontSize: '1.25rem' }}>Data Statistik</h2>
            <div className="row g-2">
              <div className="col-md-4 d-flex">
                <div className="stat-card yellow w-100">
                  <h3>Luas Kawasan</h3>
                  <p>{data.kawasan?.luasKawasan || '-'}</p>
                </div>
              </div>
              <div className="col-md-4 d-flex">
                <div className="stat-card brown w-100">
                  <h3>Jenis Kawasan</h3>
                  <p>{data.kawasan?.jenisKawasan || '-'}</p>
                </div>
              </div>
              <div className="col-md-4 d-flex">
                <div className="stat-card orange w-100">
                  <h3>Alamat</h3>
                  <p>{data.kawasan?.alamat || '-'}</p>
                </div>
              </div>
            </div>

            <div className="mt-3">
              <h2 className="fw-bold" style={{ fontSize: '1.25rem' }}>Status Kawasan</h2>
              <p className="mb-0">{data.kawasan?.status || '-'}</p>
            </div>
          </div>
        </div>
      </section>
    </Template>
  )
}
