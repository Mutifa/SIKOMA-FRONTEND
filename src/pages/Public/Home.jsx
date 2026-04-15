//import React from 'react'
import Template from '../../layouts/Template.jsx'
import api from '../../lib/api.js'
import { assetUrl } from '../../lib/assets.js'
import { homeService } from '../../services/homeService.js'
import React, { useEffect, useState } from "react";


export default function Home() {
  const [banner, setBanner] = useState([]);
  const [program, setProgram] = useState([]);
  const [website, setWebsite] = useState(null);
  const [loading, setLoading] = useState(true); // 🔥 penting
  const [error, setError] = useState(null);


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
        setLoading(false); // 🔥 WAJIB biar ga loading terus
      });
  }, []);

  return (
    <Template title={website?.nama || 'Beranda'} active="home">

      {/* Carousel Start */}
      <div className="container-fluid p-0 hero-section" style={{ marginTop: '80px' }}>
        <div id="header-carousel" className="carousel slide" data-bs-ride="carousel">

          <div className="carousel-inner">
            {Array.isArray(banner) && banner.length > 0 ? (
              banner.map((b, idx) => (
                <div key={b.id} className={`carousel-item ${idx === 0 ? 'active' : ''}`}>

                  <img
                    className="w-100"
                    src={assetUrl(`/uploads/galeri/${b.gambar}`)}
                    alt="Image"
                  />

                  <div className="carousel-caption w-100 h-100 d-flex align-items-center justify-content-center text-center">
                    <div className="w-100 px-3">
                      <div className="row justify-content-center">
                        <div className="col-lg-8">
                          <h1 className="hero-title text-white fw-bold animate-fade-up">
                            Selamat Datang di<br /> {website?.deskripsi}
                          </h1>
                          <p className="fs-4">
                            Kini telah hadir Sistem Informasi Konservasi untuk UPT KPH Tasik Besar Serkap
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="carousel-item active">
                <img className="w-100" src="/img/carousel-1.jpg" alt="Default" />
                <div className="carousel-caption">
                  <div className="container-fluid p-0">
                    <div className="row justify-content-center">
                      <div className="col-lg-8">
                        <h1 className="display-3 text-white mb-2">
                          Selamat Datang di Sistem Informasi Konservasi
                        </h1>
                        <p className="fs-4">
                          UPT KPH Tasik Besar Serkap
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* {Array.isArray(banner) && banner.length > 1 && (
            <>
              <button className="carousel-control-prev" type="button" data-bs-target="#header-carousel" data-bs-slide="prev">
                <span className="carousel-control-prev-icon"></span>
              </button>

              <button className="carousel-control-next" type="button" data-bs-target="#header-carousel" data-bs-slide="next">
                <span className="carousel-control-next-icon"></span>
              </button>
            </>
          )} */}

        </div>
      </div>
      {/* Carousel End */}

     <section className="container-xxl py-5">
        <div className="container">
          {loading && <p>Memuat...</p>}
          {error && <div className="alert alert-danger">{error}</div>}

          {!loading && !error && (
            <>
              {/* Struktur Start */}
              <div id="struktur-organisasi" className="container-xxl py-5">
                <div className="container">

                  <div className="text-center">

                    <h1 className="mb-5">
                      Struktur Unit Pelaksanaan Teknis Kesatuan Pengelolaan Hutan Tasik Besar Serkap
                    </h1>
                  </div>

                  <div className="text-center mt-4" style={{ overflowX: 'auto' }}>
                    <img
                      src={website?.struktur
                        ? `/img/${website.struktur}`
                        : `/img/struktur.png`
                      }
                      alt="Struktur Organisasi"
                      style={{
                        width: '100%',
                        height: 'auto',
                        borderRadius: '10px',
                        boxShadow: '0 5px 25px rgba(0,0,0,0.2)'
                      }}
                    />
                  </div>
                </div>
              </div>
              {/* Struktur End */}
              


              {/* Visi Misi Start */}
              <div
                id="visi-misi"
                className="container-fluid p-0 visi-misi-section" style={{
                  backgroundImage: 'url(/img/visi-misi.jpg)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  position: 'relative',
                  height: 'calc(100vh - 70px)'// 🔥 biar ga kecil
                }}>

                {/* 🔥 GANTI overlay lama */}
                <div
                  className="position-absolute top-0 start-0 w-100 h-100"
                  style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
                ></div>

                {/* 🔥 TAMBAH flex biar center */}
                <div className="w-100 position-relative d-flex align-items-center justify-content-center text-center"
                  style={{ zIndex: 2, minHeight: '500px' }}>

                  <div className="text-white content-box text-start">
                    <h1 className="mb-4">Visi dan Misi Unit Pelaksanaan Teknis Kesatuan Pengelolaan Hutan Tasik Besar Serkap</h1>
                    <div className="text-start fw-bold mb-4">
                      <p className="mb-2">Visi:</p>
                      <span dangerouslySetInnerHTML={{
                        __html: website?.visi || 'Visi belum tersedia'
                      }} />
                    </div>

                    <div className="text-start fw-bold">
                      <p className="mb-2">Misi:</p>
                      <span dangerouslySetInnerHTML={{
                        __html: website?.misi || 'Misi belum tersedia'
                      }} />
                    </div>
                  </div>
                </div>
              </div>
              {/* Visi Misi End */}

              {/* Sejarah Start */}
              <div id="sejarah" className="container-xxl py-5">
                <div className="container">
                  <div className="text-center">

                    <h1 className="mb-4">Sejarah Unit Pelaksanaan Teknis Kesatuan Pengelolaan Hutan Tasik Besar Serkap</h1>
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
            </>
          )}
        </div>
      </section>
    </Template>
  )
}


