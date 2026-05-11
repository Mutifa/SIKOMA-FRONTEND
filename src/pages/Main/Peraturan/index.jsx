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
    if (window.confirm('Apakah Anda yakin ingin menghapus peraturan ini?')) {
      try {
        await api.delete(`/admin_pusat/peraturan/${id}`)
        setData(data.filter(item => item.id !== id))
      } catch (err) {
        setError(err.response?.data?.message || 'Gagal menghapus peraturan')
      }
    }
  }

  if (loading) {
    return (
      <DashboardLayout title="Peraturan">
        <div className="d-flex justify-content-center">
          <div className="spinner-border"></div>
        </div>
      </DashboardLayout>
    )
  }

  return (

    <DashboardLayout title="Peraturan">

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row">
        <div className="col-12">

          {/* Header */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div className="box-title mb-0">Manajemen halaman peraturan</div>

            {/* Tombol Tambah — btn-primary-custom */}
            <Link to="/peraturan/create" className="btn-primary-custom">
              <i className="fas fa-plus"></i>
              Tambah Peraturan
            </Link>
          </div>

          {/* Table */}
          <div className="white-box p-0 overflow-hidden">
            <div className="table-responsive">
              <table className="table mb-0">
                <thead>
                  <tr>
                    <th className="ps-3">No</th>
                    <th>Nama</th>
                    <th>Deskripsi</th>
                    <th>Tahun / Nomor</th>
                    <th className="text-center pe-3">Aksi</th>
                  </tr>
                </thead>
                <tbody>

                  {data.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center py-5 text-muted">
                        Belum ada peraturan
                      </td>
                    </tr>
                  ) : (
                    data.map((item, index) => (
                      <tr key={item.id} className="align-middle">

                        <td className="ps-3">{index + 1}</td>
                        <td>{item.nama}</td>
                        <td>{item.deskripsi || '-'}</td>

                        <td>
                          {item.tahun || item.nomor ? (
                            <span className="badge bg-secondary">
                              {item.tahun}
                              {item.tahun && item.nomor ? ' / ' : ''}
                              {item.nomor}
                            </span>
                          ) : '-'}
                        </td>

                        <td className="text-center pe-3">
                          <div className="d-flex gap-1 justify-content-center">

                            {/* Detail — btn-primary-custom */}
                            <Link
                              to={`/peraturan/detail/${item.id}`}
                              className="btn-primary-custom btn-sm"
                              title="Detail"
                            >
                              <i className="fas fa-eye"></i>
                            </Link>

                            {/* Edit — btn-warning-custom */}
                            <Link
                              to={`/peraturan/edit/${item.id}`}
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