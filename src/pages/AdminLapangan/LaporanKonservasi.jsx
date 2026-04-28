import React from 'react'
import { Link } from 'react-router-dom'
import AdminLapanganLayout from '../../layouts/AdminLapanganLayout.jsx'
import api from '../../lib/api.js'
import { laporanKonservasiService } from '../../services/laporanKonservasi'

const styles = {
  topBar: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: '1.25rem',
    flexWrap: 'wrap',
    gap: '12px',
  },
  pageTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: '2px',
  },
  breadcrumb: {
    fontSize: '13px',
    color: '#888',
  },
  btnAdd: {
    background: '#1a5c35',
    color: '#fff',
    border: 'none',
    padding: '8px 18px',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '500',
    cursor: 'pointer',
    textDecoration: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    whiteSpace: 'nowrap',
  },
  card: {
    background: '#fff',
    border: '1px solid #e8e8e8',
    borderRadius: '12px',
    padding: '1.25rem',
    overflowX: 'auto',
  },
  sectionLabel: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#888',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    marginBottom: '14px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '14px',
    minWidth: '560px',
  },
  th: {
    padding: '10px 14px',
    textAlign: 'left',
    fontSize: '11px',
    fontWeight: '600',
    color: '#888',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    borderBottom: '1px solid #efefef',
  },
  td: {
    padding: '13px 14px',
    color: '#1a1a1a',
    borderBottom: '1px solid #f5f5f5',
    verticalAlign: 'middle',
  },
  tdMuted: {
    padding: '13px 14px',
    color: '#aaa',
    borderBottom: '1px solid #f5f5f5',
    verticalAlign: 'middle',
    fontSize: '13px',
  },
  actionGroup: {
    display: 'flex',
    gap: '6px',
    flexWrap: 'nowrap',
    alignItems: 'center',
  },
  btnDetail: {
    background: '#1a5c35',
    color: '#fff',
    border: 'none',
    padding: '7px 10px',
    borderRadius: '6px',
    fontSize: '13px',
    cursor: 'pointer',
    textDecoration: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '32px',
    height: '32px',
  },
  btnEdit: {
    background: '#f5a623',
    color: '#5a3a00',
    border: 'none',
    padding: '7px 10px',
    borderRadius: '6px',
    fontSize: '13px',
    cursor: 'pointer',
    textDecoration: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '32px',
    height: '32px',
  },
  btnDel: {
    background: '#e24b4a',
    color: '#fff',
    border: 'none',
    padding: '7px 10px',
    borderRadius: '6px',
    fontSize: '13px',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '32px',
    height: '32px',
  },
  emptyState: {
    textAlign: 'center',
    padding: '40px 0',
    color: '#bbb',
    fontSize: '14px',
  },
}

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

  const handleDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus laporan ini?')) {
      try {
        await api.delete(`/laporan-konservasi/${id}`)

        const res = await laporanKonservasiService.getAll()
        const laporanData =
          res.data?.laporan?.data ||
          res.data?.laporan ||
          res.data?.data ||
          []

        setData({
          laporan: Array.isArray(laporanData) ? laporanData : [],
          daerah: []
        })
      } catch (err) {
        setError(err.response?.data?.message || 'Gagal menghapus laporan')
      }
    }
  }

  if (loading) {
    return (
      <AdminLapanganLayout title="Laporan Konservasi">
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
          <div className="spinner-border text-success" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </AdminLapanganLayout>
    )
  }

  return (
    <AdminLapanganLayout title="Laporan Konservasi">
      {error && (
        <div className="alert alert-danger d-flex align-items-center gap-2 mb-3" style={{ borderRadius: '10px', fontSize: '14px' }}>
          <i className="fas fa-circle-exclamation"></i>
          {error}
        </div>
      )}

      {/* ✅ Hanya tombol tambah, title sudah dirender oleh AdminLapanganLayout */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.25rem' }}>
        <Link to="/admin-lapangan/laporan/tambah" style={styles.btnAdd}>
          <i className="fas fa-plus" style={{ fontSize: '11px' }}></i> Laporan
        </Link>
      </div>

      <div style={styles.card}>
        <div style={styles.sectionLabel}>Semua Laporan</div>
        <div style={{ overflowX: 'auto' }}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={{ ...styles.th, width: '48px' }}>No</th>
                <th style={styles.th}>Judul</th>
                <th style={styles.th}>Jenis Laporan</th>
                <th style={styles.th}>Tanggal</th>
                <th style={{ ...styles.th, width: '120px' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {data.laporan.length === 0 ? (
                <tr>
                  <td colSpan="5">
                    <div style={styles.emptyState}>
                      <div style={{ fontSize: '32px', marginBottom: '8px' }}>📋</div>
                      <div>Belum ada laporan konservasi</div>
                    </div>
                  </td>
                </tr>
              ) : (
                data.laporan.map((item, index) => (
                  <tr key={item.id}>
                    <td style={styles.tdMuted}>{index + 1}.</td>
                    <td style={{ ...styles.td, fontWeight: '500' }}>
                      {item.judulLaporan || item.judul_laporan || 'N/A'}
                    </td>
                    <td style={styles.td}>
                      {item.jenisKegiatan || item.jenis_kegiatan || 'N/A'}
                    </td>
                    <td style={{ ...styles.td, color: '#555', fontSize: '13px' }}>
                      {item.created_at
                        ? new Date(item.created_at).toLocaleDateString('id-ID', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit'
                          })
                        : 'N/A'}
                    </td>
                    <td style={styles.td}>
                      {/* ✅ Icon-only buttons */}
                      <div style={styles.actionGroup}>
                        <Link
                          to={`/admin-lapangan/laporan/detail/${item.id}`}
                          style={styles.btnDetail}
                          title="Detail"
                        >
                          <i className="fas fa-eye"></i>
                        </Link>
                        <Link
                          to={`/admin-lapangan/laporan/edit/${item.id}`}
                          style={styles.btnEdit}
                          title="Edit"
                        >
                          <i className="fas fa-pen"></i>
                        </Link>
                        <button
                          style={styles.btnDel}
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
    </AdminLapanganLayout>
  )
}