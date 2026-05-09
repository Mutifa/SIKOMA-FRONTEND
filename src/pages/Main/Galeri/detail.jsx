import React from 'react'
import { Link, useParams } from 'react-router-dom'

import DashboardLayout from '../../../layouts/DashboardLayout'
import api from '../../../lib/api.js'

export default function GaleriDetail() {

  const { id } = useParams()

  const [loading, setLoading] = React.useState(true)
  const [data, setData] = React.useState(null)

  React.useEffect(() => {

    let mounted = true

    api.get(`/admin_pusat/galeri/${id}`)

      .then(res => {

        if (mounted) {

          const result = res.data.data || res.data

          setData(result)

          setLoading(false)

        }

      })

      .catch(err => {

        console.log(err)

        setLoading(false)

      })

    return () => { mounted = false }

  }, [id])

  if (loading) {

    return (

      <DashboardLayout title="Detail Galeri">

        <div className="d-flex justify-content-center">
          <div className="spinner-border"></div>
        </div>

      </DashboardLayout>

    )

  }

  return (

    <DashboardLayout title="Detail Galeri">

      <div className="white-box">

        <div className="mb-3">

          <label className="form-label fw-bold">
            Key Galeri
          </label>

          <input
            type="text"
            className="form-control"
            value={data?.keygaleri || ''}
            readOnly
          />

        </div>

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
            Deskripsi
          </label>

          <textarea
            className="form-control"
            rows="5"
            value={data?.deskripsi || data?.keterangan || ''}
            readOnly
          />

        </div>

        <div className="mb-3">

          <label className="form-label fw-bold">
            Gambar
          </label>

          <div>

            {data?.gambar ? (

              <img
                src={`http://127.0.0.1:8000/uploads/galeri/${data.gambar}`}
                alt="Galeri"
                className="img-thumbnail"
                style={{ maxHeight: '250px' }}
              />

            ) : (

              <p className="text-muted">
                Tidak ada gambar
              </p>

            )}

          </div>

        </div>

        <Link
          to="/galeri"
          className="btn btn-secondary"
        >
          Kembali
        </Link>

      </div>

    </DashboardLayout>

  )
}