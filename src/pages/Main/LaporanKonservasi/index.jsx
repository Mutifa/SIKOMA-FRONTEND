import React from 'react'
import { Link } from 'react-router-dom'

import DashboardLayout from '../../../layouts/DashboardLayout.jsx'
import api from '../../../lib/api.js'
import { laporanKonservasiService } from '../../../services/laporanKonservasi'
import { useAuth } from '../../../contexts/AuthContext'

// ── Badge status — tetap pakai inline style karena ini data-driven, bukan UI button ──
const badgePending  = { background: '#FAEEDA', color: '#854F0B', padding: '3px 10px', borderRadius: '999px', fontSize: '11px', fontWeight: '600', display: 'inline-block', whiteSpace: 'nowrap' }
const badgeApproved = { background: '#EAF3DE', color: '#3B6D11', padding: '3px 10px', borderRadius: '999px', fontSize: '11px', fontWeight: '600', display: 'inline-block', whiteSpace: 'nowrap' }
const badgeRejected = { background: '#FCEBEB', color: '#A32D2D', padding: '3px 10px', borderRadius: '999px', fontSize: '11px', fontWeight: '600', display: 'inline-block', whiteSpace: 'nowrap' }

// ── Style tabel — dipertahankan karena tabel custom ──
const th = { padding: '10px 14px', textAlign: 'left', fontSize: '11px', fontWeight: '600', color: '#888', textTransform: 'uppercase', letterSpacing: '0.06em', borderBottom: '1px solid #efefef' }
const td = { padding: '13px 14px', color: '#1a1a1a', borderBottom: '1px solid #f5f5f5', verticalAlign: 'middle' }
const tdMuted = { ...td, color: '#aaa', fontSize: '13px' }
const trRejected = { background: '#fff8f8' }

