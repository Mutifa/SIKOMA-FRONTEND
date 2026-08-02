import React from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler   
} from 'chart.js'
import { Bar, Pie, Line } from 'react-chartjs-2'
import { useNavigate } from 'react-router-dom'
import { dashboardService } from '../../../services/dashboardService.js'
import { laporanKonservasiService } from '../../../services/laporanKonservasi.js'
import DashboardLayout from '../../../layouts/DashboardLayout'
import { useAuth } from '../../../contexts/AuthContext'

// ─────────────────────────────────────────────
// Registrasi komponen Chart.js yang digunakan
// (wajib dilakukan sebelum render chart apapun)
// ─────────────────────────────────────────────
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

// ─────────────────────────────────────────────
// Halaman Dashboard
// Menampilkan tampilan berbeda berdasarkan role user:
// - Admin Pusat: summary card, bar chart, tabel daerah
// - Admin Lapangan: summary card, pie chart status, line chart
// ─────────────────────────────────────────────
export default function AdminPusatDashboard() {
  const navigate = useNavigate()

  // State data dashboard dari API
  const [data, setData] = React.useState({
    masyarakat: 0,
    laporanTerakhir: 0,
    laporanDisetujui: 0,
    feedback: 0,
    laporanTahunan: [],
    daerah: []
  })

  // State pesan error & loading
  const [error, setError] = React.useState('')
  const [loading, setLoading] = React.useState(true)
  const [laporanKonservasi, setLaporanKonservasi] = React.useState([])
  const [showAllDaerah, setShowAllDaerah] = React.useState(false)
  
  // State untuk tracking notifikasi laporan ditolak yang sudah dibaca (Admin Lapangan)
  const [dismissedNotifications, setDismissedNotifications] = React.useState(() => {
    const stored = localStorage.getItem('dismissedLaporanDitolak')
    return stored ? JSON.parse(stored) : []
  })

  // Ringkasan data yang digunakan di summary card
 const summary = {
  total_laporan: data.jumlahLaporan || data.laporanTerakhir,
  disetujui: data.diterima || data.laporanDisetujui
}

  const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']
  const toNumber = (value) => Number(value || 0)

  // Data chart tahunan dan daftar daerah (dengan fallback ke default kosong)
  const daerahList = data.daerah || []

  const goToLaporanKonservasi = () => {
    navigate('/laporan-konservasi')
  }

  const openWithKeyboard = (event, action) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      action()
    }
  }

  // ──────────────────────────────────────────────
  // Handler untuk dismiss notifikasi laporan ditolak (Admin Lapangan)
  // ──────────────────────────────────────────────
  const dismissLaporanDitolakNotification = (laporanId) => {
    const updated = [...dismissedNotifications, laporanId]
    setDismissedNotifications(updated)
    localStorage.setItem('dismissedLaporanDitolak', JSON.stringify(updated))
  }

  // ──────────────────────────────────────────────
  // Filter laporan yang ditolak dan belum dibaca (untuk Admin Lapangan)
  // ──────────────────────────────────────────────
  const laporanDitolakBelumDibaca = React.useMemo(() => {
    return laporanKonservasi.filter(item =>
      item.status === 2 && !dismissedNotifications.includes(item.id)
    )
  }, [laporanKonservasi, dismissedNotifications])

  // Ambil data user dari context dan tentukan role-nya
  const { user } = useAuth()

  const isAdminPusat =
    user?.role === 'admin_pusat' ||
    user?.role === 'AdminPusat'

  const isAdminLapangan =
    user?.role === 'admin_lapangan' ||
    user?.role === 'AdminLapangan'

  // ─────────────────────────────────────────────
  // Fetch data dashboard saat komponen pertama kali dimuat
  // Menggunakan flag `mounted` untuk mencegah setState setelah unmount
  // ─────────────────────────────────────────────

  React.useEffect(() => {
    let mounted = true

    const fetchData = isAdminPusat
      ? dashboardService.getAdminPusat()
      : dashboardService.getAdminLapangan()

    Promise.all([
      fetchData,
      laporanKonservasiService.getAll().catch(() => null)
    ])
      .then(([res, laporanRes]) => {
        if (mounted) {
          const result = res.data.data || res.data
          if (result.daerah && !Array.isArray(result.daerah)) {
            result.daerah = [result.daerah]
          }

          const laporanData =
            laporanRes?.data?.laporan?.data ||
            laporanRes?.data?.laporan ||
            laporanRes?.data?.data ||
            []

          setData(result)
          setLaporanKonservasi(Array.isArray(laporanData) ? laporanData : [])
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
  }, [isAdminPusat])

  // ─────────────────────────────────────────────
  // Persiapan data chart laporan tahunan
  // ─────────────────────────────────────────────
  // ✅ GANTI JADI
  const chartDataFix = Array.isArray(data.laporanBulanan)
  ? data.laporanBulanan
  : Array.isArray(data.laporanTahunan)
    ? data.laporanTahunan
    : Array(12).fill(0)

  const currentMonthIndex = new Date().getMonth()
  const laporanTahunanTotal = chartDataFix.reduce((total, item) => total + toNumber(item), 0)
  const laporanBulanIni = toNumber(chartDataFix[currentMonthIndex])
  const laporanBulanLalu = currentMonthIndex > 0 ? toNumber(chartDataFix[currentMonthIndex - 1]) : 0
  const selisihBulanan = laporanBulanIni - laporanBulanLalu
  const totalLaporan = toNumber(summary.total_laporan) || laporanTahunanTotal
  const laporanDisetujui = toNumber(summary.disetujui)
  const laporanDitolak = toNumber(data.ditolak)
  const laporanPending = React.useMemo(() => {
    return laporanKonservasi.filter(item => item.status === 0).length
  }, [laporanKonservasi])
  const totalStatusLaporan = laporanDisetujui + laporanDitolak + laporanPending
  const approvalRate = totalStatusLaporan > 0
    ? Math.round((laporanDisetujui / totalStatusLaporan) * 100)
    : 0
  const activeMonthIndex = chartDataFix.reduce((maxIndex, item, index, arr) => (
    toNumber(item) > toNumber(arr[maxIndex]) ? index : maxIndex
  ), 0)
  const activeMonthLabel = monthLabels[activeMonthIndex]
  const activeMonthTotal = toNumber(chartDataFix[activeMonthIndex])
  const statusOverview = [
    { label: 'Disetujui', value: laporanDisetujui, className: 'approved' },
    { label: 'Pending', value: laporanPending, className: 'pending' },
    { label: 'Ditolak', value: laporanDitolak, className: 'rejected' }
  ]
  const quickInsights = [
    {
      icon: 'fa-chart-line',
      title: 'Bulan paling aktif',
      text: activeMonthTotal > 0
        ? `${activeMonthLabel} mencatat ${activeMonthTotal} laporan.`
        : 'Belum ada laporan bulanan yang tercatat.'
    },
    {
      icon: selisihBulanan >= 0 ? 'fa-arrow-trend-up' : 'fa-arrow-trend-down',
      title: 'Perubahan bulan ini',
      text: selisihBulanan === 0
        ? 'Aktivitas laporan bulan ini stabil dari bulan sebelumnya.'
        : `${Math.abs(selisihBulanan)} laporan ${selisihBulanan > 0 ? 'lebih banyak' : 'lebih sedikit'} dari bulan sebelumnya.`
    },
    {
      icon: 'fa-circle-check',
      title: 'Rasio persetujuan',
      text: totalStatusLaporan > 0
        ? `${approvalRate}% laporan sudah disetujui dari total status yang terdata.`
        : 'Belum ada status laporan yang bisa dihitung.'
    }
  ]
  const laporanDaerahList = React.useMemo(() => {
    const daerahMap = new Map()

    laporanKonservasi.forEach(item => {
      const daerahLokasi = (item.daerahLokasi || item.daerah_lokasi || '').trim()
      const kabupaten = (item.kabupaten || '').trim()
      const kecamatan = (item.kecamatan || '').trim()

      if (!daerahLokasi && !kabupaten && !kecamatan) return

      const key = [daerahLokasi, kabupaten, kecamatan].join('|')
      const existing = daerahMap.get(key)

      daerahMap.set(key, {
        daerahLokasi: daerahLokasi || '-',
        kabupaten: kabupaten || '-',
        kecamatan: kecamatan || '-',
        jumlah: existing ? existing.jumlah + 1 : 1
      })
    })

    return Array.from(daerahMap.values())
      .sort((a, b) => (
        b.jumlah - a.jumlah ||
        a.daerahLokasi.localeCompare(b.daerahLokasi) ||
        a.kabupaten.localeCompare(b.kabupaten) ||
        a.kecamatan.localeCompare(b.kecamatan)
      ))
  }, [laporanKonservasi])
  const visibleLaporanDaerahList = laporanDaerahList.slice(0, 3)
  const hasMoreLaporanDaerah = laporanDaerahList.length > visibleLaporanDaerahList.length

  // Konfigurasi data Bar chart untuk Admin Pusat
  const tahunanChartData = {
    labels: monthLabels,
    datasets: [
      {
        label: 'Jumlah Laporan',
        data: chartDataFix,
        backgroundColor: 'rgba(54, 162, 235, 0.7)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
      }
    ]
  }

  const statusChartData = {
    labels: statusOverview.map(item => item.label),
    datasets: [
      {
        label: 'Jumlah Laporan',
        data: statusOverview.map(item => item.value),
        backgroundColor: ['#16a34a', '#f59e0b', '#e11d48'],
        borderColor: '#fff',
        borderWidth: 3,
        hoverOffset: 8
      }
    ]
  }

  // ─────────────────────────────────────────────
  // Tampilkan layout kosong saat data sedang dimuat
  // ─────────────────────────────────────────────
  if (loading) {
    return (
      <DashboardLayout>
        <div style={{ padding: '20px' }}>
        </div>
      </DashboardLayout>
    )
  }

  // ─────────────────────────────────────────────
  // Render utama: konten dashboard berdasarkan role
  // ─────────────────────────────────────────────
  return (
    <DashboardLayout title="Dashboard">

      {/* Pesan error (muncul jika fetch gagal) */}
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="dashboard-content">

        {/* ══════════════════════════════════════
            DASHBOARD ADMIN PUSAT
        ══════════════════════════════════════ */}
        {isAdminPusat && (

          <>

            {/* ── NOTIFIKASI LAPORAN PENDING ── */}
            {laporanPending > 0 && (
              <div
                className="alert alert-warning alert-dismissible fade show mb-4 d-flex align-items-center"
                role="alert"
                style={{
                  cursor: 'pointer',
                  backgroundColor: '#fef3c7',
                  borderColor: '#fcd34d',
                  borderLeft: '4px solid #f59e0b',
                  transition: 'all 0.3s ease'
                }}
                onClick={goToLaporanKonservasi}
                onKeyDown={(event) => openWithKeyboard(event, goToLaporanKonservasi)}
                tabIndex={0}
                role="button"
              >
                <div style={{ marginRight: '12px', fontSize: '1.25rem', color: '#d97706' }}>
                  <i className="fas fa-bell"></i>
                </div>
                <div style={{ flex: 1 }}>
                  <strong style={{ color: '#92400e' }}>
                    Ada {laporanPending} laporan konservasi yang menunggu verifikasi.
                  </strong>
                  <div style={{ fontSize: '0.9rem', color: '#b45309', marginTop: '4px' }}>
                    Klik untuk melihat detail laporan
                  </div>
                </div>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="alert"
                  aria-label="Close"
                  onClick={(e) => e.stopPropagation()}
                ></button>
              </div>
            )}

            {/* ── SUMMARY CARDS ── */}
            <div className="dashboard-summary-grid">

              {/* Card: Total Laporan (30 Hari Terakhir) */}
              <div className="dashboard-summary-col">

                <div
                  className="white-box analytics-info dashboard-modern-stat dashboard-modern-stat--blue"
                  onClick={goToLaporanKonservasi}
                  onKeyDown={(event) => openWithKeyboard(event, goToLaporanKonservasi)}
                  role="button"
                  tabIndex={0}
                  aria-label={`Total laporan masuk: ${data.laporanTerakhir || 0}, klik untuk melihat detail`}
                >

                  <div className="d-flex justify-content-between align-items-start">

                    <div>
                      <h5 className="mb-1 text-muted">
                        Laporan Masuk
                      </h5>
                    </div>

                    <div className="text-primary fs-2">
                      <i className="fas fa-archive"></i>
                    </div>

                  </div>

                  <div className="mt-3">

                    <h2 className="fw-bold">{data.laporanTerakhir || 0}</h2>

                    <small className="text-muted">
                      {laporanBulanIni} laporan bulan ini
                    </small>

                  </div>

                </div>

              </div>

              {/* Card: Laporan Disetujui */}
              <div className="dashboard-summary-col">

                <div
                  className="white-box analytics-info dashboard-modern-stat dashboard-modern-stat--green"
                  onClick={goToLaporanKonservasi}
                  onKeyDown={(event) => openWithKeyboard(event, goToLaporanKonservasi)}
                  role="button"
                  tabIndex={0}
                  aria-label={`Laporan disetujui: ${summary.disetujui || 0}, klik untuk melihat detail`}
                >

                  <div className="d-flex justify-content-between align-items-start">

                    <div>
                      <h5 className="mb-1 text-muted">
                        Laporan Disetujui
                      </h5>
                    </div>

                    <div className="text-success fs-2">
                      <i className="fas fa-check-square"></i>
                    </div>

                  </div>

                  <div className="mt-3">

                    <h2 className="fw-bold">
                      {summary.disetujui || 0}
                    </h2>

                    <small className="text-muted">
                      {approvalRate}% dari status terdata
                    </small>

                  </div>

                </div>

              </div>

              {/* Card: Feedback (nilai statis 0, placeholder) */}
              <div className="dashboard-summary-col">

                <div
                  className="white-box analytics-info dashboard-modern-stat dashboard-modern-stat--yellow"
                  onClick={() => navigate('/pesan-masuk')}
                  onKeyDown={(event) => openWithKeyboard(event, () => navigate('/pesan-masuk'))}
                  role="button"
                  tabIndex={0}
                  aria-label={`Feedback: ${data.feedback || 0}, klik untuk melihat detail`}
                >

                  <div className="d-flex justify-content-between align-items-start">

                    <div>
                      <h5 className="mb-1">
                        Feedback
                      </h5>
                    </div>

                    <div className="text-warning fs-2">
                      <i className="fas fa-file-alt"></i>
                    </div>
                  </div>

                  <div className="mt-3">
                    <h2 className="fw-bold">
                      {data.feedback || 0}
                    </h2>
                    <small className="text-muted">
                      Standar Pelayanan
                    </small>

                  </div>
                </div>
              </div>
            </div>

            {/* ── CHART + TABEL DAERAH ── */}
            <div className="row g-4 dashboard-main-grid">

              {/* Chart: Komposisi Status Laporan */}
              <div className="col-lg-8 col-md-12">
                <div
                  className="white-box dashboard-panel-card dashboard-status-card dashboard-clickable-panel"
                  onClick={goToLaporanKonservasi}
                  onKeyDown={(event) => openWithKeyboard(event, goToLaporanKonservasi)}
                  role="button"
                  tabIndex={0}
                >
                  <h3 className="box-title">Komposisi Status Laporan</h3>
                  <div className="dashboard-status-chart">
                    <Pie
                      data={statusChartData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            position: 'bottom',
                            labels: {
                              boxWidth: 12,
                              boxHeight: 12,
                              color: '#52645a',
                              font: {
                                size: 12,
                                weight: 700
                              },
                              padding: 16
                            }
                          },
                          tooltip: {
                            backgroundColor: '#123326',
                            padding: 12,
                            callbacks: {
                              label: (context) => `${context.label}: ${context.parsed || 0} laporan`
                            }
                          }
                        }
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Tabel: Daftar Daerah Konservasi */}
              <div className="col-lg-4 col-md-12">
                <div className="white-box dashboard-panel-card dashboard-region-panel">
                  <div className="dashboard-region-header">
                    <div>
                      <h3 className="box-title">
                        Daerah
                      </h3>
                      <p>Daerah kawasan dari laporan konservasi</p>
                    </div>
                    <div className="dashboard-region-total">
                      <strong>{laporanDaerahList.length}</strong>
                      <span>Daerah</span>
                    </div>
                  </div>

                  <div className="dashboard-region-list">
                    {visibleLaporanDaerahList && visibleLaporanDaerahList.length > 0 ? (
                      visibleLaporanDaerahList.map((item, index) => (
                        <div className="dashboard-region-item" key={index}>
                          <span>{index + 1}</span>
                          <div>
                            <strong>{item.daerahLokasi}</strong>
                            <small>
                              {item.kabupaten} - {item.kecamatan}
                            </small>
                            <em>{item.jumlah} laporan konservasi</em>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="dashboard-region-empty">
                        Belum ada daerah pada laporan konservasi
                      </div>
                    )}
                  </div>

                  {hasMoreLaporanDaerah && (
                    <button
                      type="button"
                      className="dashboard-region-more"
                      onClick={() => setShowAllDaerah(true)}
                    >
                      Selengkapnya
                      <i className="fas fa-arrow-right"></i>
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="row g-4 dashboard-main-grid">
              <div className="col-lg-8 col-md-12">
                <div className="white-box dashboard-panel-card dashboard-chart-panel">
                  <h3 className="box-title">
                    Laporan Tahun 2026
                  </h3>

                  <div className="dashboard-chart-area">
                    <Bar
                      data={tahunanChartData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        interaction: {
                          mode: 'index',
                          intersect: false
                        },
                        plugins: {
                          legend: {
                            position: 'top'
                          },
                          tooltip: {
                            backgroundColor: '#123326',
                            padding: 12,
                            titleFont: {
                              size: 13
                            },
                            bodyFont: {
                              size: 12
                            }
                          }
                        },
                        scales: {
                          y: {
                            beginAtZero: true,
                            ticks: {
                              stepSize: 1
                            }
                          }
                        }
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="col-lg-4 col-md-12">
                <div
                  className="white-box dashboard-insight-card dashboard-clickable-panel"
                  onClick={goToLaporanKonservasi}
                  onKeyDown={(event) => openWithKeyboard(event, goToLaporanKonservasi)}
                  role="button"
                  tabIndex={0}
                >
                  <h3 className="box-title">Insight Cepat</h3>
                  <div className="dashboard-insight-list">
                    {quickInsights.map(item => (
                      <div className="dashboard-insight-item" key={item.title}>
                        <i className={`fas ${item.icon}`}></i>
                        <div>
                          <strong>{item.title}</strong>
                          <span>{item.text}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ══════════════════════════════════════
            DASHBOARD ADMIN LAPANGAN
        ══════════════════════════════════════ */}
        {isAdminLapangan && (
          <>
            {/* ── NOTIFIKASI LAPORAN DITOLAK ── */}
            {laporanDitolakBelumDibaca.length > 0 && (
              <div className="alert alert-danger alert-dismissible fade show mb-4 d-flex align-items-center"
                role="alert"
                style={{
                  cursor: 'pointer',
                  backgroundColor: '#fee2e2',
                  borderColor: '#fca5a5',
                  borderLeft: '4px solid #dc2626',
                  transition: 'all 0.3s ease'
                }}
                onClick={() => {
                  laporanDitolakBelumDibaca.forEach(item => dismissLaporanDitolakNotification(item.id))
                  goToLaporanKonservasi()
                }}
                onKeyDown={(event) => openWithKeyboard(event, () => {
                  laporanDitolakBelumDibaca.forEach(item => dismissLaporanDitolakNotification(item.id))
                  goToLaporanKonservasi()
                })}
                tabIndex={0}
              >
                <div style={{ marginRight: '12px', fontSize: '1.25rem', color: '#b91c1c' }}>
                  <i className="fas fa-bell"></i>
                </div>
                <div style={{ flex: 1 }}>
                  <strong style={{ color: '#7f1d1d' }}>
                    ⚠️ Ada {laporanDitolakBelumDibaca.length} laporan konservasi yang ditolak.
                  </strong>
                  <div style={{ fontSize: '0.9rem', color: '#991b1b', marginTop: '4px' }}>
                    Admin Pusat telah menolak {laporanDitolakBelumDibaca.length === 1 ? 'laporan' : 'laporan-laporan'} Anda. Klik untuk melihat detail dan alasan penolakan.
                  </div>
                </div>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="alert"
                  aria-label="Close"
                  onClick={(e) => {
                    e.stopPropagation()
                    laporanDitolakBelumDibaca.forEach(item => dismissLaporanDitolakNotification(item.id))
                  }}
                ></button>
              </div>
            )}

            {/* ── SUMMARY CARDS ── */}
            <div className="row g-3">

              {/* Card: Total Laporan Kegiatan */}
              <div className="col-lg-6 col-md-6 col-sm-12 d-flex">

                <div
                  className="white-box lapangan-dashboard-card lapangan-stat-card dashboard-action-card w-100"
                  onClick={goToLaporanKonservasi}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault()
                      goToLaporanKonservasi()
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  aria-label="Total laporan kegiatan, klik untuk melihat detail"
                >

                  <div className="lapangan-card-header">

                    <div>
                      <h5
                        className="lapangan-card-title"
                      >
                        Jumlah Laporan Kegiatan
                      </h5>
                    </div>

                    {/* Ikon arsip dengan background biru gelap */}
                    <div className="lapangan-card-icon">
                      <i
                        className="fas fa-archive"
                      ></i>
                    </div>

                  </div>

                  <div className="lapangan-stat-body">

                    <h2
                      className="lapangan-stat-number"
                    >
                      {summary.total_laporan || 0}
                    </h2>

                    <small className="lapangan-stat-caption">
                      Jumlah laporan kegiatan
                    </small>
                  </div>
                </div>
              </div>

              {/* Card: Pie Chart Status Laporan (Diterima vs Ditolak) */}
              <div className="col-lg-6 col-md-6 col-sm-12 d-flex">

                <div
                  className="white-box lapangan-dashboard-card lapangan-chart-card dashboard-action-card w-100"
                  onClick={goToLaporanKonservasi}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault()
                      goToLaporanKonservasi()
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  aria-label="Status laporan konservasi, klik untuk melihat detail"
                >

                  <h5
                    className="lapangan-card-title"
                  >
                    Status Laporan
                  </h5>

                  <div className="lapangan-pie-chart">

                    <Pie
                      data={{
                        labels: ['Diterima', 'Ditolak'],
                        datasets: [
                          {
                            data: [
                              // Diterima: dari summary disetujui
                              summary.disetujui || 0,
                              // Ditolak: filter laporan dengan status = 2
                              data.ditolak || 0
                            ],
                            backgroundColor: [
                              '#2563eb',
                              '#e11d48'
                            ]
                          }
                        ]
                      }}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            position: 'right'
                          }
                        }
                      }}
                    />

                  </div>
                </div>
              </div>
            </div>

            {/* ── LINE CHART: Pelaporan Kegiatan per Bulan ── */}
            <div className="dashboard-insight-grid">
              <div className="white-box dashboard-overview-card" role="button" tabIndex={0} aria-label={`Laporan bulan ini: ${laporanBulanIni} laporan`} onClick={goToLaporanKonservasi} onKeyDown={(event) => openWithKeyboard(event, goToLaporanKonservasi)}>
                <div className="dashboard-overview-main">
                  <span className="dashboard-overview-label">Laporan Bulan Ini</span>
                  <strong>{laporanBulanIni}</strong>
                  <small className={selisihBulanan >= 0 ? 'text-success' : 'text-danger'}>
                    {selisihBulanan >= 0 ? '+' : '-'}{Math.abs(selisihBulanan)} dari bulan lalu
                  </small>
                </div>
              </div>

              <div className="white-box dashboard-overview-card" role="button" tabIndex={0} aria-label={`Status pending: ${laporanPending} laporan`} onClick={goToLaporanKonservasi} onKeyDown={(event) => openWithKeyboard(event, goToLaporanKonservasi)}>
                <div className="dashboard-overview-main">
                  <span className="dashboard-overview-label">Status Pending</span>
                  <strong>{laporanPending}</strong>
                  <small>Laporan yang masih perlu tindak lanjut</small>
                </div>
              </div>

              <div className="white-box dashboard-overview-card" role="button" tabIndex={0} aria-label={`Tingkat persetujuan: ${approvalRate}%`} onClick={goToLaporanKonservasi} onKeyDown={(event) => openWithKeyboard(event, goToLaporanKonservasi)}>
                <div className="dashboard-overview-main">
                  <span className="dashboard-overview-label">Tingkat Persetujuan</span>
                  <strong>{approvalRate}%</strong>
                  <small>{laporanDisetujui} laporan disetujui</small>
                </div>
                <div className="dashboard-progress" aria-label="Progress persetujuan laporan">
                  <span style={{ width: `${approvalRate}%` }}></span>
                </div>
              </div>
            </div>

            <div className="row g-3" style={{ marginTop: '16px' }}>
              <div className="col-12">
                <div className="white-box dashboard-insight-card" role="button" tabIndex={0} aria-label="Insight cepat dashboard" onClick={goToLaporanKonservasi} onKeyDown={(event) => openWithKeyboard(event, goToLaporanKonservasi)}>
                  <h5 className="lapangan-card-title" style={{ marginBottom: '12px' }}>Insight Cepat</h5>
                  <div className="dashboard-insight-list dashboard-insight-list-inline">
                    {quickInsights.map(item => (
                      <div className="dashboard-insight-item" key={item.title}>
                        <i className={`fas ${item.icon}`}></i>
                        <div>
                          <strong>{item.title}</strong>
                          <span>{item.text}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="row g-3" style={{ marginTop: '16px' }}>
              <div className="col-12">
                <div
                  className="white-box lapangan-dashboard-card lapangan-line-card"
                  role="button"
                  tabIndex={0}
                  aria-label="Grafik pelaporan kegiatan tahunan"
                  onClick={goToLaporanKonservasi}
                  onKeyDown={(event) => openWithKeyboard(event, goToLaporanKonservasi)}
                >
                  <h5
                    className="lapangan-card-title"
                    style={{ marginBottom: '12px' }}
                  >
                    Pelaporan Kegiatan
                  </h5>
                  <div className="lapangan-line-chart">
                    <Line
                      data={{
                        labels: [
                          'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
                          'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'
                        ],
                        datasets: [
                          {
                            label: 'Jumlah Laporan',
                            data: chartDataFix,
                            borderColor: '#0ea5e9',
                            backgroundColor: 'rgba(14,165,233,0.2)',
                            tension: 0.4,
                            fill: true
                          }
                        ]
                      }}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            position: 'bottom'
                          }
                        }
                      }}
                    />

                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {showAllDaerah && (
        <div className="dashboard-modal-overlay" onClick={() => setShowAllDaerah(false)}>
          <div className="dashboard-modal-card" onClick={(event) => event.stopPropagation()}>
            <div className="dashboard-modal-header">
              <div>
                <h3>Daerah Kawasan</h3>
                <p>Semua daerah dari laporan konservasi</p>
              </div>
              <button
                type="button"
                className="dashboard-modal-close"
                onClick={() => setShowAllDaerah(false)}
                aria-label="Tutup daftar daerah"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="dashboard-modal-list">
              {laporanDaerahList.map((item, index) => (
                <div className="dashboard-region-item" key={`${item.daerahLokasi}-${item.kabupaten}-${item.kecamatan}-${index}`}>
                  <span>{index + 1}</span>
                  <div>
                    <strong>{item.daerahLokasi}</strong>
                    <small>
                      {item.kabupaten} - {item.kecamatan}
                    </small>
                    <em>{item.jumlah} laporan konservasi</em>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
