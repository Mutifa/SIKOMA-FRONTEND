import React from 'react'
import { Link } from 'react-router-dom'
import AdminLapanganLayout from '../../layouts/AdminLapanganLayout.jsx'
import api from '../../lib/api.js'
import { laporanKonservasiService } from '../../services/laporanKonservasi'

export default function LaporanKonservasi() {
  const [data, setData] = React.useState({
    laporan: [],
    daerah: []
  })
  const [error, setError] = React.useState('')
  const [loading, setLoading] = React.useState(true)
  const [selectedDaerah, setSelectedDaerah] = React.useState('')

 React.useEffect(() => {
  let mounted = true

  laporanKonservasiService.getAll()
    .then(res => {
      if (mounted) {
        console.log('RESPON LAPORAN:', res.data)

        const laporanData =
          res.data?.laporan?.data ||
          res.data?.laporan ||
          res.data?.data ||
          []

        setData({
          laporan: Array.isArray(laporanData) ? laporanData : [],
          daerah: []
        })

        setLoading(false)
      }
    })
    .catch(err => {
      if (mounted) {
        setError(err.response?.data?.message || 'Gagal memuat data')
        setLoading(false)
      }
    })

  return () => {
    mounted = false
  }
}, [])
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()
    return `${day}-${month}-${year}`
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 0:
        return <span className="badge bg-warning">Pending</span>
      case 1:
        return <span className="badge bg-success">Disetujui</span>
      case 2:
        return <span className="badge bg-danger">Ditolak</span>
      default:
        return <span className="badge bg-secondary">Unknown</span>
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus laporan ini?')) {
      try {
        await api.delete(`/admin_lapangan/laporan/${id}`)
        // Refresh data
       const endpoint = selectedDaerah 
  ? `/admin_lapangan/laporan-konservasi?daerah=${selectedDaerah}`
  : `/admin_lapangan/laporan-konservasi`
        const res = await api.get(endpoint)
        setData(res.data)
      } catch (err) {
        setError(err.response?.data?.message || 'Gagal menghapus laporan')
      }
    }
  }

  if (loading) {
    return (
      <AdminLapanganLayout title="Laporan Konservasi">
        <div className="d-flex justify-content-center">
          <div className="spinner-border" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      </AdminLapanganLayout>
    )
  }

  return (
    <AdminLapanganLayout title="Laporan Konservasi">
      {error && <div className="alert alert-danger">{error}</div>}
      
      <div className="row">
        <div className="col-12">
          <Link to="/admin-lapangan/laporan/tambah" className="btn btn-primary btn-sm float-end">
            + Laporan
          </Link>
          <div className="white-box">
            <h3 className="box-title">Laporan Konservasi</h3>
            <div className="table-responsive">
              <table id="dataTables" className="table text-nowrap">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Judul</th>
                    <th>Jenis Laporan</th>
                    <th>Tanggal</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {data.laporan.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center py-4">
                        <p className="text-muted">Belum ada laporan konservasi</p>
                      </td>
                    </tr>
                  ) : (
                    data.laporan.map((item, index) => (
                      <tr key={item.id} className="align-middle">
                        <td>{index + 1}.</td>
                        <td>{item.judulLaporan || 'N/A'}</td>
                        <td>{item.jenisKegiatan || 'N/A'}</td>
                        <td>{item.created_at ? new Date(item.created_at).toLocaleDateString('id-ID', {
                          day: '2-digit',
                          month: '2-digit', 
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit'
                        }) : 'N/A'}</td>
                        <td>
                          <Link 
                            to={`/admin-lapangan/laporan/detail/${item.id}`}
                            className="btn btn-primary btn-sm"
                          >
                            <i className="fas fa-eye"></i> Detail
                          </Link>
                          {' '}
                          <Link 
                            to={`/admin-lapangan/laporan/edit/${item.id}`}
                            className="btn btn-warning btn-sm"
                          >
                            <i className="fas fa-edit"></i>
                          </Link>
                          {' '}
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
    </AdminLapanganLayout>
  )
}
