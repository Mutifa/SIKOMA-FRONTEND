import React from 'react'
import { Link, useParams } from 'react-router-dom'

import DashboardLayout from '../../../layouts/DashboardLayout.jsx'
import peraturanService from '../../../services/peraturan.js'

export default function PeraturanDetail() {

  const { id } = useParams()

  const [loading, setLoading] = React.useState(true)
  const [data, setData] = React.useState(null)

  React.useEffect(() => {

    let mounted = true

    peraturanService.get(id || '')

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
      <DashboardLayout title="Detail Peraturan">
      </DashboardLayout>
    )

  }

  return (

    <DashboardLayout title="Detail Peraturan">

      <div className="white-box">

        <div className="mb-3">

          <label className="form-label fw-bold">
            Nama
          </label>

          <input
            type="text"
            className="form-control"
            value={data?.nama || ''}
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
            value={data?.deskripsi || ''}
            readOnly
          />

        </div>

        <div className="row">

          <div className="col-md-6 mb-3">

            <label className="form-label fw-bold">
              Tahun
            </label>

            <input
              type="text"
              className="form-control"
              value={data?.tahun || ''}
              readOnly
            />

          </div>

          <div className="col-md-6 mb-3">

            <label className="form-label fw-bold">
              Nomor
            </label>

            <input
              type="text"
              className="form-control"
              value={data?.nomor || ''}
              readOnly
            />

          </div>

        </div>

        <div className="mb-3">

          <label className="form-label fw-bold">
            File
          </label>

          <div>

            {data?.file ? (

              <a
                href={`https://codemy.my.id/uploads/peraturan/${data.file}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline-info"
              >

                <i className="fas fa-file-alt me-1"></i>
                Lihat File

              </a>

            ) : (

              <p className="text-muted">
                Tidak ada file
              </p>

            )}

          </div>

        </div>

        <Link
          to="/peraturan"
          className="btn btn-secondary"
        >
          Kembali
        </Link>

      </div>

    </DashboardLayout>

  )
}