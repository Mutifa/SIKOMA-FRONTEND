import React from 'react'
import { Link } from 'react-router-dom'

import DashboardLayout from '../../../layouts/DashboardLayout.jsx'
import api from '../../../lib/api.js'

export default function Peraturan() {

  const [data, setData] = React.useState([])
  const [error, setError] = React.useState('')
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {

    let mounted = true

    api.get('/admin_pusat/peraturan')

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
        'Apakah Anda yakin ingin menghapus peraturan ini?'
      )
    ) {

      try {

        await api.delete(`/admin_pusat/peraturan/${id}`)

        setData(
          data.filter(item => item.id !== id)
        )

      } catch (err) {

        setError(
          err.response?.data?.message ||
          'Gagal menghapus peraturan'
        )

      }

    }

  }

  if (loading) {

    return (

      <DashboardLayout title="Peraturan">

        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
          <div className="spinner-border text-primary"></div>
        </div>

      </DashboardLayout>

    )

  }

  return (

    <DashboardLayout title="Peraturan">

      {error && (

        <div className="alert alert-danger">
          {error}
        </div>

      )}

      <div className="row">

        <div className="col-12">

          {/* HEADER */}
          <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-2 mb-3">

            <div>
              <div className="box-title">
                Manajemen halaman peraturan
              </div>
            </div>

            <Link
              to="/peraturan/create"
              className="btn btn-primary btn-sm d-flex align-items-center gap-1"
            >

              <i className="fas fa-plus"></i>

              <span>
                Tambah Peraturan
              </span>

            </Link>

          </div>

          {/* TABLE */}
          <div className="white-box p-0 overflow-hidden">

            <div className="table-responsive">

              <table className="table table-hover mb-0">

                <thead className="table-light">

                  <tr>
                    <th className="ps-3">No</th>
                    <th>Nama</th>
                    <th>Deskripsi</th>
                    <th>Tahun / Nomor</th>
                    <th className="text-center pe-3">
                      Aksi
                    </th>
                  </tr>

                </thead>

                <tbody>

                  {data.length === 0 ? (

                    <tr>
                      <td colSpan="6" className="text-center py-5 text-muted">
                        Belum ada peraturan
                      </td>
                    </tr>

                  ) : (

                    data.map((item, index) => (

                      <tr key={item.id} className="align-middle">

                        <td className="ps-3">
                          {index + 1}
                        </td>

                        <td>
                          {item.nama}
                        </td>

                        <td>
                          {item.deskripsi || '-'}
                        </td>

                        <td>

                          {item.tahun || item.nomor ? (

                            <span className="badge bg-light text-dark border">

                              {item.tahun}
                              {item.tahun && item.nomor ? ' / ' : ''}
                              {item.nomor}

                            </span>

                          ) : (
                            '-'
                          )}

                        </td>

                      

                        <td className="text-center pe-3">

                          <Link
                            to={`/peraturan/detail/${item.id}`}
                            className="btn btn-success btn-sm me-1"
                          >
                            <i className="fas fa-eye"></i>
                          </Link>

                          <Link
                            to={`/peraturan/edit/${item.id}`}
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