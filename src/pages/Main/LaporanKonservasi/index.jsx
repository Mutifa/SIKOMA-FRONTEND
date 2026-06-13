import React from 'react'
import { Link } from 'react-router-dom'
import DashboardLayout from '../../../layouts/DashboardLayout.jsx'
import '../../../assets/css/LaporanKonservasi.css'
import { laporanKonservasiService } from '../../../services/laporanKonservasi'
import { useAuth } from '../../../contexts/AuthContext'
import {
  confirmDelete,
  successAlert,
  errorAlert,
  rejectionReasonAlert
}
 from '../../../utils/alert'

export default function LaporanKonservasi() {

  // ── State ────────────────────────────────────────────────────────────────
  const [data,    setData]    = React.useState({ laporan: [], daerah: [] })
  const [error,   setError]   = React.useState('')
  const [loading, setLoading] = React.useState(true)
  const [searchTerm, setSearchTerm] = React.useState('')

  // ── Auth: cek role user ─────────────────────────────────────────────────
  const { user } = useAuth()

  /*
   * Cek role dengan exact match string.
   * Catatan: di detail.jsx pakai .trim().toLowerCase() untuk toleransi spasi.
   * Sesuaikan dengan format role yang dikembalikan backend.
   */
  const isAdminPusat    = user?.role === 'admin_pusat'
  const isAdminLapangan = user?.role === 'admin_lapangan'

  // ── Fetch semua laporan ─────────────────────────────────────────────────

const loadData = async () => {
  try {
    // Meminta semua data laporan dari backend
    const res =
      await laporanKonservasiService.getAll() // backend mengambil: semua laporan -- index()

    /*
      Struktur response backend bisa berbeda-beda.
      Maka dibuat fallback agar tetap aman.
    */
    const laporanData =
      res.data?.laporan?.data ||
      res.data?.laporan ||
      res.data?.data ||
      []

    // Simpan data laporan ke state React
    setData({
      laporan: Array.isArray(laporanData)
        ? laporanData
        : [],
      daerah: []
    })

  } catch (err) {

    // Menampilkan error jika request gagal
    setError(
      err.response?.data?.message ||
      'Gagal memuat data'
    )

  } finally {

    // Matikan loading setelah proses selesai
    setLoading(false)

  }

}

// ======================================================
// LOAD DATA SAAT HALAMAN PERTAMA DIBUKA
// ======================================================
React.useEffect(() => {
  loadData()   //Ambil semua laporan
}, [])


  // ── Hapus laporan ────────────────────────────────────────────────────────
  const handleDelete = async (id) => {
    /* Tampilkan dialog konfirmasi SweetAlert sebelum menghapus */
    const result = await confirmDelete('Hapus Laporan?', 'Laporan akan dihapus permanen')

    if (result.isConfirmed) {
      try {
        await laporanKonservasiService.delete(id) // backend menghapus laporan -- destroy($id)
        await successAlert('Berhasil', 'Laporan berhasil dihapus')
        await loadData()   // Refresh tabel setelah hapus
      } catch (err) {
        await errorAlert('Gagal', err.response?.data?.message || 'Gagal menghapus laporan')
      }
    }
  }

  // ── Update status laporan (Admin Pusat) ──────────────────────────────────
  const handleUpdateStatus = async (id, status) => {
    try {
      let payload = { status }

      if (status === 2) {
        /*
         * Status 2 = ditolak → tampilkan dialog isi alasan via SweetAlert.
         * Jika user cancel, proses dihentikan.
         */
        const result = await rejectionReasonAlert()
        if (!result.isConfirmed) return
        payload.alasan = result.value
      }

      await laporanKonservasiService.validasi(id, payload) // backend update status laporan -- validasi($id) atau updateStatus($id)
      await loadData()   // Refresh tabel setelah update status
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal update status')
    }
  }

  const getStatusText = (status) => {
    const map = {
      0: 'Pending',
      1: 'Disetujui',
      2: 'Ditolak',
    }
    return map[status] ?? '-'
  }

const bulanIndo = ["Januari","Februari","Maret","April","Mei","Juni",
  "Juli","Agustus","September","Oktober","November","Desember"]

const formatDate = (date) => {
  if (!date) return 'N/A'
  const d = new Date(date)
  return `${String(d.getDate()).padStart(2,'0')} ${bulanIndo[d.getMonth()]} ${d.getFullYear()}`
}

  const filteredLaporan = React.useMemo(() => {
    if (!isAdminPusat) return data.laporan

    const keyword = searchTerm.trim().toLowerCase()
    if (!keyword) return data.laporan

    return data.laporan.filter(item => {
      const searchableText = [
        item.judulLaporan,
        item.judul_laporan,
        item.jenisKegiatan,
        item.jenis_kegiatan,
        item.daerahLokasi,
        item.daerah_lokasi,
        item.kabupaten,
        item.kecamatan,
        item.alasan,
        getStatusText(item.status),
        formatDate(item.created_at)
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()

      return searchableText.includes(keyword)
    })
  }, [data.laporan, isAdminPusat, searchTerm])

  /**
   * getStatusBadge — Render badge status laporan
   * Menggunakan class .lk-badge + modifier dari LaporanKonservasi.css
   * @param {number} status — 0: pending | 1: disetujui | 2: ditolak
   */
  const getStatusBadge = (status) => {
    const map = {
      0: ['lk-badge--pending',  'Pending'],
      1: ['lk-badge--approved', 'Disetujui'],
      2: ['lk-badge--rejected', 'Ditolak'],
    }
    const [cls, label] = map[status] ?? ['lk-badge--pending', '-']
    return <span className={`lk-badge ${cls}`}>{label}</span>
  }

  // ── Loading spinner ──────────────────────────────────────────────────────
  if (loading) {
    return (
      <DashboardLayout title="Laporan Konservasi">
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
          <div className="spinner-border"></div>
        </div>
      </DashboardLayout>
    )
  }

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <DashboardLayout title="Laporan Konservasi">

      {/* Pesan error jika fetch gagal */}
      {error && (
        <div className="alert alert-danger">
          <i className="fas fa-circle-exclamation me-2"></i>
          {error}
        </div>
      )}

      {/* Tombol Tambah — hanya tampil untuk Admin Lapangan */}
      {/* White box / card tabel */}
      <div className="white-box">
        {isAdminLapangan && (
          <div className="admin-card-toolbar">
            <Link to="/laporan-konservasi/create" className="btn-primary-custom">
              <i className="fas fa-plus"></i>
              Tambah Laporan
            </Link>
          </div>
        )}

        {isAdminPusat && (
          <div className="row mb-3">
            <div className="col-md-6 ms-auto">
              <div className="d-flex justify-content-end align-items-center">
                <label className="me-2">Cari:</label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  style={{ maxWidth: '260px' }}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Cari laporan..."
                />
              </div>
            </div>
          </div>
        )}

        {/* Wrapper overflow agar tabel bisa di-scroll horizontal di mobile */}
        <div style={{ overflowX: 'auto' }}>
          <table className="lk-table">
            <thead>
              <tr>
                <th style={{ width: '48px' }}>No</th>
                <th>Judul</th>
                <th>Jenis Laporan</th>
                <th>Tanggal</th>
                <th>Status</th>
                <th style={{ width: '140px' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>

              {/* ── Kosong state ── */}
              {filteredLaporan.length === 0 ? (
                <tr>
                  <td colSpan="6">
                    <div className="empty-state">
                      <i className="fas fa-file-lines"></i>
                      <p className="empty-state__title">
                        {isAdminPusat && searchTerm.trim() ? 'Laporan tidak ditemukan' : 'Belum ada laporan konservasi'}
                      </p>
                      <p className="empty-state__text">
                        {isAdminPusat && searchTerm.trim() ? 'Coba gunakan kata kunci lain.' : 'Laporan konservasi akan tampil di sini.'}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredLaporan.map((item, index) => (
                  /*
                   * Row berwarna merah muda jika laporan ditolak.
                   * Class .lk-row-rejected dari LaporanKonservasi.css
                   */
                  <tr key={item.id} className={item.status === 2 ? 'lk-row-rejected' : ''}>

                    {/* Nomor urut — pakai .lk-td-muted (abu, lebih kecil) */}
                    <td className="lk-td-muted">{index + 1}.</td>

                    {/* Judul + box alasan penolakan jika status ditolak */}
                    <td style={{ fontWeight: '500' }}>
                      <div>{item.judulLaporan || item.judul_laporan || 'N/A'}</div>

                      {item.status === 2 && (
                        item.alasan ? (
                          /* Box kecil alasan penolakan — class .lk-reject-inline */
                          <div className="lk-reject-inline">
                            <div className="lk-reject-inline__label">
                              <i className="fas fa-times-circle" style={{ fontSize: '10px' }}></i>
                              Alasan Penolakan
                            </div>
                            <div>
                              {/* Truncate teks panjang agar tabel tidak jebol */}
                              {item.alasan.length > 100
                                ? item.alasan.substring(0, 100) + '...'
                                : item.alasan}
                            </div>
                            <div style={{ marginTop: '4px', fontSize: '11px', color: '#b91c1c', fontStyle: 'italic' }}>
                              Lihat Detail untuk informasi lengkap
                            </div>
                          </div>
                        ) : (
                          /* Hint jika alasan belum diisi */
                          <div className="lk-reject-hint">
                            <i className="fas fa-circle-exclamation" style={{ fontSize: '10px' }}></i>
                            Laporan ditolak — lihat Detail
                          </div>
                        )
                      )}
                    </td>

                    <td>{item.jenisKegiatan || item.jenis_kegiatan || 'N/A'}</td>

                    {/* Tanggal dibuat — format lokal Indonesia */}
                    <td style={{ color: '#555', fontSize: '13px' }}>
                      {formatDate(item.created_at)}
                    </td>

                    {/* Badge status */}
                    <td>{getStatusBadge(item.status)}</td>

                    {/* Tombol aksi */}
                    <td>
                      <div className="d-flex gap-1">

                        {/* ── Detail — semua role bisa melihat ── */}
                        <Link
                          to={`/laporan-konservasi/detail/${item.id}`}
                          className="btn-primary-custom btn-sm"
                          title="Detail"
                        >
                          <i className="fas fa-eye"></i>
                        </Link>

                        {/* ── Setujui & Tolak — hanya Admin Pusat, hanya status pending ── */}
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

                        {/* ── Edit & Hapus — hanya Admin Lapangan, bukan laporan disetujui ── */}
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
                              onClick={() => handleDelete(item.id)} //Hapus laporan -- destroy($id)
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
