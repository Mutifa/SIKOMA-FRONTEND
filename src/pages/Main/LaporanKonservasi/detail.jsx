import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import DashboardLayout from '../../../layouts/DashboardLayout.jsx'
import '../../../assets/css/LaporanKonservasi.css'
import { laporanKonservasiService } from '../../../services/laporanKonservasi'
import { useAuth } from '../../../contexts/AuthContext'
import {
  successAlert,
  errorAlert,
  rejectionReasonAlert
} from '../../../utils/alert'

/* URL base file di server */
const FILE_URL = 'https://codemy.my.id'

/* ── Mapping status angka → label teks ── */
const STATUS_LABEL = {
  0: 'Laporan Pending',
  1: 'Laporan Disetujui',
  2: 'Laporan Ditolak',
}

/* ── Mapping status angka → class badge CSS ── */
const STATUS_BADGE_CLASS = {
  0: 'lk-badge--pending',
  1: 'lk-badge--approved',
  2: 'lk-badge--rejected',
}

export default function LaporanDetail() {
  const { id } = useParams()
  const navigate = useNavigate()

  // ── Auth: cek role user yang sedang login ────────────────────────────────
  const { user } = useAuth()
  const role = user?.role?.trim()?.toLowerCase()

  /*
   * isAdminPusat: berhak menyetujui/menolak laporan
   * isAdminLapangan: hanya bisa lihat & submit laporan
   */
  const isAdminPusat = role === 'admin_pusat' || role === 'super_admin'
  const isAdminLapangan = role === 'admin_lapangan'

  // ── State ────────────────────────────────────────────────────────────────
  const [laporan, setLaporan] = React.useState(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState('')

  // ── Fetch detail laporan ─────────────────────────────────────────────────
  React.useEffect(() => {
    let mounted = true

    laporanKonservasiService.getById(id) // backend mengambil: detail 1 laporan -- show($id)
      .then(res => {
        if (!mounted) return
        const laporanData = res.data?.data || res.data
        setLaporan(laporanData)
        setLoading(false)

        // Auto-dismiss notifikasi jika Admin Lapangan membuka laporan yang ditolak
        if (isAdminLapangan && laporanData?.status === 2) {
          const dismissedList = JSON.parse(localStorage.getItem('dismissedLaporanDitolak') || '[]')
          if (!dismissedList.includes(laporanData.id)) {
            dismissedList.push(laporanData.id)
            localStorage.setItem('dismissedLaporanDitolak', JSON.stringify(dismissedList))
          }
        }
      })
      .catch(err => {
        if (!mounted) return
        setError(err.response?.data?.message || 'Gagal memuat detail laporan')
        setLoading(false)
      })

    return () => { mounted = false }
  }, [id, isAdminLapangan])

  // ── Update status laporan (Admin Pusat) ──────────────────────────────────
  const handleUpdateStatus = async (laporanId, status) => { //Setujui/tolak laporan -- validasi($id)/updateStatus($id)
    try {
      let payload = { status }

      if (status === 2) {
        /*
         * Status 2 = ditolak → wajib isi alasan.
         * TODO: Ganti prompt() dengan modal SweetAlert agar UX lebih baik.
         */
        const result = await rejectionReasonAlert()
          if (!result.isConfirmed) return
      payload.alasan = result.value
    }

      await laporanKonservasiService.validasi(laporanId, payload)
      window.location.reload()
    } catch (err) {
      console.error('Gagal update status:', err)
    }
  }

  // ── Format tanggal → DD-MM-YYYY ─────────────────────────────────────────
 const bulanIndo = ["Januari","Februari","Maret","April","Mei","Juni",
  "Juli","Agustus","September","Oktober","November","Desember"]

const formatDate = (dateString) => {
  if (!dateString) return null
  const d = new Date(dateString)
  return `${String(d.getDate()).padStart(2, '0')} ${bulanIndo[d.getMonth()]} ${d.getFullYear()}`
}

  /**
   * renderMultipleFiles — Render daftar file (gambar / PDF / lainnya)
   * @param {string|Array} filesJson  — data file dari backend (JSON string atau array)
   * @param {string}       label      — label untuk alt text gambar
   *
   * Gambar  → ditampilkan sebagai thumbnail grid, klik untuk buka di tab baru
   * PDF     → ditampilkan sebagai baris file dengan ikon merah
   * Lainnya → ditampilkan sebagai baris file dengan ikon abu
   */
  const renderMultipleFiles = (filesJson, label) => {
    if (!filesJson) return <span className="lk-field-muted">Tidak ada file</span>

    let files = []
    try {
      files = Array.isArray(filesJson) ? filesJson : JSON.parse(filesJson)
    } catch {
      files = [filesJson]
    }

    if (!Array.isArray(files) || files.length === 0) {
      return <span className="lk-field-muted">Tidak ada file</span>
    }

    const isImage = f => /\.(jpg|jpeg|png|gif|webp)$/i.test(f)
    const isPdf = f => /\.pdf$/i.test(f)

    const images = files.filter(isImage)
    const pdfs = files.filter(isPdf)
    const others = files.filter(f => !isImage(f) && !isPdf(f))

    return (
      <div>

        {/* ── Thumbnail gambar ── */}
        {images.length > 0 && (
          <div className="lk-thumb-grid">
            {images.map((filename, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <img
                  src={`${FILE_URL}/uploads/laporan/${filename}`}
                  alt={`${label} ${i + 1}`}
                  className="lk-img-thumb"
                  width={120}
                  height={90}
                  loading="lazy"
                  decoding="async"
                  onClick={() => window.open(`${FILE_URL}/uploads/laporan/${filename}`, '_blank')}
                />
                <span style={{ fontSize: '11px', color: '#aaa' }}>#{i + 1}</span>
              </div>
            ))}
          </div>
        )}

        {/* ── File PDF ── */}
        {pdfs.map((filename, i) => (
          <a
            key={i}
            href={`${FILE_URL}/uploads/laporan/${filename}`}
            target="_blank"
            rel="noopener noreferrer"
            className="lk-file-item"
          >
            {/* Kotak ikon merah untuk PDF */}
            <div className="lk-file-icon" style={{ background: '#fee2e2' }}>
              <i className="fas fa-file-pdf" style={{ color: '#dc2626', fontSize: '13px' }}></i>
            </div>
            <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {filename.length > 30 ? filename.substring(0, 30) + '...' : filename}
            </span>
            <i className="fas fa-external-link-alt" style={{ fontSize: '11px', color: '#aaa' }}></i>
          </a>
        ))}

        {/* ── File lainnya ── */}
        {others.map((filename, i) => (
          <a
            key={i}
            href={`${FILE_URL}/uploads/laporan/${filename}`}
            target="_blank"
            rel="noopener noreferrer"
            className="lk-file-item"
          >
            {/* Kotak ikon abu untuk file lainnya */}
            <div className="lk-file-icon" style={{ background: '#f0f0f0' }}>
              <i className="fas fa-file" style={{ color: '#888', fontSize: '13px' }}></i>
            </div>
            <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {filename.length > 30 ? filename.substring(0, 30) + '...' : filename}
            </span>
            <i className="fas fa-external-link-alt" style={{ fontSize: '11px', color: '#aaa' }}></i>
          </a>
        ))}

        {/* Total file */}
        <span className="lk-file-count">
          Total: {files.length} file — klik gambar untuk perbesar
        </span>

      </div>
    )
  }

  // ── Loading state ────────────────────────────────────────────────────────
  if (loading) {
    return (
      <DashboardLayout title="Detail Laporan">
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
          <div className="spinner-border text-success" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  // ── Error state ──────────────────────────────────────────────────────────
  if (error) {
    return (
      <DashboardLayout title="Detail Laporan">
        <div className="alert alert-danger" style={{ borderRadius: '10px', fontSize: '14px' }}>{error}</div>
        <button className="lk-btn-back" onClick={() => navigate('/laporan-konservasi')}>
          <i className="fas fa-angles-left" style={{ fontSize: '11px' }}></i> Kembali
        </button>
      </DashboardLayout>
    )
  }

  const statusBadgeClass = STATUS_BADGE_CLASS[laporan?.status] ?? 'lk-badge--pending'
  const statusText = STATUS_LABEL[laporan?.status] ?? 'Status Unknown'

  // ── Warna pill status bawah card (sama dengan badge, tapi lebih besar) ──
  const pillColorMap = {
    0: { background: '#FAEEDA', color: '#854F0B' },
    1: { background: '#EAF3DE', color: '#3B6D11' },
    2: { background: '#FCEBEB', color: '#A32D2D' },
  }
  const pillStyle = pillColorMap[laporan?.status] ?? { background: '#f0f0f0', color: '#888' }

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <DashboardLayout title="Detail Laporan Konservasi">

      {/* Tombol Kembali */}
      <button className="lk-btn-back" onClick={() => navigate('/laporan-konservasi')}>
        <i className="fas fa-angles-left" style={{ fontSize: '11px' }}></i> Kembali
      </button>

      {/* ══════════════════════════════════════════
          BANNER PENOLAKAN
          Muncul paling atas jika status laporan = 2 (ditolak)
          ══════════════════════════════════════════ */}
      {laporan?.status === 2 && (
        <div className="lk-reject-box">
          <div className="lk-reject-box__header">
            {/* Lingkaran ikon silang */}
            <div className="lk-reject-box__icon">
              <i className="fas fa-times-circle" style={{ color: '#b91c1c', fontSize: '16px' }}></i>
            </div>
            <div>
              <div className="lk-reject-box__title">Laporan Ditolak</div>
              <div className="lk-reject-box__sub">
                Admin Pusat telah menolak laporan ini
              </div>
            </div>
          </div>

          {laporan?.alasan ? (
            <>
              <div className="lk-reject-box__label">Alasan Penolakan:</div>
              {/* Teks alasan penolakan — white-space: pre-wrap agar baris terjaga */}
              <div className="lk-reject-box__text">{laporan.alasan}</div>
              <div className="lk-reject-box__note">
                <i className="fas fa-info-circle"></i>
                Silakan perbaiki laporan sesuai alasan di atas, lalu kirim ulang.
              </div>
            </>
          ) : (
            <div className="lk-field-muted">Admin Pusat belum memberikan alasan penolakan.</div>
          )}
        </div>
      )}

      {/* ══════════════════════════════════════════
          CARD DETAIL UTAMA
          ══════════════════════════════════════════ */}
      <div className="lk-card">

        {/* ── SEKSI: Deskripsi Kegiatan ── */}
        <div className="lk-section-title lk-section-title--dark">
          <span className="lk-section-dot"></span>
          Deskripsi Kegiatan
        </div>

        {/* Grid field: auto-fit min 180px → responsif di semua ukuran layar */}
        <div className="lk-detail-grid">
          <div>
            <div className="lk-field-label">Judul Laporan</div>
            <div className="lk-field-value">
              {laporan?.judulLaporan || <span className="lk-field-muted">N/A</span>}
            </div>
          </div>
          <div>
            <div className="lk-field-label">Jenis Kegiatan</div>
            <div className="lk-field-value">
              {laporan?.jenisKegiatan || <span className="lk-field-muted">N/A</span>}
            </div>
          </div>
          <div>
            <div className="lk-field-label">Tanggal Mulai</div>
            <div className="lk-field-value">
              {laporan?.tanggalMulai
                ? formatDate(laporan.tanggalMulai)
                : <span className="lk-field-muted">N/A</span>}
            </div>
          </div>
          <div>
            <div className="lk-field-label">Tanggal Selesai</div>
            <div className="lk-field-value">
              {laporan?.tanggalSelesai
                ? formatDate(laporan.tanggalSelesai)
                : <span className="lk-field-muted">N/A</span>}
            </div>
          </div>
          {/* Keterangan di-span full row */}
          <div style={{ gridColumn: '1 / -1' }}>
            <div className="lk-field-label">Keterangan</div>
            <div className="lk-field-value">
              {laporan?.keterangan || <span className="lk-field-muted">N/A</span>}
            </div>
          </div>
        </div>

        <hr className="lk-divider" />

        {/* ── SEKSI: Daerah Kawasan ── */}
        <div className="lk-section-title lk-section-title--dark">
          <span className="lk-section-dot"></span>
          Daerah Kawasan
        </div>

        <div className="lk-detail-grid">
          <div>
            <div className="lk-field-label">Daerah Lokasi</div>
            <div className="lk-field-value">
              {laporan?.daerahLokasi || <span className="lk-field-muted">N/A</span>}
            </div>
          </div>
          <div>
            <div className="lk-field-label">Kabupaten</div>
            <div className="lk-field-value">
              {laporan?.kabupaten || <span className="lk-field-muted">N/A</span>}
            </div>
          </div>
          <div>
            <div className="lk-field-label">Kecamatan</div>
            <div className="lk-field-value">
              {laporan?.kecamatan || <span className="lk-field-muted">N/A</span>}
            </div>
          </div>
          <div>
            <div className="lk-field-label">Lokasi GPS</div>
            <div className="lk-field-value">
              {laporan?.latitude && laporan?.longitude ? (
                /* Tombol buka Google Maps di tab baru */
                <a
                  href={`https://www.google.com/maps?q=${laporan.latitude},${laporan.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="lk-btn-map"
                >
                  <i className="fas fa-map-marker-alt" style={{ fontSize: '11px' }}></i>
                  Lihat Lokasi
                </a>
              ) : (
                <span className="lk-field-muted">N/A</span>
              )}
            </div>
          </div>
        </div>

        <hr className="lk-divider" />

        {/* ── SEKSI: Dokumentasi Kegiatan ── */}
        <div className="lk-section-title lk-section-title--dark">
          <span className="lk-section-dot"></span>
          Dokumentasi Kegiatan
        </div>

        <div className="lk-detail-grid">
          <div>
            <div className="lk-field-label">Surat Tugas</div>
            {renderMultipleFiles(laporan?.suratTugas, 'Surat Tugas')}
          </div>
          <div>
            <div className="lk-field-label">Foto Sebelum Kegiatan</div>
            {renderMultipleFiles(laporan?.fotoSebelum, 'Foto Sebelum')}
          </div>
          <div>
            <div className="lk-field-label">Foto Setelah Kegiatan</div>
            {renderMultipleFiles(laporan?.fotoSetelah, 'Foto Setelah')}
          </div>
          <div>
            <div className="lk-field-label">Luas Area</div>
            <div className="lk-field-value">
              {laporan?.luasArea
                ? `${laporan.luasArea} ha`
                : <span className="lk-field-muted">N/A</span>}
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════
            TOMBOL VALIDASI — hanya Admin Pusat, status pending (0)
            ══════════════════════════════════════════ */}
        {isAdminPusat && laporan?.status === 0 && (
          <div className="d-flex gap-2 mt-4">
            <button
              className="btn btn-success"
              onClick={() => handleUpdateStatus(laporan.id, 1)}
            >
              <i className="fas fa-check me-1"></i>
              Setujui
            </button>
            <button
              className="btn btn-danger"
              onClick={() => handleUpdateStatus(laporan.id, 2)}
            >
              <i className="fas fa-times me-1"></i>
              Tolak
            </button>
          </div>
        )}

        {/* ══════════════════════════════════════════
            STATUS PILL — ditampilkan di tengah bawah card
            Ukurannya lebih besar dari badge di tabel
            ══════════════════════════════════════════ */}
        <div className="lk-status-wrap">
          <span className="lk-status-pill" style={pillStyle}>
            {statusText}
          </span>
        </div>

      </div>

    </DashboardLayout>
  )
}
