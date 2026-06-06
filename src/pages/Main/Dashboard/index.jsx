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

  // Ringkasan data yang digunakan di summary card
 const summary = {
  total_laporan: data.jumlahLaporan || data.laporanTerakhir,
  disetujui: data.diterima || data.laporanDisetujui
}

  // Data chart tahunan dan daftar daerah (dengan fallback ke default kosong)
  const daerahList = data.daerah || []

  const goToLaporanKonservasi = () => {
    navigate('/laporan-konservasi')
  }

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

    fetchData
      .then(res => {
        if (mounted) {
          const result = res.data.data || res.data
          if (result.daerah && !Array.isArray(result.daerah)) {
            result.daerah = [result.daerah]
          }
          setData(result)
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


  // Konfigurasi data Bar chart untuk Admin Pusat
  const tahunanChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'],
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

            {/* ── SUMMARY CARDS ── */}
            <div className="row g-4 align-items-stretch dashboard-lapangan-summary">

              {/* Card: Total Laporan (30 Hari Terakhir) */}
              <div className="col-lg-4 col-md-6 col-sm-12">

                <div className="white-box analytics-info p-4" style={{ borderRadius: '15px' }}>

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
                      30 Hari Terakhir
                    </small>

                  </div>

                </div>

              </div>

              {/* Card: Laporan Disetujui */}
              <div className="col-lg-4 col-md-6 col-sm-12">

                <div className="white-box analytics-info p-4" style={{ borderRadius: '15px' }}>

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
                      Laporan Disetujui
                    </small>

                  </div>

                </div>

              </div>

              {/* Card: Feedback (nilai statis 0, placeholder) */}
              <div className="col-lg-4 col-md-6 col-sm-12">

                <div className="white-box analytics-info p-4" style={{ borderRadius: '15px' }}>

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
            <div className="row mt-4">

              {/* Bar Chart: Laporan Tahunan */}
              <div className="col-lg-8 col-md-12">

                <div className="white-box">

                  <h3 className="box-title">
                    Laporan Tahun 2026
                  </h3>

                  <div style={{ height: '400px' }}>

                    <Bar
                      data={tahunanChartData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            position: 'top'
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

              {/* Tabel: Daftar Daerah Konservasi */}
              <div className="col-lg-4 col-md-12">

                <div className="white-box">

                  <h3 className="box-title">
                    Daerah
                  </h3>

                  <div className="table-responsive">

                    <table className="table">

                      <thead>
                        <tr>
                          <th>Daerah Konservasi</th>
                          <th>Aksi</th>
                        </tr>
                      </thead>

                      <tbody>

                        {/* Tampilkan list daerah jika ada, atau pesan kosong */}
                        {daerahList && daerahList.length > 0 ? (

                          daerahList.map((item, index) => (

                            <tr key={index}>
                              <td>{item.jenisKawasan}</td>
                              <td>-</td>
                            </tr>

                          ))

                        ) : (

                          <tr>
                            <td colSpan="2">
                              Tidak ada data
                            </td>
                          </tr>

                        )}

                      </tbody>

                    </table>

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

            {/* ── SUMMARY CARDS ── */}
            <div className="row">

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
            <div className="row mt-4">

              <div className="col-12">

                <div
                  className="white-box lapangan-dashboard-card lapangan-line-card"
                >

                  <h5
                    className="lapangan-card-title mb-3"
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

    </DashboardLayout>
  )
}
