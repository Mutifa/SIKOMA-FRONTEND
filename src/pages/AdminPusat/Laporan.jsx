import React from 'react'
import { Link } from 'react-router-dom'
import AdminPusatLayout from '../../layouts/AdminPusatLayout.jsx'
import api from '../../lib/api.js'
import { ENDPOINTS } from '../../lib/endpoints'

export default function Laporan() {
  const [laporan, setLaporan] = React.useState([])
  const [error, setError] = React.useState('')
  const [loading, setLoading] = React.useState(true)
  const [selectedDaerah, setSelectedDaerah] = React.useState('')
  const [data, setData] = React.useState([])
  const [daerah, setDaerah] = React.useState([])

  React.useEffect(() => {
    let mounted = true
    const fetchData = async () => {
      try {
        const url = selectedDaerah
          ? `${ENDPOINTS.LAPORAN_ADMIN.GET}?daerah=${selectedDaerah}`
          : ENDPOINTS.LAPORAN_ADMIN.GET

        const res = await api.get(url)
        if (mounted) {
          setLaporan(res.data.data || res.data)
          setLoading(false)
        }
      } catch (err) {
        if (mounted) {
          setError(err.response?.data?.message || 'Gagal memuat data laporan')
          setLoading(false)
        }
      }
    }

    fetchData()
    return () => { mounted = false }
  }, [selectedDaerah])

  React.useEffect(() => {
    let mounted = true

    api.get('/laporan-konservasi')
      .then(res => {
        if (mounted) {
          const data = res.data.data || res.data

          setData(data)

          // ambil daftar daerah unik dari data
          const daerahList = [...new Set(data.map(item => item.daerahLokasi))]

          setDaerah(daerahList)
        }
      })
      .catch(err => {
        console.error(err)
      })

    return () => { mounted = false }
  }, [])

  const handleDaerahFilter = (daerah) => {
    setSelectedDaerah(daerah)
  }

  const clearFilter = () => {
    setSelectedDaerah('')
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <AdminPusatLayout title="Laporan Konservasi">
        <div className="d-flex justify-content-center">
          <div className="spinner-border" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      </AdminPusatLayout>
    )
  }

  return (
    <AdminPusatLayout title="Laporan Konservasi">
      {error && <div className="alert alert-danger alert-dismissible fade show" role="alert">
        {error}
        <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>}

      <div className="row">
        <div className="col-12">
          <div className="white-box">
        
            {/* Filter by Daerah */}
            {daerah.length > 0 && (
              <div className="mb-3">
                <div className="d-flex flex-wrap gap-2 align-items-center">
                  <span className="text-muted">Filter by Daerah:</span>
                  {daerah.map((item, index) => (
                    <button
                      key={index}
                      className={`btn btn-sm ${selectedDaerah === item ? 'btn-primary' : 'btn-outline-primary'}`}
                      onClick={() => handleDaerahFilter(item)}
                    >
                      {item}
                    </button>
                  ))}
                  {selectedDaerah && (
                    <button
                      className="btn btn-sm btn-secondary"
                      onClick={clearFilter}
                    >
                      Clear Filter
                    </button>
                  )}
                </div>
              </div>
            )}

            <div className="table-responsive">
              <table className="table text-nowrap">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Pengirim</th>
                    <th>Jenis Laporan</th>
                    <th>Tanggal</th>
                    <th>Status</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {laporan.length > 0 ? (
                    laporan.map((item, index) => (
                      <tr key={item.id} className="align-middle">
                        <td>{index + 1}.</td>
                        <td>{item.user?.name || item.user?.nama || 'N/A'}</td>
                        <td>{item.jenisKegiatan}</td>
                        <td>{formatDate(item.created_at)}</td>
                        <td>
                          {item.status === 0 && (
                            <span className="badge bg-warning">Pending</span>
                          )}
                          {item.status === 1 && (
                            <span className="badge bg-success">Disetujui</span>
                          )}
                          {item.status === 2 && (
                            <span className="badge bg-danger">Ditolak</span>
                          )}
                        </td>
                        <td>
                          <Link
                            to={`/admin-pusat/laporan/detail/${item.id}`}
                            className="btn btn-primary btn-sm"
                          >
                            <i className="fas fa-eye"></i> Detail
                          </Link>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center text-muted">
                        {selectedDaerah ? `Tidak ada laporan untuk daerah ${selectedDaerah}` : 'Belum ada laporan konservasi'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </AdminPusatLayout>
  )
}
