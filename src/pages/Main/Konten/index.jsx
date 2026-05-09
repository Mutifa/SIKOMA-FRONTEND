import React from 'react'
import { Link } from 'react-router-dom'

import DashboardLayout from '../../../layouts/DashboardLayout.jsx'
import { kontenService } from '../../../services/kontenService'
import { assetUrl } from '../../../lib/assets.js'

export default function Konten() {

  const [data, setData] = React.useState([])
  const [error, setError] = React.useState('')
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {

    let mounted = true

    kontenService.getAll()

      .then(res => {

        if (mounted) {

          setData(
            res.data.data || res.data
          )

          setLoading(false)

        }

      })

      .catch(err => {

        if (mounted) {

          setError(
            err.response?.data?.message ||
            'Gagal memuat data'
          )

          setLoading(false)

        }

      })

    return () => { mounted = false }

  }, [])

  const handleDelete = async (id) => {

    if (
      window.confirm(
        'Apakah Anda yakin ingin menghapus konten ini?'
      )
    ) {

      try {

        await kontenService.delete(id)

        setData(
          data.filter(item => item.id !== id)
        )

      } catch (err) {

        setError(
          err.response?.data?.message ||
          'Gagal menghapus konten'
        )

      }

    }

  }

  const stripHtmlTags = (html) => {

    if (!html) return ''

    return html.replace(/<[^>]*>/g, '')

  }

  if (loading) {

    return (
      <DashboardLayout title="Konten Informasi & Edukasi">

        <div className="d-flex justify-content-center">
          <div className="spinner-border"></div>
        </div>

      </DashboardLayout>
    )

  }

  return (

    <DashboardLayout title="Konten Informasi & Edukasi">

      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      <div className="row">

        <div className="col-12">

          <Link
            to="/konten/create"
            className="btn btn-primary btn-sm float-end"
          >
            + Tambah Konten
          </Link>

          <div className="white-box">

            <div className="box-title mb-3">
              Kelola halaman konten informasi & edukasi
            </div>

            <div className="table-responsive">

              <table className="table">

                <thead>
                  <tr>
                    <th>No</th>
                    <th>Foto</th>
                    <th>Judul</th>
                    <th>Deskripsi</th>
                    <th>Aksi</th>
                  </tr>
                </thead>

                <tbody>

                  {data.length === 0 ? (

                    <tr>
                      <td colSpan="5" className="text-center">
                        Belum ada konten
                      </td>
                    </tr>

                  ) : (

                    data.map((item, index) => (

                      <tr key={item.id} className="align-middle">

                        <td>{index + 1}.</td>

                        <td>

                          {item.foto ? (

                            <img
                              src={assetUrl(`/uploads/edukasi/${item.foto}`)}
                              alt="Foto Konten"
                              className="img-fluid"
                              width="100px"
                            />

                          ) : (
                            '-'
                          )}

                        </td>

                        <td>{item.judul}</td>

                        <td>

                          <div
                            style={{
                              display: '-webkit-box',
                              WebkitLineClamp: 3,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden'
                            }}
                          >

                            {stripHtmlTags(item.deskripsi)}

                          </div>

                        </td>

                        <td>

                          <Link
                            to={`/konten/detail/${item.id}`}
                            className="btn btn-success btn-sm me-1"
                          >
                            <i className="fas fa-eye"></i>
                          </Link>

                          <Link
                            to={`/konten/edit/${item.id}`}
                            className="btn btn-warning btn-sm me-1"
                          >
                            <i className="fas fa-edit"></i>
                          </Link>

                          <button
                            className="btn btn-danger btn-sm text-white"
                            onClick={() => handleDelete(item.id)}
                          >
                            <i className="fas fa-trash"></i>
                          </button>

                        </td>

                      </tr>

                    ))

                  )}

                </tbody>

              </table>

            </div>

          </div>

        </div>

      </div>

    </DashboardLayout>

  )
}