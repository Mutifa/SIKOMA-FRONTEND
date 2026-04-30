import React from 'react'
import { Link, useParams } from 'react-router-dom'
import AdminPusatLayout from '../../layouts/AdminPusatLayout.jsx'
import api from '../../lib/api.js'
import { ENDPOINTS } from '../../lib/endpoints.js'

// ─── GANTI sesuai base URL backend kamu ───────────────────────────────────────
const BASE_URL = 'https://codemy.my.id'
// Path uploads — sesuaikan jika berbeda di server
const UPLOAD_PATH = `${BASE_URL}/uploads/laporan`
// ─────────────────────────────────────────────────────────────────────────────

const printStyles = `
  @media print {
    @page { size: A4; margin: 15mm 15mm 20mm 15mm; }

    body * { visibility: hidden !important; }
    #pdf-template, #pdf-template * { visibility: visible !important; }

    #pdf-template {
      position: fixed !important;
      inset: 0;
      width: 100%;
      font-family: 'Times New Roman', serif;
      font-size: 11pt;
      color: #000;
      background: #fff;
    }

    .no-print { display: none !important; }

    /* Kop surat */
    .kop-wrapper {
      display: flex;
      align-items: center;
      gap: 16px;
      border-bottom: 3px solid #000;
      padding-bottom: 10px;
      margin-bottom: 6px;
    }
    .kop-logo { width: 70px; height: 70px; object-fit: contain; }
    .kop-text { flex: 1; text-align: center; }
    .kop-text .instansi { font-size: 11pt; font-weight: normal; }
    .kop-text .unit { font-size: 14pt; font-weight: bold; text-transform: uppercase; }
    .kop-text .nama { font-size: 13pt; font-weight: bold; text-transform: uppercase; }
    .kop-text .alamat { font-size: 9pt; margin-top: 2px; }
    .kop-line2 { border-top: 1px solid #000; margin-top: 4px; }

    /* Judul laporan */
    .lap-title-block { text-align: center; margin: 14px 0 10px; }
    .lap-title-block h2 { font-size: 13pt; font-weight: bold; letter-spacing: 1px; margin: 0; }
    .lap-title-block p { margin: 2px 0; font-size: 10pt; }

    /* Tabel isi */
    .lap-table { width: 100%; border-collapse: collapse; margin-bottom: 12px; }
    .lap-table td { border: 1px solid #000; padding: 5px 8px; vertical-align: top; font-size: 10.5pt; }
    .lap-table td.col-no { width: 28px; text-align: center; font-weight: bold; }
    .lap-table td.col-label { width: 120px; font-weight: bold; }
    .lap-table td.col-value { }

    /* Foto dokumentasi */
    .foto-grid { display: flex; gap: 16px; margin-top: 4px; }
    .foto-item { flex: 1; text-align: center; }
    .foto-item img { width: 100%; max-height: 120px; object-fit: cover; border: 1px solid #ccc; }
    .foto-item p { font-size: 9pt; margin: 3px 0 0; font-weight: bold; }

    /* TTD */
    .ttd-row { display: flex; justify-content: space-between; margin-top: 24px; font-size: 10.5pt; }
    .ttd-col { width: 42%; text-align: center; }
    .ttd-col .ttd-line { margin-top: 52px; border-top: 1px solid #000; padding-top: 3px; font-weight: bold; }

    /* Status badge di print */
    .status-print { font-weight: bold; }

    /* Paksa pdf-template tampil saat print */
    #pdf-template { display: block !important; }
    .row.no-print { display: none !important; }
  }

  /* ── Layar (non-print) ── */
  .reject-modal-overlay {
    position: fixed; inset: 0; background: rgba(0,0,0,0.5);
    z-index: 1055; overflow-y: auto; padding: 80px 16px 40px;
  }
  .reject-modal-box {
    background: #fff; border-radius: 8px; width: 100%;
    max-width: 480px; margin: 0 auto; box-shadow: 0 8px 32px rgba(0,0,0,0.2);
  }
  .reject-modal-header {
    background: #b91c1c; padding: 14px 20px; border-radius: 8px 8px 0 0;
    display: flex; align-items: center; justify-content: space-between;
  }
  .reject-modal-header h5 { font-size: 15px; font-weight: 600; color: #fff; margin: 0; }
  .reject-modal-close { background: transparent; border: none; color: #fff; font-size: 22px; cursor: pointer; }
  .reject-modal-body { padding: 20px 24px; }
  .reject-modal-footer { padding: 12px 24px 18px; display: flex; justify-content: flex-end; gap: 10px; }
`

