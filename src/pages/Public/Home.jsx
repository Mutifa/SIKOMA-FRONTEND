import React from 'react'
import Template from '../../layouts/Template.jsx'
import api from '../../lib/api.js'
import { assetUrl } from '../../lib/assets.js'

export default function Home() {
  const [data, setData] = React.useState({ banner: [], program: [], website: null })
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState('')

  React.useEffect(() => {
    let mounted = true
    api.get('/api/home')
      .then(res => { if (mounted) { setData(res.data); setLoading(false) } })
      .catch(err => { if (mounted) { setError(err.message); setLoading(false) } })
    return () => { mounted = false }
  }, [])

  return (
    <Template title={data?.website?.nama || 'Beranda'} active="home">
      {/* Carousel Start */}
      <div className="container-fluid p-0">
        <div id="header-carousel" className="carousel slide" data-bs-ride="carousel">
          <div className="carousel-inner">
            {data.banner.map((b, idx) => (
              <div key={b.id} className={`carousel-item ${idx === 0 ? 'active' : ''}`}>
                <img className="w-100" src={assetUrl(`/uploads/galeri/${b.gambar}`)} alt="Image" />
                <div className="carousel-caption">
                  <div className="container">
                    <div className="row justify-content-center">
                      <div className="col-lg-8">
                        <h1 className="display-3 text-white mb-2">Selamat Datang di<br /> {data?.website?.deskripsi}</h1>
                        <p className="fs-4">Kini telah hadir Sistem Informasi Konservasi untuk UPT KPH Tasik Besar Serkap</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {data.banner.length > 1 && (
            <>
              <button className="carousel-control-prev" type="button" data-bs-target="#header-carousel" data-bs-slide="prev">
                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Previous</span>
              </button>
              <button className="carousel-control-next" type="button" data-bs-target="#header-carousel" data-bs-slide="next">
                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Next</span>
              </button>
            </>
          )}
        </div>
      </div>
      {/* Carousel End */}

      <section className="container-xxl py-5">
        <div className="container">
          {loading && <p>Memuat...</p>}
          {error && <div className="alert alert-danger">{error}</div>}

          {!loading && !error && (
            <>
              <div className="mb-4">
                <h2 className="mb-3">Program UPT KPH Tasik Besar Serkap</h2>
                <div className="row g-4">
                  {data.program.map((p) => (
                    <div key={p.id} className="col-md-4">
                      <div className="border rounded">
                        <img loading="lazy" src={assetUrl(`/uploads/edukasi/${p.foto}`)} alt={p.judul} className="produk-img" />
                        <h4 className="m-3">{p.judul}</h4>
                        <span className="truncate-4 mb-3 px-3" dangerouslySetInnerHTML={{ __html: p.deskripsi }} />
                        <div className="mb-3 px-3">
                          <a href={`/edukasi/${p.slug}`} className="btn btn-primary">Selengkapnya</a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Struktur Start */}
              <div id="struktur-organisasi" className="container-xxl py-5">
                <div className="container">
                  <div className="text-center">
                    <h6 className="text-secondary text-uppercase">Struktur Organisasi</h6>
                    <h1 className="mb-5">Struktur Unit Pelaksanaan Teknis Kesatuan Pengelolaan Hutan</h1>
                  </div>
                  {data.website?.struktur && (
                    <img src={assetUrl(`/img/${data.website.struktur}`)} alt="Struktur Organisasi" className="img-fluid" />
                  )}
                </div>
              </div>
              {/* Struktur End */}

              {/* Visi Misi Start */}
              <div id="visi-misi" className="container-xxl py-5 visi-misi-section" style={{
                backgroundImage: 'url(/img/visi-misi.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative'
              }}>
                <div className="visi-misi-overlay"></div>
                <div className="container position-relative">
                  <div className="text-center">
                    <h6 className="text-secondary text-uppercase">Visi & Misi</h6>
                    <h1 className="mb-5">Visi dan Misi Unit Pelaksanaan Teknis Kesatuan Pengelolaan Hutan</h1>
                    <br />
                    <div className="text-start fw-bold mb-4" style={{ color: 'black' }}>
                      <p className="mb-2">Visi:</p>
                      <span dangerouslySetInnerHTML={{ __html: data.website?.visi || '' }} />
                    </div>
                    <div className="text-start fw-bold" style={{ color: 'black' }}>
                      <p className="mb-2">Misi:</p>
                      <span dangerouslySetInnerHTML={{ __html: data.website?.misi || '' }} />
                    </div>
                  </div>
                </div>
              </div>
              {/* Visi Misi End */}

              {/* Sejarah Start */}
              <div id="sejarah" className="container-xxl py-5">
                <div className="container">
                  <div className="text-center">
                    <h6 className="text-secondary text-uppercase">Sejarah</h6>
                    <h1 className="mb-5">Sejarah Unit Pelaksanaan Teknis Kesatuan Pengelolaan Hutan Tasik Besar Serkap</h1>
                  </div>
                  <br />
                  <div className="row g-4">
                    <div className="col-lg-6">
                      <h4>Sejarah</h4>
                      <p style={{ textAlign: 'justify' }}>
                        Unit Pelaksana Teknis Kesatuan Pengelolaan Hutan (UPT KPH) Tasik Besar Serkap adalah unit
                        pelaksana teknis di bawah Dinas Lingkungan Hidup dan Kehutanan Provinsi Riau yang bertugas
                        melaksanakan kegiatan pengelolaan hutan di wilayah kerjanya. KPH Tasik Besar Serkap memiliki
                        wilayah kerja di Kabupaten Siak dan Pelalawan, Riau, dengan luas mencapai ratusan ribu hektar.
                        <br /><br />
                        Pembentukan KPH Tasik Besar Serkap tidak lepas dari kebijakan pemerintah pusat dan daerah
                        dalam rangka pengelolaan hutan yang lebih efektif dan efisien, serta mendukung pembangunan
                        berkelanjutan. Beberapa poin penting terkait sejarah pembentukannya
                        <br /><br />
                        Namun, dengan dukungan dari berbagai pihak, termasuk pemerintah, masyarakat, dan pelaku
                        usaha, diharapkan KPH Tasik Besar Serkap dapat melaksanakan tugas dan fungsinya secara
                        optimal, sehingga pengelolaan hutan di wilayah kerjanya dapat berjalan berkelanjutan dan
                        memberikan manfaat bagi semua pihak.
                      </p>
                    </div>
                    <div className="col-lg-6">
                      <h4>Peraturan Gubenur Riau :</h4>
                      <p style={{ textAlign: 'justify' }}>
                        KPH Tasik Besar Serkap dibentuk berdasarkan Peraturan Gubernur Riau yang mengatur tentang
                        pembentukan dan pengelolaan KPH di wilayah Provinsi Riau.
                      </p>
                      <h4>Wilayah Kerja yang Luas :</h4>
                      <p style={{ textAlign: 'justify' }}>
                        KPH Tasik Besar Serkap memiliki wilayah kerja yang cukup luas, mencakup Kabupaten Siak dan
                        Pelalawan, yang merupakan kawasan hutan dengan berbagai potensi dan fungsi.
                      </p>
                      <h4>Tugas dan Fungsi KPH Tasik Besar Serkap:</h4>
                      <ol>
                        <li>Tata Hutan dan Penyusunan Rencana Pengelolaan</li>
                        <li>Pemanfaatan Hutan</li>
                        <li>Rehabilitasi dan Reklamasi Hutan</li>
                        <li>Perlindungan Hutan</li>
                        <li>Konservasi Sumber Daya Alam</li>
                        <li>Pengendalian Kebakaran Hutan dan Lahan</li>
                      </ol>
                    </div>
                  </div>
                </div>
              </div>
              {/* Sejarah End */}

              {/* Pengelola Start */}
              <div id="pengelola" className="container-xxl py-5 visi-misi-section" style={{
                backgroundImage: 'url(/img/pengelola.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative'
              }}>
                <div className="visi-misi-overlay"></div>
                <div className="container position-relative">
                  <div className="bg-white rounded">
                    <div className="row">
                      <div className="col-lg-5">
                        <img src="/img/pengelola.jpg" alt="Pengelola Hutan" className="img-fluid rounded" style={{ height: 500, objectFit: 'cover' }} />
                      </div>
                      <div className="col-lg-7">
                        <div className="my-5 mx-3">
                          <h2>Pengelola Hutan</h2>
                          <p>Pengelolaan hutan adalah serangkaian kegiatan yang bertujuan untuk merawat, melindungi, dan
                            memanfaatkan sumber daya hutan secara berkelanjutan. Ini mencakup berbagai aspek seperti
                            perencanaan, pemanfaatan, rehabilitasi, perlindungan, dan konservasi hutan, dengan tujuan
                            menjaga kelestarian hutan baik secara ekologis maupun ekonomis</p>
                          <p>Tujuan Pengelolaan Hutan:</p>
                          <ol>
                            <li>Kelestarian Ekologis</li>
                            <li>Kelestarian Ekonomis</li>
                            <li>Kesejahteraan Masyarakat</li>
                            <li>Tata Hutan dan Rencana Pengelolaan</li>
                          </ol>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Pengelola End */}
            </>
          )}
        </div>
      </section>
    </Template>
  )
}


