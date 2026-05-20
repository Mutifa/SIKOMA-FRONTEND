import React from 'react'
import { useParams } from 'react-router-dom'
import Template from '../../layouts/Template.jsx'
import api from '../../lib/api.js'
import { assetUrl } from '../../lib/assets.js'
import { sanitizeHtml } from '../../utils/sanitizeHtml.js'

export default function ProgramDetail() {
  const { slug } = useParams()
  const [data, setData] = React.useState(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState('')

React.useEffect(() => {
  let mounted = true

  api.get(`/program/${slug}`)
    .then(res => {
      if (mounted) {
        setData(res.data.data || res.data)
        setLoading(false)
      }
    })
    .catch(err => {
      if (mounted) {
        setError(err.message)
        setLoading(false)
      }
    })

  return () => { mounted = false }
}, [slug])

  return (
    <Template title={`Detail: ${data?.slug || slug}`} active="edukasi">
      <section className="container my-5">
        {loading && <p>Memuat...</p>}
        {error && <div className="alert alert-danger">{error}</div>}
        {!loading && !error && data && (
          <div className="row">
            <div className="col-lg-6 mb-4">
              <img src={assetUrl(`/uploads/edukasi/${data.foto}`)} alt={data.judul} style={{width:'100%', height:400, objectFit:'cover', borderRadius:10}} />
              <div className="mt-3" style={{display:'flex', gap:8, flexWrap:'wrap'}}>
                <img loading="lazy" src={assetUrl(`/uploads/edukasi/${data.foto}`)} style={{width:100, height:80, objectFit:'cover', borderRadius:6}} />
                {data?.galeri?.map((g) => (
                  <img loading="lazy" key={g.id} src={assetUrl(`/uploads/galeri/${g.gambar}`)} style={{width:100, height:80, objectFit:'cover', borderRadius:6}} />
                ))}
              </div>
            </div>
            <div className="col-lg-6 mb-4">
              <h1 className="mb-2">{data.judul}</h1>
              <hr />
              <div>
                <span dangerouslySetInnerHTML={{ __html: sanitizeHtml(data.deskripsi) }} />
              </div>
            </div>
          </div>
        )}
      </section>
    </Template>
  )
}

