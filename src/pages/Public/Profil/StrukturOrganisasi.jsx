import React from 'react'
import Template from '../../../layouts/Template.jsx'
import { homeService } from '../../../services/homeService.js'

const FILE_URL = 'https://codemy.my.id'

export default function StrukturOrganisasi() {
  const [website, setWebsite] = React.useState(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState('')

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
        setError(err.message || 'Gagal mengambil data struktur organisasi.')
      })
      .finally(() => {
        if (mounted) setLoading(false)
      })

    return () => {
      mounted = false
    }
  }, [])

  return (
    <Template title="Struktur Organisasi" active="profil">
      <section id="struktur-organisasi" className="structure-section container-fluid p-0">
        <div className="container mb-4 structure-heading">
          <div className="text-center">
            
            <h1 className="fw-bold heading-green animate-title">
              Struktur Unit Pelaksanaan Teknis Kesatuan Pengelolaan Hutan <br /> Tasik Besar Serkap
            </h1>
            <p className="structure-subtitle">
              Alur kepemimpinan dan pembagian peran pengelolaan kawasan UPT KPH Tasik Besar Serkap.
            </p>
          </div>
        </div>

        {loading && (
          <div className="structure-frame">
            <div className="image-placeholder" style={{ aspectRatio: '1448 / 720', borderRadius: 8 }} />
          </div>
        )}

        {error && (
          <div className="container">
            <div className="alert alert-danger">{error}</div>
          </div>
        )}

        {!loading && !error && (
          <div className="structure-frame text-center mt-0 overflow-hidden" style={{ overflowX: 'auto' }}>
            <img
              className="structure-image"
              src={
                website?.struktur
                  ? `${FILE_URL}/uploads/profil/${website.struktur}`
                  : `${FILE_URL}/uploads/profil/struktur.png`
              }
              alt="Struktur Organisasi"
              width={1448}
              height={720}
              loading="lazy"
              decoding="async"
              style={{
                maxWidth: '800px',
                width: '100%',
                height: 'auto',
                display: 'block',
                margin: '0 auto',
              }}
            />
          </div>
        )}
      </section>
    </Template>
  )
}