const rejectReasonInline = { marginTop: '6px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '6px', padding: '6px 10px', fontSize: '12px', color: '#7f1d1d', lineHeight: '1.5', maxWidth: '320px' }
const rejectReasonLabel  = { fontWeight: '700', color: '#b91c1c', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '3px' }
const alasanHint         = { display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#b91c1c', marginTop: '4px', fontStyle: 'italic' }

export default function LaporanKonservasi() {

  const [data, setData] = React.useState({ laporan: [], daerah: [] })
  const [error, setError] = React.useState('')
  const [loading, setLoading] = React.useState(true)

  const { user } = useAuth()
  const isAdminPusat   = user?.role === 'admin_pusat'
  const isAdminLapangan = user?.role === 'admin_lapangan'

  const loadData = async () => {
    const res = await laporanKonservasiService.getAll()
    const laporanData =
      res.data?.laporan?.data ||
      res.data?.laporan ||
      res.data?.data ||
      []
    setData({ laporan: Array.isArray(laporanData) ? laporanData : [], daerah: [] })
  }

  React.useEffect(() => {
    let mounted = true
    laporanKonservasiService.getAll()
      .then(res => {
        if (mounted) {
          const laporanData =
            res.data?.laporan?.data ||
            res.data?.laporan ||
            res.data?.data ||
            []
          setData({ laporan: Array.isArray(laporanData) ? laporanData : [], daerah: [] })
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
    if (window.confirm('Apakah Anda yakin ingin menghapus laporan ini?')) {
      try {
        await api.delete(`/laporan-konservasi/${id}`)
        await loadData()
      } catch (err) {
        setError(err.response?.data?.message || 'Gagal menghapus laporan')
      }
    }
  }

  const handleUpdateStatus = async (id, status) => {
    try {
      let payload = { status }
      if (status === 2) {
        const alasan = prompt('Masukkan alasan penolakan')
        if (!alasan) return
        payload.alasan = alasan
      }
      await api.put(`/laporan-konservasi/${id}/status`, payload)
      await loadData()
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal update status')
    }
  }

  const getStatusBadge = (status) => {
    if (status === 0) return <span style={badgePending}>Pending</span>
    if (status === 1) return <span style={badgeApproved}>Disetujui</span>
    if (status === 2) return <span style={badgeRejected}>Ditolak</span>
    return <span style={badgePending}>-</span>
  }

  if (loading) {
    return (
      <DashboardLayout title="Laporan Konservasi">
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
          <div className="spinner-border"></div>
        </div>
      </DashboardLayout>
    )
  }

  return (

    <DashboardLayout title="Laporan Konservasi">

      {error && (
        <div className="alert alert-danger">
          <i className="fas fa-circle-exclamation me-2"></i>
          {error}
        </div>
      )}

      {/* Tombol Tambah — hanya Admin Lapangan, btn-primary-custom */}
      {isAdminLapangan && (
        <div className="d-flex justify-content-end mb-3">
          <Link to="/laporan-konservasi/create" className="btn-primary-custom">
            <i className="fas fa-plus"></i>
            Tambah Laporan
          </Link>
        </div>
      )}

      <div className="white-box">

        <div className="box-title mb-3">Semua Laporan</div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px', minWidth: '560px' }}>
            <thead>
              <tr>
                <th style={{ ...th, width: '48px' }}>No</th>
                <th style={th}>Judul</th>
                <th style={th}>Jenis Laporan</th>
                <th style={th}>Tanggal</th>
                <th style={th}>Status</th>
                <th style={{ ...th, width: '140px' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>

              {data.laporan.length === 0 ? (
                <tr>
                  <td colSpan="6">
                    <div style={{ textAlign: 'center', padding: '40px 0', color: '#bbb', fontSize: '14px' }}>
                      <div style={{ fontSize: '32px', marginBottom: '8px' }}>📋</div>
                      <div>Belum ada laporan konservasi</div>
                    </div>
                  </td>
                </tr>
              ) : (
                data.laporan.map((item, index) => (
                  <tr key={item.id} style={item.status === 2 ? trRejected : {}}>

                    <td style={tdMuted}>{index + 1}.</td>

                    <td style={{ ...td, fontWeight: '500' }}>
                      <div>{item.judulLaporan || item.judul_laporan || 'N/A'}</div>
                      {item.status === 2 && (
                        item.alasan ? (
                          <div style={rejectReasonInline}>
                            <div style={rejectReasonLabel}>
                              <i className="fas fa-times-circle" style={{ fontSize: '10px' }}></i>
                              Alasan Penolakan
                            </div>
                            <div>
                              {item.alasan.length > 100 ? item.alasan.substring(0, 100) + '...' : item.alasan}
                            </div>
                            <div style={{ marginTop: '4px', fontSize: '11px', color: '#b91c1c', fontStyle: 'italic' }}>
                              Lihat Detail untuk informasi lengkap
                            </div>
                          </div>
                        ) : (
                          <div style={alasanHint}>
                            <i className="fas fa-circle-exclamation" style={{ fontSize: '10px' }}></i>
                            Laporan ditolak — lihat Detail
                          </div>
                        )
                      )}
                    </td>

                    <td style={td}>{item.jenisKegiatan || item.jenis_kegiatan || 'N/A'}</td>

                    <td style={{ ...td, color: '#555', fontSize: '13px' }}>
                      {item.created_at
                        ? new Date(item.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' })
                        : 'N/A'}
                    </td>

                    <td style={td}>{getStatusBadge(item.status)}</td>

                    <td style={td}>
                      <div className="d-flex gap-1">

                        {/* Detail — semua role, btn-primary-custom */}
                        <Link
                          to={`/laporan-konservasi/detail/${item.id}`}
                          className="btn-primary-custom btn-sm"
                          title="Detail"
                        >
                          <i className="fas fa-eye"></i>
                        </Link>

                        {/* Setujui & Tolak — hanya Admin Pusat, status pending */}
                        {isAdminPusat && item.status === 0 && (
                          <>
                            <button
                              className="btn-primary-custom btn-sm"
                              onClick={() => handleUpdateStatus(item.id, 1)}
                              title="Setujui"
                            >
                              <i className="fas fa-check"></i>
                            </button>

                            <button
                              className="btn-danger-custom btn-sm"
                              onClick={() => handleUpdateStatus(item.id, 2)}
                              title="Tolak"
                            >
                              <i className="fas fa-times"></i>
                            </button>
                          </>
                        )}

                        {/* Edit & Hapus — hanya Admin Lapangan, bukan disetujui */}
                        {isAdminLapangan && item.status !== 1 && (
                          <>
                            <Link
                              to={`/laporan-konservasi/edit/${item.id}`}
                              className="btn-warning-custom btn-sm"
                              title="Edit"
                            >
                              <i className="fas fa-pen"></i>
                            </Link>

                            <button
                              className="btn-danger-custom btn-sm"
                              onClick={() => handleDelete(item.id)}
                              title="Hapus"
                            >
                              <i className="fas fa-trash"></i>
                            </button>
                          </>
                        )}

                      </div>
                    </td>

                  </tr>
                ))
              )}

            </tbody>
          </table>
        </div>

      </div>

    </DashboardLayout>

  )
}