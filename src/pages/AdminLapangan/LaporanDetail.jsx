import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import AdminLapanganLayout from '../../layouts/AdminLapanganLayout.jsx'
import api from '../../lib/api.js'

const styles = {
  btnBack: {
    background: '#f5f5f5',
    color: '#444',
    border: '1px solid #e0e0e0',
    padding: '7px 16px',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '500',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    marginBottom: '1.25rem',
  },
  card: {
    background: '#fff',
    border: '1px solid #e8e8e8',
    borderRadius: '12px',
    padding: '1.5rem',
    marginBottom: '1rem',
  },
  sectionTitle: {
    fontSize: '13px',
    fontWeight: '700',
    color: '#1a5c35',
    textTransform: 'uppercase',
    letterSpacing: '0.07em',
    marginBottom: '1rem',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  sectionTitleDot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    background: '#1a5c35',
    display: 'inline-block',
  },
  divider: {
    height: '1px',
    background: '#f0f0f0',
    margin: '1.25rem 0',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '16px',
  },
  fieldLabel: {
    fontSize: '11px',
    fontWeight: '600',
    color: '#999',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    marginBottom: '5px',
  },
  fieldValue: {
    fontSize: '14px',
    color: '#1a1a1a',
    fontWeight: '400',
    lineHeight: '1.5',
  },
  fieldValueMuted: {
    fontSize: '14px',
    color: '#bbb',
    fontStyle: 'italic',
  },
  btnLocation: {
    background: '#1a5c35',
    color: '#fff',
    border: 'none',
    padding: '6px 14px',
    borderRadius: '7px',
    fontSize: '12px',
    fontWeight: '500',
    cursor: 'pointer',
    textDecoration: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '5px',
  },
  fileItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: '#f8f9fa',
    border: '1px solid #efefef',
    borderRadius: '8px',
    padding: '8px 12px',
    fontSize: '13px',
    color: '#444',
    marginBottom: '6px',
    cursor: 'pointer',
    textDecoration: 'none',
  },
  fileIcon: {
    width: '28px',
    height: '28px',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    flexShrink: 0,
  },
  imgThumb: {
    width: '80px',
    height: '80px',
    objectFit: 'cover',
    borderRadius: '8px',
    border: '1px solid #efefef',
    cursor: 'pointer',
    display: 'block',
    marginBottom: '4px',
  },
  thumbGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
  },
  statusWrap: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '1.5rem',
    paddingTop: '1.25rem',
    borderTop: '1px solid #f0f0f0',
  },
  statusPill: {
    padding: '10px 32px',
    borderRadius: '999px',
    fontSize: '14px',
    fontWeight: '600',
    letterSpacing: '0.02em',
  },

  // ── ALASAN PENOLAKAN — diperbesar & lebih prominent ──
  rejectBox: {
    background: '#fef2f2',
    border: '1.5px solid #fca5a5',
    borderRadius: '12px',
    padding: '20px 24px',
    marginTop: '1.5rem',
  },
  rejectBoxHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '12px',
    paddingBottom: '12px',
    borderBottom: '1px solid #fecaca',
  },
  rejectBoxIcon: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    background: '#fee2e2',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  rejectBoxTitle: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#b91c1c',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    margin: 0,
  },
  rejectBoxSubtitle: {
    fontSize: '12px',
    color: '#ef4444',
    marginTop: '2px',
  },
  rejectBoxText: {
    fontSize: '14px',
    color: '#7f1d1d',
    lineHeight: '1.7',
    whiteSpace: 'pre-wrap',
    background: '#fff5f5',
    borderRadius: '8px',
    padding: '12px 16px',
    border: '1px solid #fecaca',
  },
  rejectBoxNote: {
    marginTop: '12px',
    fontSize: '12px',
    color: '#b91c1c',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontStyle: 'italic',
  },
}

const statusStyles = {
  0: { background: '#FAEEDA', color: '#854F0B' },
  1: { background: '#EAF3DE', color: '#3B6D11' },
  2: { background: '#FCEBEB', color: '#A32D2D' },
}

const statusLabel = {
  
  0: 'Laporan Pending',
  1: 'Laporan Disetujui',
  2: 'Laporan Ditolak',
}

