import React from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import SuperadminLayout from '../../layouts/SuperadminLayout.jsx'
import api from '../../lib/api.js'

export default function LaporanDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [laporan, setLaporan] = React.useState(null)
  const [error, setError] = React.useState('')
  const [loading, setLoading] = React.useState(true)
  const [processing, setProcessing] = React.useState(false)

  React.useEffect(() => {
    let mounted = true
    const fetchLaporan = async () => {
      try {
        const res = await api.get(`/api/superadmin/laporan-konservasi/${id}`)
        if (mounted) {
          setLaporan(res.data.data || res.data)
          setLoading(false)
        }
      } catch (err) {
        if (mounted) {
          setError(err.response?.data?.message || 'Gagal memuat detail laporan')
          setLoading(false)
        }
      }
    }

    fetchLaporan()
    return () => { mounted = false }
  }, [id])

  const handleStatusUpdate = async (status) => {
    if (!window.confirm(`Apakah Anda yakin ingin ${status === 1 ? 'menyetujui' : 'menolak'} laporan ini?`)) {
      return
    }

    setProcessing(true)
    try {
      await api.put(`/api/superadmin/laporan-konservasi/${id}/status`, { status })
      // Refresh the data
      const res = await api.get(`/api/superadmin/laporan-konservasi/${id}`)
      setLaporan(res.data.data || res.data)
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal memperbarui status laporan')
    } finally {
      setProcessing(false)
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const isPdfFile = (filename) => {
    return filename && filename.toLowerCase().endsWith('.pdf')
  }

  const renderFile = (file, alt) => {
    if (!file) return <span className="text-muted">Tidak ada file</span>
    
    if (isPdfFile(file)) {
      return (
        <a 
          href={`/uploads/laporan/${file}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-outline-primary btn-sm"
        >
          Lihat {alt} (PDF)
        </a>
      )
    } else {
      return (
        <img 
          src={`/uploads/laporan/${file}`}
          alt={alt}
          className="img-fluid"
          style={{ maxWidth: '100px', maxHeight: '100px' }}
          onError={(e) => {
            e.target.style.display = 'none'
            const fallback = e.target.parentNode.querySelector('.fallback-text')
            if (fallback) fallback.style.display = 'block'
          }}
        />
      )
    }
  }

  if (loading) {
    return (
      <SuperadminLayout title="Detail Laporan Konservasi">
        <div className="d-flex justify-content-center">
          <div className="spinner-border" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      </SuperadminLayout>
    )
  }

  if (error) {
    return (
      <SuperadminLayout title="Detail Laporan Konservasi">
        <div className="alert alert-danger">
          {error}
        </div>
        <Link to="/superadmin/laporan" className="btn btn-secondary">
          <i className="fas fa-arrow-left"></i> Kembali
        </Link>
      </SuperadminLayout>
    )
  }

  if (!laporan) {
    return (
      <SuperadminLayout title="Detail Laporan Konservasi">
        <div className="alert alert-warning">
          Laporan tidak ditemukan
        </div>
        <Link to="/superadmin/laporan" className="btn btn-secondary">
          <i className="fas fa-arrow-left"></i> Kembali
        </Link>
      </SuperadminLayout>
    )
  }

  return (
    <SuperadminLayout title="Detail Laporan Konservasi">
      {error && <div className="alert alert-danger alert-dismissible fade show" role="alert">
        {error}
        <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>}

      <Link to="/superadmin/laporan" className="btn btn-secondary btn-sm text-white mb-2">
        <i className="fas fa-angles-left"></i> Kembali
      </Link>

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
                    <td>{laporan.judulLaporan}</td>
                    <td>{laporan.jenisKegiatan}</td>
                    <td>{formatDate(laporan.tanggalMulai)}</td>
                    <td>{formatDate(laporan.tanggalSelesai)}</td>
                    <td>{laporan.keterangan || '-'}</td>
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
                    <td>{laporan.daerahLokasi}</td>
                    <td>{laporan.kabupaten}</td>
                    <td>{laporan.kecamatan}</td>
                    <td>
                      <a 
                        href={`https://www.google.com/maps?q=${laporan.latitude},${laporan.longitude}`}
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="btn btn-success text-white"
                      >
                        Lihat Lokasi
                      </a>
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
                    <td>
                      {renderFile(laporan.suratTugas, 'Surat Tugas')}
                    </td>
                    <td>
                      {renderFile(laporan.fotoSebelum, 'Foto Sebelum')}
                    </td>
                    <td>
                      {renderFile(laporan.fotoSetelah, 'Foto Setelah')}
                    </td>
                    <td>{laporan.luasArea} ha</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="text-center mt-4">
              {laporan.status === 0 && (
                <>
                  <button
                    onClick={() => handleStatusUpdate(1)}
                    disabled={processing}
                    className="btn btn-success text-white mx-2 rounded-pill px-4"
                  >
                    {processing ? 'Memproses...' : 'Setujui'}
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(2)}
                    disabled={processing}
                    className="btn btn-danger text-white mx-2 rounded-pill px-4"
                  >
                    {processing ? 'Memproses...' : 'Tolak'}
                  </button>
                </>
              )}

              {laporan.status === 1 && (
                <span className="badge bg-success px-4 py-2 rounded-pill fs-5">
                  Laporan Disetujui
                </span>
              )}

              {laporan.status === 2 && (
                <span className="badge bg-danger px-4 py-2 rounded-pill fs-5">
                  Laporan Ditolak
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </SuperadminLayout>
  )
}
