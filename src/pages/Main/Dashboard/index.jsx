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
  Legend
} from 'chart.js'
import "../../../assets/css/Dashboard.css";
import { Bar, Pie, Line } from 'react-chartjs-2'
import { dashboardService } from '../../../services/dashboardService.js'
import DashboardLayout from '../../../layouts/DashboardLayout'
import { useAuth } from '../../../contexts/AuthContext'


// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
)

export default function AdminPusatDashboard() {
  const [data, setData] = React.useState({
    customer: 0,
    laporanTerakhir: 0,
    laporanDisetujui: 0,
    laporanTahunan: {},
    daerah: []
  })

  const [error, setError] = React.useState('')
  const [loading, setLoading] = React.useState(true)

  // ✅ INI POINT 1 (TAMBAHKAN DI SINI)
  const summary = {
    total_laporan: data.laporanTerakhir,
    disetujui: data.laporanDisetujui
  }

  const chart = data.laporanTahunan || {}
  const daerahList = data.daerah || []

  const { user } = useAuth()
  const isAdminPusat =
  user?.role === 'admin_pusat' ||
  user?.role === 'AdminPusat'

  const isAdminLapangan =
  user?.role === 'admin_lapangan' ||
  user?.role === 'AdminLapangan'

  // ⬇️ BARU INI useEffect
  React.useEffect(() => {
    let mounted = true

    dashboardService.getAdminPusat()
      .then(res => {
        if (mounted) {

          setData(res.data.data || res.data) // ✅ FIX
          setLoading(false)
        }
      })
      .catch(err => {
        if (mounted) {
          setError(err.response?.data?.message || 'Gagal memuat')
          setLoading(false)
        }
      })

    return () => { mounted = false }
  }, [])

  // Chart data untuk laporan tahunan
  const totalSemua = Object.values(chart).reduce((a, b) => a + b, 0)

  const bulanMap = {
    Jan: 0, Feb: 1, Mar: 2, Apr: 3, Mei: 4, Jun: 5,
    Jul: 6, Agu: 7, Sep: 8, Okt: 9, Nov: 10, Des: 11
  }

  const chartDataFix = Array(12).fill(0)

  Object.entries(chart).forEach(([bulan, total]) => {
    const index = parseInt(bulan) - 1
    if (index >= 0 && index < 12) {
      chartDataFix[index] = total
    }
  })

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
  if (loading) {
    return (
      <DashboardLayout>
        <div style={{ padding: '20px' }}>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout title="Dashboard">
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="row">

        {/* --------------Summary Cards -------------*/}
          {/* =============================
    DASHBOARD ADMIN PUSAT
============================= */}
{isAdminPusat && (

  <>

    {/* SUMMARY */}
    <div className="row">

      <div className="col-lg-4 col-md-6 col-sm-12">

        <div className="white-box analytics-info p-4" style={{ borderRadius: '15px' }}>

          <div className="d-flex justify-content-between align-items-start">

            <div>
              <h5 className="mb-1 text-muted">
                Pelaporan Konservasi
              </h5>
            </div>

            <div className="text-primary fs-2">
              <i className="fas fa-archive"></i>
            </div>

          </div>

          <div className="mt-3">

            <h2 className="fw-bold">
              {summary.total_laporan || 0}
            </h2>

            <small className="text-muted">
              30 Hari Terakhir
            </small>

          </div>

        </div>

      </div>

      <div className="col-lg-4 col-md-6 col-sm-12">

        <div className="white-box analytics-info p-4" style={{ borderRadius: '15px' }}>

          <div className="d-flex justify-content-between align-items-start">

            <div>
              <h5 className="mb-1 text-muted">
                Pelaporan Konservasi
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
              0
            </h2>

            <small className="text-muted">
              Standar Pelayanan
            </small>

          </div>

        </div>

      </div>

    </div>

    {/* CHART + DAERAH */}
    <div className="row mt-4">

      {/* CHART */}
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

      {/* DAERAH */}
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

                {daerahList && daerahList.length > 0 ? (

                  daerahList.map((item, index) => (

                    <tr key={index}>
                      <td>{item}</td>
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


{/* =============================
    DASHBOARD ADMIN LAPANGAN
============================= */}
{isAdminLapangan && (

  <>

    {/* CARD SUMMARY */}
    <div className="row">

      {/* TOTAL LAPORAN */}
      <div className="col-lg-6 col-md-6 col-sm-12">

        <div
          className="white-box p-4"
          style={{
            borderRadius: '18px',
            minHeight: '170px'
          }}
        >

          <div className="d-flex justify-content-between align-items-start">

            <div>

              <h5
                className="mb-1 text-muted"
                style={{
                  fontWeight: '600'
                }}
              >
                Jumlah Laporan Kegiatan
              </h5>

            </div>

            <div
              style={{
                background: '#1f3a68',
                width: '58px',
                height: '58px',
                borderRadius: '10px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >

              <i
                className="fas fa-archive"
                style={{
                  color: '#fff',
                  fontSize: '26px'
                }}
              ></i>

            </div>

          </div>

          <div className="mt-4">

            <h2
              className="fw-bold"
              style={{
                fontSize: '42px',
                color: '#2d0c73'
              }}
            >
              {summary.total_laporan || 0}
            </h2>

            <small className="text-muted">
              Jumlah laporan kegiatan
            </small>

          </div>

        </div>

      </div>

      {/* STATUS PIE */}
      <div className="col-lg-6 col-md-6 col-sm-12">

        <div
          className="white-box p-4"
          style={{
            borderRadius: '18px',
            minHeight: '170px'
          }}
        >

          <h5
            className="mb-3"
            style={{
              fontWeight: '600'
            }}
          >
            Status Laporan
          </h5>

          <div
            style={{
              height: '220px'
            }}
          >

            <Pie
              data={{
                labels: ['Diterima', 'Ditolak'],
                datasets: [
                  {
                    data: [
                      summary.disetujui || 0,
                      (data.laporan || []).filter(item => item.status === 2).length
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

    {/* CHART */}
    <div className="row mt-4">

      <div className="col-12">

        <div
          className="white-box p-4"
          style={{
            borderRadius: '18px'
          }}
        >

          <h5
            className="mb-3"
            style={{
              fontWeight: '600'
            }}
          >
            Pelaporan Kegiatan
          </h5>

          <div
            style={{
              height: '420px'
            }}
          >

            <Line
              data={{
                labels: [
                  'Jan',
                  'Feb',
                  'Mar',
                  'Apr',
                  'Mei',
                  'Jun',
                  'Jul',
                  'Agu',
                  'Sep',
                  'Okt',
                  'Nov',
                  'Des'
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