export default function LaporanDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [laporan, setLaporan] = React.useState(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState('')

  React.useEffect(() => {
    let mounted = true
    api.get(`/laporan-konservasi/${id}`)
      .then(res => {
        if (mounted) {
          console.log('Raw laporan data:', res.data)
          // ── FIX: unwrap data jika ada wrapper ──
          const detail = res.data?.data || res.data
          setLaporan(detail)
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
    if (!dateString) return null
    const date = new Date(dateString)
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()
    return `${day}-${month}-${year}`
  }

  const renderMultipleFiles = (filesJson, label) => {
    if (!filesJson) return <span style={styles.fieldValueMuted}>Tidak ada file</span>

    let files = []
    try {
      if (Array.isArray(filesJson)) {
        files = filesJson
      } else {
        files = JSON.parse(filesJson)
      }
    } catch (e) {
      files = [filesJson]
    }

    if (!Array.isArray(files) || files.length === 0) {
      return <span style={styles.fieldValueMuted}>Tidak ada file</span>
    }

    const images = files.filter(f => /\.(jpg|jpeg|png|gif|webp)$/i.test(f))
    const pdfs = files.filter(f => /\.pdf$/i.test(f))
    const others = files.filter(f => !/\.(jpg|jpeg|png|gif|webp|pdf)$/i.test(f))

    return (
      <div>
        {images.length > 0 && (
          <div style={styles.thumbGrid}>
            {images.map((filename, index) => (
              <div key={index} style={{ textAlign: 'center' }}>
                <img
                  src={`/uploads/laporan/${filename}`}
                  alt={`${label} ${index + 1}`}
                  style={styles.imgThumb}
                  onClick={() => window.open(`/uploads/laporan/${filename}`, '_blank')}
                />
                <span style={{ fontSize: '11px', color: '#aaa' }}>#{index + 1}</span>
              </div>
            ))}
          </div>
        )}
        {pdfs.map((filename, index) => (
          <a key={index} href={`/uploads/laporan/${filename}`} target="_blank" rel="noopener noreferrer" style={styles.fileItem}>
            <div style={{ ...styles.fileIcon, background: '#fee2e2' }}>
              <i className="fas fa-file-pdf" style={{ color: '#dc2626', fontSize: '13px' }}></i>
            </div>
            <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {filename.length > 30 ? filename.substring(0, 30) + '...' : filename}
            </span>
            <i className="fas fa-external-link-alt" style={{ fontSize: '11px', color: '#aaa' }}></i>
          </a>
        ))}
        {others.map((filename, index) => (
          <a key={index} href={`/uploads/laporan/${filename}`} target="_blank" rel="noopener noreferrer" style={styles.fileItem}>
            <div style={{ ...styles.fileIcon, background: '#f0f0f0' }}>
              <i className="fas fa-file" style={{ color: '#888', fontSize: '13px' }}></i>
            </div>
            <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {filename.length > 30 ? filename.substring(0, 30) + '...' : filename}
            </span>
            <i className="fas fa-external-link-alt" style={{ fontSize: '11px', color: '#aaa' }}></i>
          </a>
        ))}
        <div style={{ marginTop: '6px' }}>
          <span style={{ fontSize: '11px', color: '#aaa' }}>Total: {files.length} file — klik gambar untuk perbesar</span>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <AdminLapanganLayout title="Detail Laporan">
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
          <div className="spinner-border text-success" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </AdminLapanganLayout>
    )
  }

  if (error) {
    return (
      <AdminLapanganLayout title="Detail Laporan">
        <div className="alert alert-danger" style={{ borderRadius: '10px', fontSize: '14px' }}>{error}</div>
        <button style={styles.btnBack} onClick={() => navigate('/admin-lapangan/laporan')}>
          <i className="fas fa-angles-left" style={{ fontSize: '11px' }}></i> Kembali
        </button>
      </AdminLapanganLayout>
    )
  }

  const statusStyle = statusStyles[laporan?.status] ?? { background: '#f0f0f0', color: '#888' }
  const statusText = statusLabel[laporan?.status] ?? 'Status Unknown'

  return (
    <AdminLapanganLayout title="Detail Laporan Konservasi">
      <button style={styles.btnBack} onClick={() => navigate('/admin-lapangan/laporan')}>
        <i className="fas fa-angles-left" style={{ fontSize: '11px' }}></i> Kembali
      </button>

      {/* ── BANNER PENOLAKAN — muncul paling atas jika ditolak ── */}
      {laporan?.status === 2 && (
        <div style={styles.rejectBox}>
          <div style={styles.rejectBoxHeader}>
            <div style={styles.rejectBoxIcon}>
              <i className="fas fa-times-circle" style={{ color: '#b91c1c', fontSize: '16px' }}></i>
            </div>
            <div>
              <div style={styles.rejectBoxTitle}>Laporan Ditolak</div>
              <div style={styles.rejectBoxSubtitle}>
                Admin Pusat telah menolak laporan ini
              </div>
            </div>
          </div>

          {laporan?.alasan ? (
            <>
              <div style={{ fontSize: '12px', fontWeight: '600', color: '#b91c1c', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Alasan Penolakan:
              </div>
              <div style={styles.rejectBoxText}>
                {laporan.alasan}
              </div>
              <div style={styles.rejectBoxNote}>
                <i className="fas fa-info-circle"></i>
                Silakan perbaiki laporan sesuai alasan di atas, lalu kirim ulang.
              </div>
            </>
          ) : (
            <div style={{ fontSize: '14px', color: '#7f1d1d', fontStyle: 'italic' }}>
              Admin Pusat belum memberikan alasan penolakan.
            </div>
          )}
        </div>
      )}

      <div style={styles.card}>

        {/* ── Deskripsi Kegiatan ── */}
        <div style={styles.sectionTitle}>
          <span style={styles.sectionTitleDot}></span>
          Deskripsi Kegiatan
        </div>
        <div style={styles.grid}>
          <div>
            <div style={styles.fieldLabel}>Judul Laporan</div>
            <div style={styles.fieldValue}>{laporan?.judulLaporan || <span style={styles.fieldValueMuted}>N/A</span>}</div>
          </div>
          <div>
            <div style={styles.fieldLabel}>Jenis Kegiatan</div>
            <div style={styles.fieldValue}>{laporan?.jenisKegiatan || <span style={styles.fieldValueMuted}>N/A</span>}</div>
          </div>
          <div>
            <div style={styles.fieldLabel}>Tanggal Mulai</div>
            <div style={styles.fieldValue}>
              {laporan?.tanggalMulai ? formatDate(laporan.tanggalMulai) : <span style={styles.fieldValueMuted}>N/A</span>}
            </div>
          </div>
          <div>
            <div style={styles.fieldLabel}>Tanggal Selesai</div>
            <div style={styles.fieldValue}>
              {laporan?.tanggalSelesai ? formatDate(laporan.tanggalSelesai) : <span style={styles.fieldValueMuted}>N/A</span>}
            </div>
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <div style={styles.fieldLabel}>Keterangan</div>
            <div style={styles.fieldValue}>{laporan?.keterangan || <span style={styles.fieldValueMuted}>N/A</span>}</div>
          </div>
        </div>

        <div style={styles.divider}></div>

        {/* ── Daerah Kawasan ── */}
        <div style={styles.sectionTitle}>
          <span style={styles.sectionTitleDot}></span>
          Daerah Kawasan
        </div>
        <div style={styles.grid}>
          <div>
            <div style={styles.fieldLabel}>Daerah Lokasi</div>
            <div style={styles.fieldValue}>{laporan?.daerahLokasi || <span style={styles.fieldValueMuted}>N/A</span>}</div>
          </div>
          <div>
            <div style={styles.fieldLabel}>Kabupaten</div>
            <div style={styles.fieldValue}>{laporan?.kabupaten || <span style={styles.fieldValueMuted}>N/A</span>}</div>
          </div>
          <div>
            <div style={styles.fieldLabel}>Kecamatan</div>
            <div style={styles.fieldValue}>{laporan?.kecamatan || <span style={styles.fieldValueMuted}>N/A</span>}</div>
          </div>
          <div>
            <div style={styles.fieldLabel}>Lokasi</div>
            <div style={styles.fieldValue}>
              {laporan?.latitude && laporan?.longitude ? (
                <a
                  href={`https://www.google.com/maps?q=${laporan.latitude},${laporan.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={styles.btnLocation}
                >
                  <i className="fas fa-map-marker-alt" style={{ fontSize: '11px' }}></i>
                  Lihat Lokasi
                </a>
              ) : (
                <span style={styles.fieldValueMuted}>N/A</span>
              )}
            </div>
          </div>
        </div>

        <div style={styles.divider}></div>

        {/* ── Dokumentasi Kegiatan ── */}
        <div style={styles.sectionTitle}>
          <span style={styles.sectionTitleDot}></span>
          Dokumentasi Kegiatan
        </div>
        <div style={styles.grid}>
          <div>
            <div style={styles.fieldLabel}>Surat Tugas</div>
            {renderMultipleFiles(laporan?.suratTugas, 'Surat Tugas')}
          </div>
          <div>
            <div style={styles.fieldLabel}>Foto Sebelum Kegiatan</div>
            {renderMultipleFiles(laporan?.fotoSebelum, 'Foto Sebelum')}
          </div>
          <div>
            <div style={styles.fieldLabel}>Foto Setelah Kegiatan</div>
            {renderMultipleFiles(laporan?.fotoSetelah, 'Foto Setelah')}
          </div>
          <div>
            <div style={styles.fieldLabel}>Luas Area</div>
            <div style={styles.fieldValue}>
              {laporan?.luasArea ? `${laporan.luasArea} ha` : <span style={styles.fieldValueMuted}>N/A</span>}
            </div>
          </div>
        </div>

        {/* ── Status Badge ── */}
        <div style={styles.statusWrap}>
          <span style={{ ...styles.statusPill, ...statusStyle }}>
            {statusText}
          </span>
        </div>

      </div>
    </AdminLapanganLayout>
  )
}