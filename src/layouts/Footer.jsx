import React from 'react'

export default function Footer({ website }) {
  return (
    <>
      <div className="container-fluid bg-dark text-light footer pt-5 mt-5">
        <div className="container py-5">
          <div className="row g-5">
            <div className="col-lg-3 col-md-6">
              <h4 className="text-light mb-4">Alamat</h4>
              <p className="mb-2"><i className="fa fa-map-marker-alt me-3"></i>{website?.alamat || 'Alamat'}</p>
              <p className="mb-2"><i className="fa fa-phone-alt me-3"></i>{website?.telepon || 'Telepon'}</p>
              <p className="mb-2"><i className="fa fa-envelope me-3"></i>{website?.email || 'Email'}</p>
            </div>
            <div className="col-lg-3 col-md-6">
              <h4 className="text-light mb-4">Jam Operasional</h4>
              <span dangerouslySetInnerHTML={{ __html: website?.jambuka || 'Senin - Jumat' }} />
            </div>
            <div className="col-lg-6 col-md-12">
              <h4 className="text-light mb-4">Maps</h4>
              <div className="map-container" dangerouslySetInnerHTML={{ __html: website?.gmaps || '' }} />
            </div>
          </div>
        </div>
      </div>
      <div className="container-fluid copyright py-4">
        <div className="container">
          <div className="row">
            <div className="col-md-6 text-center text-md-start mb-3 mb-md-0">
              &copy; <a className="border-bottom" href="/">{website?.nama || 'UPT KPH Tasik Besar Serkap'}</a>, All Right Reserved.
            </div>
          </div>
        </div>
      </div>
      <a href="#" className="btn btn-lg btn-primary btn-lg-square rounded-circle back-to-top"><i className="bi bi-arrow-up"></i></a>
    </>
  )
}


