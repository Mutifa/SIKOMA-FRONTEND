import React from 'react'
import { Link } from 'react-router-dom'

import DashboardLayout from '../../../layouts/DashboardLayout.jsx'
import { kontenService } from '../../../services/kontenService'
import { assetUrl } from '../../../lib/assets.js'
import {
  confirmDelete,
  successAlert,
  errorAlert
} from '../../../utils/alert'

export default function Konten() {

  const [data, setData] = React.useState([])
  const [error, setError] = React.useState('')
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    let mounted = true
    kontenService.getAll()
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

  const handleDelete = async (id) => {
    const result = await confirmDelete()
    if (result.isConfirmed) {
      try {
        await kontenService.delete(id)
        setData(prev => prev.filter(item => item.id !== id))
        await successAlert('Berhasil', 'Konten berhasil dihapus')
      } catch (err) {
        setError(err.response?.data?.message || 'Gagal menghapus konten')
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

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row">
        <div className="col-12">

          {/* Tombol Tambah — btn-primary-custom */}
          <div className="d-flex justify-content-end mb-3">
            <Link to="/konten/create" className="btn-primary-custom">
              <i className="fas fa-plus"></i>
              Tambah Konten
            </Link>
          </div>

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
                      <td colSpan="5" className="text-center">Belum ada konten</td>
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
                          ) : '-'}
                        </td>

                        <td>{item.judul}</td>

                        <td>
                          <div style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                            {stripHtmlTags(item.deskripsi)}
                          </div>
                        </td>

                        <td>
                          <div className="d-flex gap-1">

                            {/* Detail — btn-primary-custom */}
                            <Link
                              to={`/konten/detail/${item.id}`}
                              className="btn-primary-custom btn-sm"
                              title="Detail"
                            >
                              <i className="fas fa-eye"></i>
                            </Link>

                            {/* Edit — btn-warning-custom */}
                            <Link
                              to={`/konten/edit/${item.id}`}
                              className="btn-warning-custom btn-sm"
                              title="Edit"
                            >
                              <i className="fas fa-edit"></i>
                            </Link>

                            {/* Hapus — btn-danger-custom */}
                            <button
                              className="btn-danger-custom btn-sm"
                              onClick={() => handleDelete(item.id)}
                              title="Hapus"
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

          </div>

        </div>
      </div>

    </DashboardLayout>

  )
}