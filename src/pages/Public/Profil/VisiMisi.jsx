import React from 'react'
import Template from '../../../layouts/Template.jsx'
import { homeService } from '../../../services/homeService.js'

const FILE_URL = 'https://codemy.my.id'

function formatText(text) {
  return text
    ? text
        .replace(/\r\n/g, '\n')
        .replace(/a\./g, '\na.')
        .replace(/b\./g, '\nb.')
        .replace(/c\./g, '\nc.')
        .replace(/\n{2,}/g, '\n')
        .trim()
    : ''
}

export default function VisiMisi() {
  const [website, setWebsite] = React.useState(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState('')
  const [activeVisionItem, setActiveVisionItem] = React.useState('vision')

  React.useEffect(() => {
    let mounted = true

    homeService
      .get()
      .then((res) => {
        if (!mounted) return
        setWebsite(res.data.website)
      })
      .catch((err) => {
        if (!mounted) return
        setError(err.message || 'Gagal mengambil data visi misi.')
      })
      .finally(() => {
        if (mounted) setLoading(false)
      })

    return () => {
      mounted = false
    }
  }, [])

  const visiContent = formatText(website?.visi || 'Visi belum tersedia')
  const misiItems = formatText(website?.misi || 'Misi belum tersedia')
    .split('\n')
    .filter(Boolean)

  return (
    <Template title="Visi Misi" active="profil">
      <section id="visi-misi" className="container-fluid p-0 visi-misi-section">
        {loading && (
          <div className="container py-5">
            <div className="image-placeholder" style={{ height: 420, borderRadius: 8 }} />
          </div>
        )}

        {error && (
          <div className="container py-5">
            <div className="alert alert-danger">{error}</div>
          </div>
        )}

        {!loading && !error && (
          <div className="visi-misi-content-wrap">
            <div className="visi-misi-page-heading text-center">
              <h1 className="fw-bold heading-green animate-title">
                Visi dan Misi Unit Pelaksanaan Teknis Kesatuan <br />Pengelolaan Hutan
              </h1>
            </div>
            <div className="visi-misi-showcase">
              <div className="visi-misi-media-panel" aria-hidden="true">
                <div className="visi-misi-photo-frame">
                  <img
                    src={`${FILE_URL}/img/visi-misi.jpg`}
                    alt=""
                    className="visi-misi-photo"
                    width={900}
                    height={650}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div className="visi-misi-logo-badge">
                  <img src="/img/logo.png" alt="" width={82} height={82} loading="lazy" decoding="async" />
                </div>
              </div>

              <div className="content-box text-start">
       

                <div className="visi-misi-stack">
                  <article
                    className={`visi-misi-card visi-card ${activeVisionItem === 'vision' ? 'is-active' : ''}`}
                    role="button"
                    tabIndex={0}
                    onClick={() => setActiveVisionItem('vision')}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') setActiveVisionItem('vision')
                    }}
                  >
                    <span className="visi-misi-label">Visi:</span>
                    <p className="visi-misi-text">{visiContent}</p>
                  </article>

                  <article
                    className={`visi-misi-card misi-card ${activeVisionItem === 'mission' ? 'is-active' : ''}`}
                    role="button"
                    tabIndex={0}
                    onClick={() => setActiveVisionItem('mission')}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') setActiveVisionItem('mission')
                    }}
                  >
                    <span className="visi-misi-label">Misi:</span>
                    <ol className="misi-list">
                      {misiItems.map((item) => (
                        <li key={item}>{item.replace(/^[a-z]\.\s*/i, '')}</li>
                      ))}
                    </ol>
                  </article>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </Template>
  )
}
