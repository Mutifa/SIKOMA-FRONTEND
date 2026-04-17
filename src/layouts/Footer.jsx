import React from 'react'

export default function Footer({ website }) {
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
              <p><i className="fab fa-facebook me-2"></i> kph.tbs</p>
              <p><i className="fab fa-instagram me-2"></i> kph.tbs</p>

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