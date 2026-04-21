import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import AdminLapanganLayout from '../../layouts/AdminLapanganLayout.jsx'
import api from '../../lib/api.js'

export default function LaporanDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [laporan, setLaporan] = React.useState(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState('')

  React.useEffect(() => {
    let mounted = true
    api.get(`/admin_lapangan/laporanKonservasi/${id}`)
      .then(res => {
        if (mounted) {
          console.log('Raw laporan data:', res.data)
          console.log('suratTugas:', res.data.suratTugas)
          console.log('fotoSebelum:', res.data.fotoSebelum)
          console.log('fotoSetelah:', res.data.fotoSetelah)
          setLaporan(res.data)
          setLoading(false)
        }
      })
      .catch(err => {
        if (mounted) {
          setError(err.response?.data?.message || 'Gagal memuat detail laporan')
          setLoading(false)
        }
      })
    return () => { mounted = false }
  }, [id])

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

  if (loading) {
    return (
      <AdminLapanganLayout title="Detail Laporan">
        <div className="d-flex justify-content-center">
          <div className="spinner-border" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      </AdminLapanganLayout>
    )
  }

  if (error) {
    return (
      <AdminLapanganLayout title="Detail Laporan">
        <div className="alert alert-danger">{error}</div>
        <button className="btn btn-secondary" onClick={() => navigate('/admin_lapangan/laporan')}>
          Kembali
        </button>
      </AdminLapanganLayout>
    )
  }

  const getStatusBadgeDetail = (status) => {
    switch (status) {
      case 0:
        return <span className="badge bg-secondary px-4 py-2 rounded-pill fs-5">Laporan Pending</span>
      case 1:
        return <span className="badge bg-success px-4 py-2 rounded-pill fs-5">Laporan Disetujui</span>
      case 2:
        return <span className="badge bg-danger px-4 py-2 rounded-pill fs-5">Laporan Ditolak</span>
      default:
        return <span className="badge bg-secondary px-4 py-2 rounded-pill fs-5">Status Unknown</span>
    }
  }

  const renderMultipleFiles = (filesJson, label) => {
    console.log(`renderMultipleFiles called for ${label}:`, filesJson)
    console.log(`Type of filesJson:`, typeof filesJson)
    console.log(`Raw value:`, JSON.stringify(filesJson))
    
    if (!filesJson) return <span>Tidak ada file</span>
    
    let files = []
    try {
      // Check if it's already an array (sometimes API returns parsed JSON)
      if (Array.isArray(filesJson)) {
        files = filesJson
        console.log(`Already an array for ${label}:`, files)
      } else {
        files = JSON.parse(filesJson)
        console.log(`Parsed JSON for ${label}:`, files)
      }
    } catch (e) {
      // If it's not JSON, treat as single file (backward compatibility)
      console.log(`Not JSON for ${label}, treating as single file:`, filesJson)
      files = [filesJson]
    }
    
    if (!Array.isArray(files) || files.length === 0) {
      console.log(`No files or empty array for ${label}:`, files)
      return <span>Tidak ada file</span>
    }
    
    console.log(`Rendering ${files.length} files for ${label}:`, files)
    
    return (
      <div className="d-flex flex-wrap gap-2">
        {files.map((filename, index) => {
          const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(filename)
          const isPdf = /\.pdf$/i.test(filename)
          
          return (
            <div key={index} className="text-center">
              {isImage ? (
                <div className="border rounded p-2">
                  <img 
                    src={`/uploads/laporan/${filename}`} 
                    alt={`${label} ${index + 1}`}
                    style={{ width: '120px', height: '120px', objectFit: 'cover', cursor: 'pointer' }}
                    className="img-thumbnail mb-1"
                    onClick={() => window.open(`/uploads/laporan/${filename}`, '_blank')}
                  />
                  <br />
                  <small className="text-muted d-block" style={{ fontSize: '10px', wordBreak: 'break-all' }}>
                    {filename.length > 20 ? filename.substring(0, 20) + '...' : filename}
                  </small>
                  <small className="text-primary d-block">#{index + 1}</small>
                </div>
              ) : isPdf ? (
                <div className="border rounded p-2 text-center" style={{ width: '120px' }}>
                  <div className="mb-2">
                    <i className="fas fa-file-pdf fa-3x text-danger"></i>
                  </div>
                  <a 
                    href={`/uploads/laporan/${filename}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn btn-sm btn-outline-danger"
                  >
                    PDF #{index + 1}
                  </a>
                  <small className="text-muted d-block mt-1" style={{ fontSize: '10px', wordBreak: 'break-all' }}>
                    {filename.length > 15 ? filename.substring(0, 15) + '...' : filename}
                  </small>
                </div>
              ) : (
                <div className="border rounded p-2 text-center" style={{ width: '120px' }}>
                  <div className="mb-2">
                    <i className="fas fa-file fa-3x text-secondary"></i>
                  </div>
                  <a 
                    href={`/uploads/laporan/${filename}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn btn-sm btn-outline-secondary"
                  >
                    File #{index + 1}
                  </a>
                  <small className="text-muted d-block mt-1" style={{ fontSize: '10px', wordBreak: 'break-all' }}>
                    {filename.length > 15 ? filename.substring(0, 15) + '...' : filename}
                  </small>
                </div>
              )}
            </div>
          )
        })}
        <div className="w-100 mt-2">
          <small className="text-info">
            <i className="fas fa-info-circle"></i> Total: {files.length} file(s) | Klik gambar untuk memperbesar
          </small>
        </div>
      </div>
    )
  }

  return (
    <AdminLapanganLayout title="Detail Laporan Konservasi">
      <button 
        className="btn btn-secondary btn-sm text-white mb-2"
        onClick={() => navigate('/admin-lapangan/laporan')}
      >
        <i className="fas fa-angles-left"></i> Kembali
      </button>

      <div className="row">
        <div className="col-12">
          <div className="white-box">
            <h4 className="fw-bold">Deskripsi Kegiatan</h4>
            <div className="table-responsive">
              <table className="table table-borderless">
                <thead className="bg-light">
                  <tr>
                    <th>Judul Laporan</th>
                    <th>Jenis Kegiatan</th>
                    <th>Tanggal Kegiatan</th>
                    <th>Tanggal Selesai</th>
                    <th>Keterangan</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="align-middle">
                    <td>{laporan?.judulLaporan || 'N/A'}</td>
                    <td>{laporan?.jenisKegiatan || 'N/A'}</td>
                    <td>{laporan?.tanggalMulai ? formatDate(laporan.tanggalMulai) : 'N/A'}</td>
                    <td>{laporan?.tanggalSelesai ? formatDate(laporan.tanggalSelesai) : 'N/A'}</td>
                    <td>{laporan?.keterangan || 'N/A'}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <br /><br />
            <h4 className="fw-bold">Daerah Kawasan</h4>
            <div className="table-responsive">
              <table className="table table-borderless">
                <thead>
                  <tr>
                    <th>Daerah Lokasi</th>
                    <th>Kabupaten</th>
                    <th>Kecamatan</th>
                    <th>Lokasi</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="align-middle">
                    <td>{laporan?.daerahLokasi || 'N/A'}</td>
                    <td>{laporan?.kabupaten || 'N/A'}</td>
                    <td>{laporan?.kecamatan || 'N/A'}</td>
                    <td>
                      {laporan?.latitude && laporan?.longitude ? (
                        <a 
                          href={`https://www.google.com/maps?q=${laporan.latitude},${laporan.longitude}`}
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="btn btn-success text-white"
                        >
                          Lihat Lokasi
                        </a>
                      ) : 'N/A'}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <br /><br />
            <h4 className="fw-bold">Dokumentasi Kegiatan</h4>
            <div className="table-responsive">
              <table className="table table-borderless">
                <thead>
                  <tr>
                    <th>Surat Tugas</th>
                    <th>Foto Sebelum Kegiatan</th>
                    <th>Foto Setelah Kegiatan</th>
                    <th>Luas Area</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="align-middle">
                    <td>{renderMultipleFiles(laporan?.suratTugas, 'Surat Tugas')}</td>
                    <td>{renderMultipleFiles(laporan?.fotoSebelum, 'Foto Sebelum')}</td>
                    <td>{renderMultipleFiles(laporan?.fotoSetelah, 'Foto Setelah')}</td>
                    <td>{laporan?.luasArea ? `${laporan.luasArea} ha` : 'N/A'}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="text-center mt-4">
              {laporan && getStatusBadgeDetail(laporan.status)}
            </div>
          </div>
        </div>
      </div>
    </AdminLapanganLayout>
  )
}
