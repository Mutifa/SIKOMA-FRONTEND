import React from 'react'
import { Link } from 'react-router-dom'

import DashboardLayout from '../../../layouts/DashboardLayout.jsx'
import api from '../../../lib/api.js'

export default function Program() {

  const [data, setData] = React.useState([])
  const [error, setError] = React.useState('')
  const [loading, setLoading] = React.useState(true)

  const [searchTerm, setSearchTerm] = React.useState('')
  const [currentPage, setCurrentPage] = React.useState(1)
  const [itemsPerPage, setItemsPerPage] = React.useState(10)

  React.useEffect(() => {

    let mounted = true

    api.get('/admin_pusat/program')

      .then(res => {

        if (mounted) {

          const programData =
            res.data.data || res.data

          setData(programData)
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
        'Apakah Anda yakin ingin menghapus program ini?'
      )
    ) {

      try {

        await api.delete(`/admin_pusat/program/${id}`)

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

  const stripHtmlTags = (html) => {

    if (!html) return ''

    return html.replace(/<[^>]*>/g, '')

  }

  // SEARCH
  const filteredData = data.filter(item =>
    item.judul.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.deskripsi.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // PAGINATION
  const totalPages = Math.ceil(filteredData.length / itemsPerPage)

  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage

  const currentData = filteredData.slice(startIndex, endIndex)

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(parseInt(e.target.value))
    setCurrentPage(1)
  }

  if (loading) {

    return (
      <DashboardLayout title="Program">

        <div className="d-flex justify-content-center">
          <div className="spinner-border"></div>
        </div>

      </DashboardLayout>
    )

  }

  return (

    <DashboardLayout title="Program">

      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      <div className="row">

        <div className="col-12">

          <Link
            to="/program/create"
            className="btn btn-primary btn-sm float-end"
          >
            + Tambah Program
          </Link>

          <div className="white-box">

            <div className="box-title mb-3">
              Kelola halaman program
            </div>

            {/* SEARCH */}
            <div className="row mb-3">

              <div className="col-md-6">

                <div className="d-flex align-items-center">

                  <label className="me-2">
                    Tampilkan
                  </label>

                  <select
                    className="form-select form-select-sm me-2"
                    style={{ width: 'auto' }}
                    value={itemsPerPage}
                    onChange={handleItemsPerPageChange}
                  >

                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>

                  </select>

                  <span>entri</span>

                </div>

              </div>

              <div className="col-md-6">

                <div className="d-flex justify-content-end">

                  <label className="me-2">
                    Cari:
                  </label>

                  <input
                    type="text"
                    className="form-control form-control-sm"
                    style={{ width: '200px' }}
                    value={searchTerm}
                    onChange={(e) =>
                      setSearchTerm(e.target.value)
                    }
                    placeholder="Search..."
                  />

                </div>

              </div>

            </div>

            {/* TABLE */}
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

                  {currentData.length === 0 ? (

                    <tr>
                      <td colSpan="6" className="text-center">
                        Belum ada program
                      </td>
                    </tr>

                  ) : (

                    currentData.map((item, index) => (

                      <tr key={item.id} className="align-middle">

                        <td>{startIndex + index + 1}.</td>

                        <td>

                          {item.foto ? (

                            <img
                              src={`https://codemy.my.id/uploads/edukasi/${item.foto}`}
                              alt="Foto"
                              width="100"
                              className="img-fluid"
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
                          <div className="d-flex gap-1 justify-content-center">

                            <Link
                              to={`/program/detail/${item.id}`}
                              className="btn btn-success btn-sm"
                            >
                              <i className="fas fa-eye"></i>
                            </Link>

                            <Link
                              to={`/program/edit/${item.id}`}
                              className="btn btn-warning btn-sm"
                            >
                              <i className="fas fa-edit"></i>
                            </Link>

                            <button
                              className="btn btn-danger btn-sm text-white"
                              onClick={() => handleDelete(item.id)}
                            >
                              <i className="fas fa-trash"></i>
                            </button>

                          </div>
                        </td>

                      </tr>

                    ))

                  )}

                </tbody>

              </table>

            </div>

            {/* PAGINATION */}
            <div className="row mt-3">

              <div className="col-md-6">

                <p className="text-muted">

                  Menampilkan
                  {' '}
                  {startIndex + 1}
                  {' '}
                  sampai
                  {' '}
                  {Math.min(endIndex, filteredData.length)}
                  {' '}
                  dari
                  {' '}
                  {filteredData.length}
                  {' '}
                  entri

                </p>

              </div>

              <div className="col-md-6">

                <nav>

                  <ul className="pagination justify-content-end">

                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>

                      <button
                        className="page-link"
                        onClick={() => handlePageChange(currentPage - 1)}
                      >
                        Sebelumnya
                      </button>

                    </li>

                    {Array.from(
                      { length: totalPages },
                      (_, i) => i + 1
                    ).map(page => (

                      <li
                        key={page}
                        className={`page-item ${currentPage === page ? 'active' : ''}`}
                      >

                        <button
                          className="page-link"
                          onClick={() => handlePageChange(page)}
                        >
                          {page}
                        </button>

                      </li>

                    ))}

                    <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>

                      <button
                        className="page-link"
                        onClick={() => handlePageChange(currentPage + 1)}
                      >
                        Berikutnya
                      </button>

                    </li>

                  </ul>

                </nav>

              </div>

            </div>

          </div>

        </div>

      </div>

    </DashboardLayout>

  )
}