export default function LaporanDetail() {
  const { id } = useParams()
  const [laporan, setLaporan] = React.useState(null)
  const [error, setError] = React.useState('')
  const [loading, setLoading] = React.useState(true)
  const [processing, setProcessing] = React.useState(false)
  const [showRejectModal, setShowRejectModal] = React.useState(false)
  const [alasanTolak, setAlasanTolak] = React.useState('')

  // Nomor laporan auto-generate (bisa diganti dari API)
  const nomorLaporan = `001/LK-KONS/UPT-KPH/TB-SERKAP/V/${new Date().getFullYear()}`

  React.useEffect(() => {
    let mounted = true
    const fetch = async () => {
      try {
        const res = await api.get(`/laporan-konservasi/${id}`)
        const detail = res.data.data || res.data
        if (!detail) throw new Error('Data tidak ditemukan')
        if (mounted) { setLaporan(detail); setLoading(false) }
      } catch (err) {
        if (mounted) { setError(err.response?.data?.message || err.message); setLoading(false) }
      }
    }
    fetch()
    return () => { mounted = false }
  }, [id])

  const handleStatusUpdate = async (status) => {
    setProcessing(true)
    try {
      await api.put(ENDPOINTS.LAPORAN_ADMIN.UPDATE_STATUS(id), { status })
      setLaporan(prev => ({ ...prev, status }))
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal update')
    } finally { setProcessing(false) }
  }

  const handleRejectSubmit = async () => {
    if (!alasanTolak.trim()) return
    setProcessing(true)
    try {
      await api.put(ENDPOINTS.LAPORAN_ADMIN.UPDATE_STATUS(id), { status: 2, alasan: alasanTolak })
      setLaporan(prev => ({ ...prev, status: 2, alasan: alasanTolak }))
      setShowRejectModal(false)
      setAlasanTolak('')
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal menolak')
    } finally { setProcessing(false) }
  }

  // ── Helpers ────────────────────────────────────────────────────────────────
  const formatDate = (ds) => {
    if (!ds) return '-'
    const d = new Date(ds)
    const dd = String(d.getDate()).padStart(2, '0')
    const mm = String(d.getMonth() + 1).padStart(2, '0')
    return `${dd}-${mm}-${d.getFullYear()}`
  }

  const formatDateLong = (ds) => {
    if (!ds) return '-'
    return new Date(ds).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })
  }

  const parseFiles = (val) => {
    if (!val) return []
    try {
      const p = JSON.parse(val)
      return Array.isArray(p) ? p : [p]
    } catch { return [val] }
  }

  // Buat URL file — coba langsung dari nama file
  const fileUrl = (filename) => `${UPLOAD_PATH}/${filename}`

  const isImage = (f) => /\.(jpg|jpeg|png|gif|webp)$/i.test(f)
  const isPdf = (f) => /\.pdf$/i.test(f)

  const getStatusInfo = (s) => {
    if (s === 0) return { text: 'Pending', color: '#854F0B', bg: '#FAEEDA' }
    if (s === 1) return { text: 'Disetujui', color: '#3B6D11', bg: '#EAF3DE' }
    if (s === 2) return { text: 'Ditolak', color: '#A32D2D', bg: '#FCEBEB' }
    return { text: '-', color: '#888', bg: '#f0f0f0' }
  }

  // ── Render file untuk tampilan layar ───────────────────────────────────────
  const renderScreenFiles = (val, label) => {
    const files = parseFiles(val)
    if (!files.length) return <span className="text-muted">-</span>
    return (
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        {files.map((f, i) => {
          const url = fileUrl(f)
          if (isImage(f)) return (
            <div key={i} style={{ textAlign: 'center' }}>
              <img
                src={url}
                alt={`${label} ${i + 1}`}
                crossOrigin="anonymous"
                style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 6, border: '1px solid #ddd', cursor: 'pointer' }}
                onClick={() => window.open(url, '_blank')}
                onError={(e) => {
                  e.target.style.display = 'none'
                  e.target.nextSibling.style.display = 'inline-block'
                }}
              />
              <a href={url} target="_blank" rel="noopener noreferrer"
                style={{ display: 'none', fontSize: 12, color: '#3b82f6' }}>
                📷 {label} #{i + 1}
              </a>
            </div>
          )
          if (isPdf(f)) return (
            <a key={i} href={url} target="_blank" rel="noopener noreferrer"
              className="btn btn-outline-danger btn-sm">
              <i className="fas fa-file-pdf me-1"></i>{label} #{i + 1}
            </a>
          )
          return (
            <a key={i} href={url} target="_blank" rel="noopener noreferrer"
              className="btn btn-outline-secondary btn-sm">
              <i className="fas fa-file me-1"></i>{label} #{i + 1}
            </a>
          )
        })}
      </div>
    )
  }

  // ── Render foto untuk PDF template ────────────────────────────────────────
  const renderPdfPhoto = (val, label) => {
    const files = parseFiles(val)
    const images = files.filter(isImage)
    if (!images.length) return <span>-</span>
    return (
      <div className="foto-item">
        <p>{label}</p>
        <img src={fileUrl(images[0])} alt={label} />
      </div>
    )
  }

  // ── Loading / Error states ─────────────────────────────────────────────────
  if (loading) return (
    <AdminPusatLayout title="Detail Laporan Konservasi">
      <div className="d-flex justify-content-center py-5">
        <div className="spinner-border text-success" role="status" />
      </div>
    </AdminPusatLayout>
  )

  if (error && !laporan) return (
    <AdminPusatLayout title="Detail Laporan Konservasi">
      <div className="alert alert-danger">{error}</div>
      <Link to="/admin-pusat/laporan" className="btn btn-secondary">← Kembali</Link>
    </AdminPusatLayout>
  )

  if (!laporan) return (
    <AdminPusatLayout title="Detail Laporan Konservasi">
      <div className="alert alert-warning">Laporan tidak ditemukan</div>
      <Link to="/admin-pusat/laporan" className="btn btn-secondary">Kembali</Link>
    </AdminPusatLayout>
  )

  const statusInfo = getStatusInfo(laporan.status)
  const tanggalCetak = formatDateLong(new Date())
  const suratFiles = parseFiles(laporan.suratTugas)

  return (
    <AdminPusatLayout title="Detail Laporan Konservasi">
      <style>{printStyles}</style>

      {error && (
        <div className="alert alert-danger alert-dismissible fade show no-print">
          {error}
          <button type="button" className="btn-close" data-bs-dismiss="alert" />
        </div>
      )}

      {/* ── Tombol Aksi (layar) ── */}
      <div className="d-flex align-items-center gap-2 mb-3 no-print">
        <Link to="/admin-pusat/laporan" className="btn btn-secondary btn-sm text-white">
          <i className="fas fa-angles-left me-1"></i>Kembali
        </Link>
        <button
          onClick={() => window.print()}
          className="btn btn-sm text-white"
          style={{ background: '#1a5c35' }}
        >
          <i className="fas fa-file-pdf me-1"></i>Download PDF
        </button>
      </div>

      {/* ════════════════════════════════════════════════════════════════
          TAMPILAN LAYAR
      ════════════════════════════════════════════════════════════════ */}
      <div className="row no-print">
        <div className="col-12">
          <div className="white-box">

            {/* Deskripsi Kegiatan */}
            <h4 className="fw-bold" style={{ color: '#1a5c35', borderBottom: '2px solid #e0e0e0', paddingBottom: 8, marginBottom: 16 }}>
              Deskripsi Kegiatan
            </h4>
            <div className="table-responsive">
              <table className="table table-borderless">
                <thead className="bg-light"><tr>
                  <th>Judul Laporan</th><th>Jenis Kegiatan</th>
                  <th>Tanggal Kegiatan</th><th>Tanggal Selesai</th><th>Keterangan</th>
                </tr></thead>
                <tbody><tr className="align-middle">
                  <td>{laporan.judulLaporan || '-'}</td>
                  <td>{laporan.jenisKegiatan || '-'}</td>
                  <td>{formatDate(laporan.tanggalMulai)}</td>
                  <td>{formatDate(laporan.tanggalSelesai)}</td>
                  <td>{laporan.keterangan || '-'}</td>
                </tr></tbody>
              </table>
            </div>

            <br />

            {/* Daerah Kawasan */}
            <h4 className="fw-bold" style={{ color: '#1a5c35', borderBottom: '2px solid #e0e0e0', paddingBottom: 8, marginBottom: 16 }}>
              Daerah Kawasan
            </h4>
            <div className="table-responsive">
              <table className="table table-borderless">
                <thead className="bg-light"><tr>
                  <th>Daerah Lokasi</th><th>Kabupaten</th><th>Kecamatan</th><th>Lokasi</th>
                </tr></thead>
                <tbody><tr className="align-middle">
                  <td>{laporan.daerahLokasi || '-'}</td>
                  <td>{laporan.kabupaten || '-'}</td>
                  <td>{laporan.kecamatan || '-'}</td>
                  <td>
                    {laporan.latitude && laporan.longitude
                      ? <a href={`https://www.google.com/maps?q=${laporan.latitude},${laporan.longitude}`}
                          target="_blank" rel="noopener noreferrer"
                          className="btn btn-success btn-sm text-white">
                          <i className="fas fa-map-marker-alt me-1"></i>Lihat Lokasi
                        </a>
                      : '-'}
                  </td>
                </tr></tbody>
              </table>
            </div>

            <br />

            {/* Dokumentasi Kegiatan */}
            <h4 className="fw-bold" style={{ color: '#1a5c35', borderBottom: '2px solid #e0e0e0', paddingBottom: 8, marginBottom: 16 }}>
              Dokumentasi Kegiatan
            </h4>
            <div className="table-responsive">
              <table className="table table-borderless">
                <thead className="bg-light"><tr>
                  <th>Surat Tugas</th><th>Foto Sebelum</th><th>Foto Setelah</th><th>Luas Area</th>
                </tr></thead>
                <tbody><tr className="align-middle">
                  <td>{renderScreenFiles(laporan.suratTugas, 'Surat Tugas')}</td>
                  <td>{renderScreenFiles(laporan.fotoSebelum, 'Foto Sebelum')}</td>
                  <td>{renderScreenFiles(laporan.fotoSetelah, 'Foto Setelah')}</td>
                  <td>{laporan.luasArea ? `${laporan.luasArea} ha` : '-'}</td>
                </tr></tbody>
              </table>
            </div>

            {/* Status */}
            <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
              <strong>Status:</strong>
              <span style={{
                background: statusInfo.bg, color: statusInfo.color,
                padding: '4px 16px', borderRadius: 999, fontWeight: 600, fontSize: 13
              }}>{statusInfo.text}</span>
            </div>

            {laporan.status === 2 && laporan.alasan && (
              <div className="alert mt-3" style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', borderRadius: 6 }}>
                <strong><i className="fas fa-times-circle me-1"></i>Alasan Penolakan:</strong>
                <div className="mt-1">{laporan.alasan}</div>
              </div>
            )}

            {/* Tombol Approve / Tolak */}
            <div className="text-center mt-4">
              {laporan.status === 0 && (<>
                <button onClick={() => handleStatusUpdate(1)} disabled={processing}
                  className="btn btn-success text-white mx-2 rounded-pill px-4">
                  {processing ? 'Memproses...' : <><i className="fas fa-check me-1"></i>Setujui</>}
                </button>
                <button onClick={() => setShowRejectModal(true)} disabled={processing}
                  className="btn btn-danger text-white mx-2 rounded-pill px-4">
                  <i className="fas fa-times me-1"></i>Tolak
                </button>
              </>)}
              {laporan.status === 1 && <span className="badge bg-success px-4 py-2 rounded-pill fs-6">✔ Laporan Disetujui</span>}
              {laporan.status === 2 && <span className="badge bg-danger px-4 py-2 rounded-pill fs-6">✖ Laporan Ditolak</span>}
            </div>

          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════
          TEMPLATE PDF (hanya tampil saat print)
          Mengikuti desain kop surat KPH di gambar referensi
      ════════════════════════════════════════════════════════════════ */}
      <div id="pdf-template" style={{ display: 'none' }}>

        {/* KOP SURAT */}
        <div className="kop-wrapper">
          {/* Logo KPH — ganti src jika logo berbeda */}
          <img
            src="/img/logo.png"
            alt="Logo KPH"
            className="kop-logo"
            onError={(e) => { e.target.style.display = 'none' }}
          />
          <div className="kop-text">
            <div className="instansi">PEMERINTAH PROVINSI RIAU</div>
            <div className="unit">UNIT PELAKSANA TEKNIS</div>
            <div className="nama">KESATUAN PENGELOLAAN HUTAN TASIK BESAR SERKAP</div>
            <div className="alamat">
              Jl. Pengayoman No.1, Tengkerang Utara, Kec. Bukit Raya,<br />
              Kota Pekanbaru, Riau 28126
            </div>
          </div>
        </div>
        <div className="kop-line2"></div>

        {/* JUDUL */}
        <div className="lap-title-block">
          <h2>LAPORAN KEGIATAN KONSERVASI</h2>
          <p>Nomor Laporan : {nomorLaporan}</p>
          <p>Tanggal Laporan : {tanggalCetak}</p>
        </div>

        {/* TABEL ISI */}
        <table className="lap-table">
          <tbody>
            <tr>
              <td className="col-no">1.</td>
              <td className="col-label">Judul Kegiatan</td>
              <td className="col-value">{laporan.judulLaporan || '-'}</td>
            </tr>
            <tr>
              <td className="col-no">2.</td>
              <td className="col-label">Jenis Kegiatan</td>
              <td className="col-value">{laporan.jenisKegiatan || '-'}</td>
            </tr>
            <tr>
              <td className="col-no">3.</td>
              <td className="col-label">Tanggal Mulai</td>
              <td className="col-value">{formatDate(laporan.tanggalMulai)}</td>
            </tr>
            <tr>
              <td className="col-no">4.</td>
              <td className="col-label">Tanggal Selesai</td>
              <td className="col-value">{formatDate(laporan.tanggalSelesai)}</td>
            </tr>
            <tr>
              <td className="col-no">5.</td>
              <td className="col-label">Keterangan</td>
              <td className="col-value">{laporan.keterangan || '-'}</td>
            </tr>
            <tr>
              <td className="col-no">6.</td>
              <td className="col-label">Lokasi Kegiatan</td>
              <td className="col-value">
                <div>Provinsi&nbsp;&nbsp;&nbsp;: {laporan.daerahLokasi || '-'}</div>
                <div>Kabupaten : {laporan.kabupaten || '-'}</div>
                <div>Kecamatan : {laporan.kecamatan || '-'}</div>
                {laporan.latitude && laporan.longitude && (
                  <div>Lokasi&nbsp;&nbsp;&nbsp;&nbsp;: {laporan.latitude}, {laporan.longitude}</div>
                )}
              </td>
            </tr>
            <tr>
              <td className="col-no">7.</td>
              <td className="col-label">Luas Area</td>
              <td className="col-value">{laporan.luasArea ? `${laporan.luasArea} Ha` : '-'}</td>
            </tr>
            <tr>
              <td className="col-no">8.</td>
              <td className="col-label">Dokumentasi Kegiatan</td>
              <td className="col-value">
                <div className="foto-grid">
                  {renderPdfPhoto(laporan.fotoSebelum, 'Foto Sebelum Kegiatan')}
                  {renderPdfPhoto(laporan.fotoSetelah, 'Foto Setelah Kegiatan')}
                </div>
              </td>
            </tr>
            <tr>
              <td className="col-no">9.</td>
              <td className="col-label">Surat Tugas</td>
              <td className="col-value">
                {suratFiles.length > 0
                  ? suratFiles.map((f, i) => <div key={i}>📄 {f}</div>)
                  : '-'}
              </td>
            </tr>
            <tr>
              <td className="col-no">10.</td>
              <td className="col-label">Catatan Tambahan</td>
              <td className="col-value">{laporan.catatan || '-'}</td>
            </tr>
          </tbody>
        </table>

        {/* TTD */}
        <div style={{ textAlign: 'right', fontSize: '10.5pt', marginBottom: 8 }}>
          Pekanbaru, {tanggalCetak}
        </div>
        <div className="ttd-row">
          <div className="ttd-col">
            <div>Dibuat oleh,</div>
            <div style={{ fontWeight: 'bold' }}>Admin Lapangan</div>
            <div className="ttd-line">(………………………………)</div>
          </div>
          <div className="ttd-col">
            <div>Diperiksa oleh,</div>
            <div style={{ fontWeight: 'bold' }}>Admin Pusat</div>
            <div className="ttd-line">(………………………………)</div>
          </div>
        </div>

      </div>

      {/* ── Modal Tolak ── */}
      {showRejectModal && (
        <div className="reject-modal-overlay">
          <div className="reject-modal-box">
            <div className="reject-modal-header">
              <h5><i className="fas fa-times-circle me-2"></i>Tolak Laporan</h5>
              <button className="reject-modal-close" onClick={() => { setShowRejectModal(false); setAlasanTolak('') }}>×</button>
            </div>
            <div className="reject-modal-body">
              <p style={{ fontSize: 14, color: '#6b7280', marginBottom: 16 }}>
                Mohon berikan alasan penolakan agar pengirim dapat melakukan perbaikan.
              </p>
              <label style={{ fontWeight: 500, marginBottom: 6, display: 'block' }}>
                Alasan Penolakan <span style={{ color: '#b91c1c' }}>*</span>
              </label>
              <textarea
                className="form-control"
                rows={4}
                placeholder="Tuliskan alasan penolakan laporan..."
                value={alasanTolak}
                onChange={(e) => setAlasanTolak(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', fontSize: 14, borderRadius: 4, border: '1px solid #ced4da' }}
              />
              {alasanTolak.trim() === '' && (
                <small style={{ color: '#b91c1c', fontSize: 12 }}>Alasan wajib diisi</small>
              )}
            </div>
            <div className="reject-modal-footer">
              <button
                onClick={() => { setShowRejectModal(false); setAlasanTolak('') }}
                style={{ background: '#6c757d', color: '#fff', border: 'none', borderRadius: 4, padding: '8px 20px', cursor: 'pointer' }}
              >Batal</button>
              <button
                onClick={handleRejectSubmit}
                disabled={processing || alasanTolak.trim() === ''}
                style={{
                  background: '#b91c1c', color: '#fff', border: 'none', borderRadius: 4,
                  padding: '8px 22px', cursor: processing || !alasanTolak.trim() ? 'not-allowed' : 'pointer',
                  opacity: processing || !alasanTolak.trim() ? 0.65 : 1
                }}
              >
                {processing ? 'Memproses...' : 'Konfirmasi Tolak'}
              </button>
            </div>
          </div>
        </div>
      )}

    </AdminPusatLayout>
  )
}