import React, { useEffect, useState } from 'react'
import Template from '../../layouts/Template.jsx'
import { assetUrl } from '../../lib/assets.js'
import { homeService } from '../../services/homeService.js'

export default function Home() {
  const [banner, setBanner] = useState([])
  const [website, setWebsite] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const fallbackHero = {
    id: 'fallback-hero',
    gambar: null,
    src: '/home-assets/img/carousel-1.jpg',
    alt: 'Kawasan konservasi',
  }

  useEffect(() => {
    let mounted = true

    homeService
      .get()
      .then((res) => {
        if (!mounted) return
        setBanner(res.data.banner || [])
        setWebsite(res.data.website)
      })
      .catch((err) => {
        if (!mounted) return
        console.error('ERROR:', err)
        setError('Gagal mengambil data dari server')
      })
      .finally(() => {
        if (mounted) setLoading(false)
      })

    return () => {
      mounted = false
    }
  }, [])

  const heroItems = Array.isArray(banner) && banner.length > 0 ? banner : [fallbackHero]

  return (
    <Template title={website?.nama || 'Beranda'} active="home">
      <div className="container-fluid p-0 hero-section">
        <div id="header-carousel" className="carousel slide h-100" data-bs-ride="carousel" style={{ position: 'relative' }}>
          <div className="carousel-inner h-100">
            {heroItems.map((b, idx) => (
              <div key={b.id || idx} className={`carousel-item h-100 ${idx === 0 ? 'active' : ''}`} style={{ position: 'relative' }}>
                {(b?.gambar || b?.src) ? (
                  <img
                    className="w-100 h-100"
                    src={b.src || assetUrl(`/uploads/galeri/${b.gambar}`)}
                    alt={b.alt || 'Banner'}
                    width={1920}
                    height={1080}
                    loading={idx === 0 ? 'eager' : 'lazy'}
                    decoding="async"
                    fetchPriority={idx === 0 ? 'high' : 'auto'}
                    style={{ objectFit: 'cover' }}
                  />
                ) : (
                  <div className="hero-media-placeholder" />
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
            ))}
          </div>
        </div>
      </div>

      {loading && (
        <section className="container py-5 home-section-placeholder">
          <div className="image-placeholder mb-4" style={{ height: 48, maxWidth: 720, margin: '0 auto', borderRadius: 8 }} />
        </section>
      )}

      {error && (
        <section className="container py-5">
          <div className="alert alert-danger">{error}</div>
        </section>
      )}
    </Template>
  )
}
