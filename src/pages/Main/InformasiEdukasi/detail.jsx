import React from 'react'
import { Link, useParams } from 'react-router-dom'

import DashboardLayout from '../../../layouts/DashboardLayout.jsx'
import adminInformasiEdukasiService from '../../../services/adminInformasiEdukasiService.js'
import { assetUrl } from '../../../lib/assets.js'

export default function KontenDetail() {

  const { id } = useParams()

  const [loading, setLoading] = React.useState(true)
  const [data, setData] = React.useState(null)

  React.useEffect(() => {

    let mounted = true

    adminInformasiEdukasiService.getById(id)
      .then(res => {
    if (mounted) {
      const result = res.data.data || res.data

      const kategoriLabel = {
        'Satwa': 'Edukasi',
        'Executive': 'Informasi',
        'Program': 'Berita'
      }

      setData({
        ...result,
        kategori: kategoriLabel[result.kategori] || result.kategori
      })

      setLoading(false)
    }
  })

   .catch(err => {         // ← tambah ini
    console.error(err)
    if (mounted) setLoading(false)
  })

    return () => { mounted = false }

  }, [id])

  const stripHtmlTags = (html) => {

    if (!html) return ''

    return html.replace(/<[^>]*>/g, '')

  }

  if (loading) {

    return (
      <DashboardLayout title="Detail Konten">
      </DashboardLayout>
    )

  }

  return (

    <DashboardLayout 
      title="Detail Konten"
      actions={
        <Link
          to="/dashboard/informasi-edukasi"
          className="btn btn-secondary"
        >
          Kembali
        </Link>
      }
    >

      <div className="white-box">

        <div className="mb-3">

          <label className="form-label fw-bold">
            Judul
          </label>

          <input
            type="text"
            className="form-control"
            value={data?.judul || ''}
            readOnly
          />

        </div>

        <div className="mb-3">

          <label className="form-label fw-bold">
            Kategori
          </label>

          <input
            type="text"
            className="form-control"
            value={data?.kategori || ''}
            readOnly
          />

        </div>

        <div className="mb-3">

          <label className="form-label fw-bold">
            Foto
          </label>

          <div>

            {data?.foto ? (

              <img
                src={assetUrl(`/uploads/edukasi/${data.foto}`)}
                alt="Konten"
                className="img-thumbnail"
                width={400}
                height={250}
                loading="lazy"
                decoding="async"
                style={{ width: 'auto', maxHeight: '250px', objectFit: 'contain' }}
              />

            ) : (

              <p className="text-muted">
                Tidak ada foto
              </p>

            )}

          </div>

        </div>

        <div className="mb-3">

          <label className="form-label fw-bold">
            Deskripsi
          </label>

          <textarea
            className="form-control"
            rows="8"
            value={stripHtmlTags(data?.deskripsi || '')}
            readOnly
          />

        </div>

      </div>

    </DashboardLayout>

  )
}
