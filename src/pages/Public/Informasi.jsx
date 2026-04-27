import React from 'react'
import Template from '../../layouts/Template.jsx'
import api from '../../lib/api.js'
import { assetUrl } from '../../lib/assets.js'

export default function Informasi() {
  const [data, setData] = React.useState({ executive: [], peraturan: [], kawasan: null })
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState('')

  React.useEffect(() => {
    let mounted = true
    api.get('/informasi')
      .then(res => { if (mounted) { setData(res.data); setLoading(false) } })
      .catch(err => { if (mounted) { setError(err.message); setLoading(false) } })
    return () => { mounted = false }
  }, [])

  return (
    <Template title="Informasi" active="informasi">
      <div className="container-fluid page-header py-5 mb-5 wow fadeIn" data-wow-delay="0.1s">
        <div className="container text-center py-5">
          <h1 className="display-5 text-white mb-4 animated slideInDown">Informasi dan Edukasi <br />
            Seputar Konservasi Bersama Masayarakat</h1>
        </div>
      </div>
      <section id="kawasan-konservasi" className="container-fluid py-3">
        <div className="row g-4">
          <div className="col-lg-7 col-md-12 d-flex justify-content-center">
            {loading ? (
              <div style={{ height: 300, background: '#eee', width: '100%' }} />
            ) : (
              data.kawasan?.gambar ? (
                <img
                  src={assetUrl(`/uploads/${data.kawasan.gambar}`)}
                  alt="Peta"
                  className="img-fluid rounded shadow-sm peta-img"
                />
              ) : (
                <div style={{ height: 300, background: '#eee', width: '100%' }} />
              )
            )}
          </div>
          <div className="col-lg-5 col-md-12">
            <h4 className="wow fadeInUp" data-wow-delay="0.1s">Kawasan Konservasi</h4>
            {loading ? <p>Memuat...</p> : (
              <div
                className="text-justify"
                dangerouslySetInnerHTML={{ __html: data.kawasan?.deskripsi || '' }}
              />
            )}
            <h4 className="mt-3">Data Statistik</h4>

            <div className="row g-2">
              <div className="col-md-4 d-flex">
                <div className="stat-card yellow">
                  <h5>Luas Kawasan</h5>
                  <p>{data.kawasan?.luasKawasan || '-'}</p>
                </div>
              </div>

              <div className="col-md-4 d-flex">
                <div className="stat-card brown">
                  <h5>Jenis Kawasan</h5>
                  <p>{data.kawasan?.jenisKawasan || '-'}</p>
                </div>
              </div>

              <div className="col-md-4 d-flex">
                <div className="stat-card orange">
                  <h5>Alamat</h5>
                  <p>{data.kawasan?.alamat || '-'}</p>
                </div>
              </div>

            </div>

            <div className="mt-4">
              <h4>Status Kawasan</h4>
              <p>{data.kawasan?.status}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Satwa Dilindungi Start */}
      <section id="dilindungi" className="container-fluid py-5">
        <div className="text-center">
          <h2 className="fw-bold heading-green animate-title">Tumbuhan, <br />Satwa di Lindungi</h2>
          <p className="mx-lg-5 mb-5">Hutan mangrove mempunyai banyak sekali manfaat untuk Indonesia. Kini kami bersama-sama dengan lembaga, kelompok, maupun perseorangan melakukan penanaman dan monitoring mangrove.</p>
        </div>
        <a href="/edukasi?kategori=Satwa" className="btn btn-primary mb-3">Lebih Banyak</a>
        <div className="row g-4">
          {data.satwa?.map((p) => (
            <div key={p.id} className="col-md-4 wow fadeInUp" data-wow-delay="0.1s">
              <div className="border rounded h-100 d-flex flex-column">
                <img loading="lazy" src={assetUrl(`/uploads/edukasi/${p.foto}`)} alt={p.judul} className="w-100" style={{ height: 250, objectFit: 'cover' }} />
                <div className="flex-grow-1">
                  <h6 className="mt-3 mx-3">{new Date(p.created_at).toLocaleDateString('id-ID')}</h6>
                  <h4 className="mx-3 mb-3">{p.judul}</h4>
                  <span className="truncate-4 mb-3 px-3" dangerouslySetInnerHTML={{ __html: p.deskripsi }} />
                </div>
                <div className="mb-3 px-3 mt-auto">
                  <a href={`/edukasi/${p.slug}`} className="btn btn-primary">Selengkapnya</a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      {/* Satwa Dilindungi End */}

      <section id="executive-summary" className="container-fluid py-5">
        <div className="text-center">
          <h2 className="fw-bold heading-green animate-title">Executive Summary<br /></h2>
        </div>
        <div className="text-end mb-3">
          <a href="/edukasi?kategori=Executive" className="btn btn-primary">Lihat Informasi Lainnya</a>
        </div>
        <div className="row g-4">
          {data.executive.map((p) => (
            <div key={p.id} className="col-md-4 wow fadeInUp" data-wow-delay="0.1s">
              <div className="border rounded h-100 d-flex flex-column">
                <img loading="lazy" src={assetUrl(`/uploads/edukasi/${p.foto}`)} alt={p.judul} className="w-100" style={{ height: 250, objectFit: 'cover' }} />
                <div className="flex-grow-1">
                  <h6 className="mt-3 mx-3">{new Date(p.created_at).toLocaleDateString('id-ID')}</h6>
                  <h4 className="mx-3 mb-3">{p.judul}</h4>
                  <span className="truncate-4 mb-3 px-3" dangerouslySetInnerHTML={{ __html: p.deskripsi }} />
                </div>
                <div className="mb-3 px-3 mt-auto">
                  <a href={`/edukasi/${p.slug}`} className="btn btn-primary">Selengkapnya</a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="peraturan" className="container py-5">
        <div className="text-center">
          <h2 className="fw-bold heading-green animate-title">Daftar Peraturan<br /></h2>
        </div>
        {data.peraturan.map((p) => (
          <div key={p.id} className="border rounded p-3 mb-3">
            <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between">
              <div className="mb-3 mb-md-0">
                <h4>{p.nama}</h4>
                <p className="mb-2">{p.deskripsi}</p>
                <p>Tahun: {p.tahun} | Nomor: {p.nomor}</p>
              </div>
              <div className="text-md-end">
                <a href={`https://codemy.my.id/uploads/peraturan/${p.file}`} download className="btn btn-primary">Unduh PDF</a>
              </div>
            </div>
          </div>
        ))}
      </section>
    </Template>
  )
}


