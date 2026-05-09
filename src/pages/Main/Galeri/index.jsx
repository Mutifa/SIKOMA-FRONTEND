import React from 'react'
import { Link } from 'react-router-dom'

import DashboardLayout from '../../../layouts/DashboardLayout'
import api from '../../../lib/api.js'

export default function Galeri() {

  const [data, setData] = React.useState([])
  const [error, setError] = React.useState('')
  const [loading, setLoading] = React.useState(true)

  const [currentPage, setCurrentPage] = React.useState(1)
  const [itemsPerPage, setItemsPerPage] = React.useState(8)

  React.useEffect(() => {

    let mounted = true

    api.get('/admin_pusat/galeri')

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

  // PAGINATION
  const totalPages = Math.ceil(data.length / itemsPerPage)

  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage

  const currentData = data.slice(startIndex, endIndex)

  const handleDelete = async (id) => {

    if (
      window.confirm(
        'Apakah Anda yakin ingin menghapus galeri ini?'
      )
    ) {

      try {

        await api.delete(`/admin_pusat/galeri/${id}`)

        setData(
          data.filter(item => item.id !== id)
        )

      } catch (err) {

        setError(
          err.response?.data?.message ||
          'Gagal menghapus data'
        )

      }

    }

  }

  if (loading) {

    return (

      <DashboardLayout title="Galeri">

        <div className="d-flex justify-content-center">
          <div className="spinner-border"></div>
        </div>

      </DashboardLayout>

    )

  }

  return (

    <DashboardLayout title="Galeri">

      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      {/* HEADER */}
      <div className="row mb-4">

        <div className="col-12">

          <div className="d-flex justify-content-between align-items-center">

            <div className="box-title mb-3">
              Kelola halaman galeri
            </div>

            <Link
              to="/galeri/create"
              className="btn btn-success"
            >

              <i className="fas fa-plus me-2"></i>
              Tambah Galeri

            </Link>

          </div>

        </div>

      </div>

      {/* PAGINATION CONTROL */}
      <div className="gallery-controls mb-4">

        <div className="row">

          <div className="col-md-6">

            <div className="d-flex align-items-center">

              <label className="me-2">
                Tampilkan:
              </label>

              <select
                className="form-select form-select-sm me-2"
                style={{ width: '80px' }}
                value={itemsPerPage}
                onChange={(e) =>
                  setItemsPerPage(Number(e.target.value))
                }
              >

                <option value={4}>4</option>
                <option value={8}>8</option>
                <option value={12}>12</option>
                <option value={16}>16</option>

              </select>

              <span>entri</span>

            </div>

          </div>

        </div>

      </div>

      {/* GALLERY */}
      <div className="white-box">

        <h5 className="mb-3">
          Daftar Galeri
        </h5>

        {currentData.length === 0 ? (

          <div className="gallery-empty">

            <i className="fas fa-images fa-3x mb-3"></i>

            <p>Belum ada galeri</p>

          </div>

        ) : (

          <div className="row">

            {currentData.map((item) => (

              <div
                key={item.id}
                className="col-lg-3 col-md-4 col-sm-6 mb-4"
              >

                <div className="card h-100 gallery-card">

                  <div className="position-relative">

                    {item.gambar ? (

                      <img
                        src={`https://codemy.my.id/uploads/galeri/${item.foto}`}
                        className="card-img-top"
                        alt={item.judul}
                        style={{
                          height: '200px',
                          objectFit: 'cover'
                        }}
                      />

                    ) : (

                      <div
                        className="card-img-top d-flex align-items-center justify-content-center gallery-image-placeholder"
                        style={{ height: '200px' }}
                      >

                        <div className="text-center text-muted">

                          <i className="fas fa-image fa-3x mb-2"></i>

                          <div className="small">
                            {item.judul || 'Gambar'}
                          </div>

                        </div>

                      </div>

                    )}

                    <div className="position-absolute top-0 start-0 m-2">

                      <span className="badge bg-primary gallery-badge">

                        {item.keygaleri || 'Galeri'}

                      </span>

                    </div>

                  </div>

                  <div className="card-body d-flex flex-column">

                    <h6 className="card-title gallery-title">
                      {item.judul || 'N/A'}
                    </h6>

                    <p className="card-text small text-muted mb-1">

                      <strong>ID:</strong>
                      {' '}
                      {item.keygaleri || 'N/A'}

                    </p>

                    <p className="card-text gallery-description flex-grow-1">

                      {item.deskripsi || item.keterangan || 'Tidak ada deskripsi'}

                    </p>

                    <div className="d-flex gap-1 mt-auto">

                      <Link
                        to={`/galeri/detail/${item.id}`}
                        className="btn btn-success btn-sm"
                      >
                        <i className="fas fa-eye"></i>
                      </Link>

                      <Link
                        to={`/galeri/edit/${item.id}`}
                        className="btn btn-warning btn-sm"
                      >
                        <i className="fas fa-edit"></i>
                      </Link>

                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(item.id)}
                      >
                        <i className="fas fa-trash"></i>
                      </button>

                    </div>

                  </div>

                </div>

              </div>

            ))}

          </div>

        )}

        {/* PAGINATION */}
        {totalPages > 1 && (

          <div className="gallery-pagination">

            <div className="d-flex justify-content-between align-items-center">

              <div className="text-muted">

                Menampilkan
                {' '}
                {startIndex + 1}
                {' '}
                sampai
                {' '}
                {Math.min(endIndex, data.length)}
                {' '}
                dari
                {' '}
                {data.length}
                {' '}
                entri

              </div>

              <nav>

                <ul className="pagination pagination-sm mb-0">

                  <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>

                    <button
                      className="page-link"
                      onClick={() => setCurrentPage(currentPage - 1)}
                    >
                      Sebelumnya
                    </button>

                  </li>

                  {[...Array(totalPages)].map((_, index) => (

                    <li
                      key={index}
                      className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}
                    >

                      <button
                        className="page-link"
                        onClick={() => setCurrentPage(index + 1)}
                      >
                        {index + 1}
                      </button>

                    </li>

                  ))}

                  <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>

                    <button
                      className="page-link"
                      onClick={() => setCurrentPage(currentPage + 1)}
                    >
                      Berikutnya
                    </button>

                  </li>

                </ul>

              </nav>

            </div>

          </div>

        )}

      </div>

    </DashboardLayout>

  )
}