import React from 'react'
import { Link, useParams } from 'react-router-dom'
import DashboardLayout from '../../../layouts/DashboardLayout.jsx'
import programService from '../../../services/programService.js'

export default function ProgramDetail() {

  const { id } = useParams()

  const [loading, setLoading] = React.useState(true)
  const [data, setData] = React.useState(null)

  React.useEffect(() => {

    let mounted = true

    programService.getById(id)

      .then(res => {

        if (mounted) {

          const result = res.data.data || res.data

          setData(result)

          setLoading(false)

        }

      })

      .catch(err => {


        setLoading(false)

      })

    return () => { mounted = false }

  }, [id])

  if (loading) {

    return (
      <DashboardLayout title="Detail Program">
      </DashboardLayout>
    )

  }

  return (

    <DashboardLayout
      title="Detail Program"
      actions={
        <div className="d-flex flex-wrap gap-2 justify-content-between align-items-center">
          <Link to="/dashboard/program" className="btn btn-secondary">Kembali</Link>
        </div>
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
            Foto
          </label>

          <div>

            {data?.foto ? (

              <img
                src={`https://codemy.my.id/uploads/program/${data.foto}`}
                alt="Program"
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
            value={data?.deskripsi || ''}
            readOnly
          />

        </div>

      </div>

    </DashboardLayout>

  )
}
