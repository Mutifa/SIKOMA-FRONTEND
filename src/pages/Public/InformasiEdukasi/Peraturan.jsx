import React from 'react'
import Template from '../../../layouts/Template.jsx'
import { useInformasiEdukasiData } from './useInformasiEdukasiData.js'

export default function PeraturanInformasiEdukasi() {
  const { data, loading, error } = useInformasiEdukasiData()

  return (
    <Template title="Peraturan" active="informasi">
      <section id="peraturan" className="public-section informasi-section">
        <div className="text-center mb-4">
          <h1 className="fw-bold heading-green animate-title">Daftar Peraturan</h1>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}
        {loading && <p className="text-center text-muted">Memuat data...</p>}
        {!loading && data.peraturan?.length === 0 && (
          <p className="text-center text-muted fst-italic">Belum ada peraturan.</p>
        )}

        {data.peraturan?.map((p) => (
          <div key={p.id} className="border rounded p-4 mb-3 shadow-sm" style={{ borderRadius: 10 }}>
            <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3">
              <div>
                <h2 className="fw-bold mb-1" style={{ fontSize: '1.15rem' }}>{p.nama}</h2>
                <p className="mb-1 text-muted" style={{ fontSize: '0.9rem' }}>{p.deskripsi}</p>
                <small className="text-secondary">Tahun: {p.tahun} &nbsp;|&nbsp; Nomor: {p.nomor}</small>
              </div>
              <div className="flex-shrink-0">
                <a
                  href={`https://codemy.my.id/uploads/peraturan/${p.file}`}
                  download
                  className="btn btn-success"
                  style={{ whiteSpace: 'nowrap', borderRadius: 8 }}
                >
                  Unduh PDF
                </a>
              </div>
            </div>
          </div>
        ))}
      </section>
    </Template>
  )
}
