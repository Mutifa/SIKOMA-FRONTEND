import React from 'react'

export default function Footer({ website }) {
  const getSocialLabel = (value, fallback) => {
    if (!value) return fallback

    return value
      .replace(/^https?:\/\/(www\.)?/i, '')
      .replace(/^(facebook|instagram)\.com\//i, '')
      .replace(/^@/, '')
      .replace(/\/$/, '')
  }

  const getSocialUrl = (value, platform) => {
    if (!value) return '#'
    if (/^https?:\/\//i.test(value)) return value

    const username = value.replace(/^@/, '')
    return platform === 'facebook'
      ? `https://facebook.com/${username}`
      : `https://instagram.com/${username}`
  }

  const facebookLabel = getSocialLabel(website?.facebook, 'kph.tbs')
  const instagramLabel = getSocialLabel(website?.instagram, 'kph.tbs')
  const facebookUrl = getSocialUrl(website?.facebook, 'facebook')
  const instagramUrl = getSocialUrl(website?.instagram, 'instagram')

  return (
    <>
     <div id="kontak" style={{ background: '#2f2f2f', color: '#fff' }}>
        <div className="container py-5">
          <div className="row">

            {/* KIRI */}
            <div className="col-md-6">

              {/* MENU */}
              <div className="mb-4">
                <a className="me-3 text-white">Profil</a>
                <a className="me-3 text-white">Program</a>
                <a className="me-3 text-white">Data & Informasi</a>
                <a className="me-3 text-white">Standar Pelayanan</a>
              </div>

              {/* SOSIAL */}
              <p>
                <a
                  href={facebookUrl}
                  className="text-white"
                  target={facebookUrl === '#' ? undefined : '_blank'}
                  rel={facebookUrl === '#' ? undefined : 'noopener noreferrer'}
                >
                  <i className="fab fa-facebook me-2"></i>
                  {facebookLabel}
                </a>
              </p>
              <p>
                <a
                  href={instagramUrl}
                  className="text-white"
                  target={instagramUrl === '#' ? undefined : '_blank'}
                  rel={instagramUrl === '#' ? undefined : 'noopener noreferrer'}
                >
                  <i className="fab fa-instagram me-2"></i>
                  {instagramLabel}
                </a>
              </p>

              <p className="mt-3">terms & services</p>
              <p>{website?.nama || 'SIKOMA'} © 2026</p>
            </div>

            {/* KANAN */}
            <div className="col-md-6 text-md-end">
             <h5 className="text-white">Kontak</h5>
              <p>{website?.telepon || '+62 8123456789'}</p>
              <p>{website?.email || 'info@UPTKPH.com'}</p>
              <p>{website?.alamat || 'Pekanbaru, Riau'}</p>
            </div>

          </div>
        </div>
      </div>

      {/* COPYRIGHT */}
      <div style={{ background: '#1b1b1b', color: '#fff' }}>
        <div className="container py-3 text-center">
          © {website?.nama || 'UPT KPH Tasik Besar Serkap'} 2026
        </div>
      </div>
    </>
  )
}
