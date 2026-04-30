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
  const [searchQuery, setSearchQuery] = React.useState('')

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
          const daerahList = [...new Set(data.map(item => item.daerahLokasi))]
          setDaerah(daerahList)
        }
      })
      .catch(err => {
        console.error(err)
      })

    return () => { mounted = false }
  }, [])

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

  // ── Filter berdasarkan search query ──
  const filteredLaporan = laporan.filter(item => {
    if (!searchQuery.trim()) return true
    const q = searchQuery.toLowerCase()
    return (
      (item.user?.name || '').toLowerCase().includes(q) ||
      (item.user?.nama || '').toLowerCase().includes(q) ||
      (item.jenisKegiatan || '').toLowerCase().includes(q) ||
      (item.judulLaporan || '').toLowerCase().includes(q) ||
      (item.daerahLokasi || '').toLowerCase().includes(q)
    )
  })

  const getStatusLabel = (status) => {
    if (status === 0) return <span className="badge bg-warning">Pending</span>
    if (status === 1) return <span className="badge bg-success">Disetujui</span>
    if (status === 2) return <span className="badge bg-danger">Ditolak</span>
    return null
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

            {/* ── Search Bar ── */}
            <div className="d-flex justify-content-end align-items-center mb-3">
              <label className="me-2 mb-0 fw-semibold" style={{ fontSize: '14px', whiteSpace: 'nowrap' }}>Cari:</label>
              <input
                type="text"
                className="form-control"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ maxWidth: '200px', fontSize: '14px' }}
              />
            </div>

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
                  {filteredLaporan.length > 0 ? (
                    filteredLaporan.map((item, index) => (
                      <tr key={item.id} className="align-middle">
                        <td>{index + 1}.</td>
                        <td>{item.user?.name || item.user?.nama || 'N/A'}</td>
                        <td>{item.jenisKegiatan}</td>
                        <td>{formatDate(item.created_at)}</td>
                        <td>{getStatusLabel(item.status)}</td>
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
                      <td colSpan="6" className="text-center text-muted py-4">
                        {searchQuery
                          ? <>Tidak ada laporan yang cocok dengan "<strong>{searchQuery}</strong>"</>
                          : selectedDaerah
                            ? `Tidak ada laporan untuk daerah ${selectedDaerah}`
                            : 'Belum ada laporan konservasi'
                        }
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