import React from 'react'
import Template from '../../layouts/Template.jsx'
import api from '../../lib/api.js'
import { assetUrl } from '../../lib/assets.js'

export default function Edukasi() {
  const [items, setItems] = React.useState([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState('')

  React.useEffect(() => {
    let mounted = true
    api.get('/api/edukasi')
      .then(res => { if (mounted) { setItems(res.data.items || []); setLoading(false) } })
      .catch(err => { if (mounted) { setError(err.message); setLoading(false) } })
    return () => { mounted = false }
  }, [])

  return (
    <Template title="Edukasi" active="edukasi">
      <div className="container-fluid page-header py-5 mb-5 wow fadeIn" data-wow-delay="0.1s">
        <div className="container text-center py-5">
          <h1 className="display-5 text-white mb-4 animated slideInDown">Program</h1>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb justify-content-center mb-0">
              <li className="breadcrumb-item"><a href="/">Home</a></li>
              <li className="breadcrumb-item active" aria-current="page">Program</li>
            </ol>
          </nav>
        </div>
      </div>
      <section className="container-xxl py-5">
        <div className="container">
          <h1 className="mb-4">Program / Edukasi</h1>
          {loading && <p>Memuat...</p>}
          {error && <div className="alert alert-danger">{error}</div>}
          <div className="row g-4">
            {items.map((p) => (
              <div key={p.id} className="col-md-4">
                <div className="border rounded">
                  <img loading="lazy" src={assetUrl(`/uploads/edukasi/${p.foto}`)} alt={p.judul} className="produk-img" />
                  <h4 className="m-3">{p.judul}</h4>
                  <div className="mb-3 px-3">
                    <a href={`/edukasi/${p.slug}`} className="btn btn-primary">Selengkapnya</a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Template>
  )
}


