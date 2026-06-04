import Template from '../../layouts/Template.jsx'
import { assetUrl } from '../../lib/assets.js'
import { homeService } from '../../services/homeService.js'
import React, { useEffect, useState } from "react";
import { useLocation } from 'react-router-dom'
import { sanitizeHtml } from '../../utils/sanitizeHtml.js'

export default function Home() {
  const [banner, setBanner] = useState([]);
  const [program, setProgram] = useState([]);
  const [website, setWebsite] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation()
  const FILE_URL = 'https://codemy.my.id'

  useEffect(() => {
    const handleScroll = () => {
      if (location.hash) {
        const el = document.querySelector(location.hash)
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' })
        }
      }
    }

    setTimeout(handleScroll, 300)
  }, [location])


  // API
  useEffect(() => {
    homeService
      .get()
      .then((res) => {
        setBanner(res.data.banner);
        setProgram(res.data.program);
        setWebsite(res.data.website);
      })
      .catch((err) => {
        console.error("ERROR:", err);
        setError("Gagal mengambil data dari server");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const formatText = (text) =>
    text
      ? text
        .replace(/a\./g, '\na.')
        .replace(/b\./g, '\nb.')
        .replace(/c\./g, '\nc.')
        .trim()
      : ''

  return (
    <Template title={website?.nama || 'Beranda'} active="home">

      {/* Carousel Start */}
      <div className="container-fluid p-0 hero-section" style={{ marginTop: '80px' }}>
        <div id="header-carousel" className="carousel slide" data-bs-ride="carousel">
          <div className="carousel-inner">
            {Array.isArray(banner) && banner.length > 0 ? (
              banner.map((b, idx) => (
                <div key={b.id} className={`carousel-item ${idx === 0 ? 'active' : ''}`}>
                  {b?.gambar && (
                    <img
                      className="w-100"
                      src={assetUrl(`/uploads/galeri/${b.gambar}`)}
                      alt="Image"
                    />
                  )}
                  <div className="carousel-caption w-100 h-100 d-flex align-items-center justify-content-center text-center">
                    <div className="w-100 px-3">
                      <div className="row justify-content-center">
                        <div className="col-lg-8">
                          <h1 className="hero-title text-white fw-bold animate-fade-up">
                            Selamat Datang di<br /> {website?.deskripsi}
                          </h1>
                          <p className="hero-subtitle">
                            Kini telah hadir Sistem Informasi Konservasi untuk <br />
                            Unit Pelaksanaan Teknis <br />
                            Tasik Besar Serkap
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="carousel-item active">
                <div className="carousel-caption">
                  <div className="container-fluid p-0">
                    <div className="row justify-content-center">
                      <div className="col-lg-8">
                        <h1 className="display-3 text-white mb-2">
                          Selamat Datang di Sistem Informasi Konservasi
                        </h1>
                        <p className="fs-4">
                          Unit Pelaksana Teknis Tasik Besar Serkap
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Carousel End */}

      <section className="container-fluid p-0 py-0">
        <div className="w-100 p-0">
          {loading && <div className="container py-5 text-center"><p>Memuat...</p></div>}
          {error && <div className="container py-5"><div className="alert alert-danger">{error}</div></div>}

          {!loading && !error && (
            <>
              {/* Struktur Start */}
              {/* padding-bottom di set ke 0 agar nyatu dengan visi misi */}
              <div id="struktur-organisasi" className="container-fluid p-0 pt-5 pb-0">
                <div className="container mb-4">
                  <div className="text-center">
                    <h2 className="fw-bold heading-green animate-title">
                      Struktur Unit Pelaksanaan Teknis Kesatuan Pengelolaan Hutan <br /> Tasik Besar Serkap
                    </h2>
                  </div>
                </div>

                {/* mt-0 dan margin reset agar nempel */}
                <div
                  className="text-center mt-0 p-0 overflow-hidden m-0 g-0"
                  style={{ overflowX: 'auto' }}
                >
                  <img
                    src={
                      website?.struktur
                        ? `${FILE_URL}/uploads/profil/${website.struktur}?t=${Date.now()}`
                        : `${FILE_URL}/uploads/profil/struktur.png?t=${Date.now()}`
                    }
                    alt="Struktur Organisasi"
                    style={{
                      maxWidth: '800px',
                      width: '100%',
                      height: 'auto',
                      display: 'block',
                      margin: '0 auto'
                    }}
                  />
                </div>
              </div>
              {/* Struktur End */}

              {/* Visi Misi Start */}
              <div
                id="visi-misi"
                className="container-fluid p-0 visi-misi-section"
                style={{
                  backgroundImage: `url(${FILE_URL}/img/visi-misi.jpg)`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  position: 'relative',
                  height: 'calc(100vh - 70px)'
                }}
              >
                {/* 🔥 TAMBAH flex biar center */}
                <div className="w-100 position-relative d-flex align-items-center justify-content-center text-center"
                  style={{ zIndex: 2, minHeight: '500px' }}>
                  <div className="content-box text-start" style={{ color: 'black' }}>
                    <h2 className="fw-bold heading-green animate-title">
                      Visi dan Misi Unit Pelaksanaan Teknis Kesatuan <br />Pengelolaan Hutan
                    </h2>
                    <div className="text-start fw-bold mb-4">
                      <p className="mb-2">Visi:</p>
                      <div style={{ whiteSpace: 'pre-line' }}>
                        {formatText(website?.visi || 'Visi belum tersedia')}
                      </div>
                    </div>
                    <div className="text-start fw-bold">
                      <p className="mb-2">Misi:</p>
                      <div style={{ whiteSpace: 'pre-line' }}>
                        {formatText(website?.misi || 'Misi belum tersedia')}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Visi Misi End */}

              {/* Sejarah Start */}
              <div id="sejarah" className="container-xxl py-5">
                <div className="container">
                  <div className="text-center mb-5">
                    <h2 className="fw-bold heading-green animate-title">
                      Sejarah Unit Pelaksanaan Teknis Kesatuan Pengelolaan Hutan <br />Tasik Besar Serkap
                    </h2>
                  </div>
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
                        Namun, dengan dukungan dari berbagai pihak, termasuk pemerintah, masyarakat, and pelaku
                        usaha, diharapkan KPH Tasik Besar Serkap dapat melaksanakan tugas dan fungsinya secara
                        optimal, sehingga pengelolaan hutan di wilayah kerjanya dapat berjalan berkelanjutan dan
                        memberikan manfaat bagi semua pihak.
                      </p>
                    </div>
                    <div className="col-lg-6">
                      <h4>Peraturan Gubenur Riau :</h4>
                      <p style={{ textAlign: 'justify' }}>
                        KPH Tasik Besar Serkap dibentuk berdasarkan Peraturan Gubernur Riau yang mengatur tentang
                        pembentukan and pengelolaan KPH di wilayah Provinsi Riau.
                      </p>
                      <h4>Wilayah Kerja yang Luas :</h4>
                      <p style={{ textAlign: 'justify' }}>
                        KPH Tasik Besar Serkap memiliki wilayah kerja yang cukup luas, mencakup Kabupaten Siak and
                        Pelalawan, yang merupakan kawasan hutan dengan berbagai potensi and fungsi.
                      </p>
                      <h4>Tugas and Fungsi KPH Tasik Besar Serkap:</h4>
                      <ol>
                        <li>Tata Hutan and Penyusunan Rencana Pengelolaan</li>
                        <li>Pemanfaatan Hutan</li>
                        <li>Rehabilitasi and Reklamasi Hutan</li>
                        <li>Perlindungan Hutan</li>
                        <li>Konservasi Sumber Daya Alam</li>
                        <li>Pengendalian Kebakaran Hutan and Lahan</li>
                      </ol>
                    </div>
                  </div>
                </div>
              </div>
              {/* Sejarah End */}
            </>
          )}
        </div>
      </section>
    </Template>
  )
}