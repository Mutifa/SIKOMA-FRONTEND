import React from 'react'
import { Link } from 'react-router-dom'

import DashboardLayout from '../../../layouts/DashboardLayout'
import api from '../../../lib/api.js'
import {
  confirmDelete,
  successAlert,
  errorAlert
} from '../../../utils/alert'

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
          setData(res.data.data || res.data)
          setLoading(false)
        }
      })
      .catch(err => {
        if (mounted) {
          setError(err.response?.data?.message || 'Gagal memuat data')
          setLoading(false)
        }
      })

    return () => { mounted = false }

  }, [])

  const totalPages = Math.ceil(data.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentData = data.slice(startIndex, endIndex)

  const handleDelete = async (id) => {
    const result = await confirmDelete()
    if (result.isConfirmed) {
      try {
        await api.delete(`/admin_pusat/galeri/${id}`)
        setData(prev => prev.filter(item => item.id !== id))
        await successAlert('Berhasil', 'Galeri berhasil dihapus')
      } catch (err) {
        setError(err.response?.data?.message || 'Gagal menghapus data')
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

      {error && <div className="alert alert-danger">{error}</div>}

      {/* ── HEADER ── */}
      <div className="d-flex justify-content-between align-items-center mb-4">

        <div className="box-title mb-0">
          Kelola halaman galeri
        </div>

        {/* Tombol Tambah — btn-primary-custom */}
        <Link to="/galeri/create" className="btn-primary-custom">
          <i className="fas fa-plus"></i>
          Tambah Galeri
        </Link>

      </div>

      {/* ── KONTROL PAGINATION ── */}
      <div className="mb-4">
        <div className="d-flex align-items-center">
          <label className="me-2">Tampilkan:</label>
          <select
            className="form-select form-select-sm me-2"
            style={{ width: '80px' }}
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(Number(e.target.value))}
          >
            <option value={4}>4</option>
            <option value={8}>8</option>
            <option value={12}>12</option>
            <option value={16}>16</option>
          </select>
          <span>entri</span>
        </div>
      </div>

      {/* ── GRID GALERI ── */}
      <div className="white-box">

        <h5 className="mb-3">Daftar Galeri</h5>

        {currentData.length === 0 ? (

          <div className="gallery-empty">
            <i className="fas fa-images fa-3x mb-3"></i>
            <p>Belum ada galeri</p>
          </div>

        ) : (

          <div className="row">

            {currentData.map((item) => (

              <div key={item.id} className="col-lg-3 col-md-4 col-sm-6 mb-4">

                <div className="card h-100 gallery-card">

                  <div className="position-relative">

                    {item.foto ? (
                      <img
                        src={`https://codemy.my.id/uploads/galeri/${item.foto}`}
                        className="card-img-top"
                        alt={item.judul}
                        style={{ height: '200px', objectFit: 'cover' }}
                      />
                    ) : (
                      <div
                        className="card-img-top d-flex align-items-center justify-content-center"
                        style={{ height: '200px', background: '#f0f5f2' }}
                      >
                        <div className="text-center text-muted">
                          <i className="fas fa-image fa-3x mb-2"></i>
                          <div className="small">{item.judul || 'Gambar'}</div>
                        </div>
                      </div>
                    )}

                    <div className="position-absolute top-0 start-0 m-2">
                      <span className="badge bg-primary">
                        {item.keygaleri || 'Galeri'}
                      </span>
                    </div>

                  </div>

                  <div className="card-body d-flex flex-column">

                    <h6 className="card-title gallery-title">{item.judul || 'N/A'}</h6>

                    <p className="card-text small text-muted mb-1">
                      <strong>ID:</strong> {item.keygaleri || 'N/A'}
                    </p>

                    <p className="card-text gallery-description flex-grow-1">
                      {item.deskripsi || item.keterangan || 'Tidak ada deskripsi'}
                    </p>

                    {/* Tombol Aksi — semua pakai *-custom */}
                    <div className="d-flex gap-1 mt-auto">

                      <Link
                        to={`/galeri/detail/${item.id}`}
                        className="btn-primary-custom btn-sm"
                        title="Detail"
                      >
                        <i className="fas fa-eye"></i>
                      </Link>

                      <Link
                        to={`/galeri/edit/${item.id}`}
                        className="btn-warning-custom btn-sm"
                        title="Edit"
                      >
                        <i className="fas fa-edit"></i>
                      </Link>

                      <button
                        className="btn-danger-custom btn-sm"
                        onClick={() => handleDelete(item.id)}
                        title="Hapus"
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

        {/* ── PAGINATION ── */}
        {totalPages > 1 && (
          <div className="d-flex justify-content-between align-items-center mt-3">

            <div className="text-muted">
              Menampilkan {startIndex + 1} sampai {Math.min(endIndex, data.length)} dari {data.length} entri
            </div>

            <nav>
              <ul className="pagination pagination-sm mb-0">

                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={() => setCurrentPage(currentPage - 1)}>
                    Sebelumnya
                  </button>
                </li>

                {[...Array(totalPages)].map((_, index) => (
                  <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                    <button className="page-link" onClick={() => setCurrentPage(index + 1)}>
                      {index + 1}
                    </button>
                  </li>
                ))}

                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={() => setCurrentPage(currentPage + 1)}>
                    Berikutnya
                  </button>
                </li>

              </ul>
            </nav>

          </div>
        )}

      </div>

    </DashboardLayout>

  )
}