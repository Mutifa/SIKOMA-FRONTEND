import React from 'react'
import AdminPusatLayout from '../../layouts/AdminPusatLayout.jsx'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'
import { Bar } from 'react-chartjs-2'
import { dashboardService } from '../../services/dashboardService.js'
// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

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
      <AdminPusatLayout title="Admin Pusat">
        <div className="d-flex justify-content-center">
          <div className="spinner-border" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      </AdminPusatLayout>
    )
  }

  return (
    <AdminPusatLayout title="Admin Pusat">
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row">
        {/* Summary Cards */}
        <div className="col-lg-4 col-md-6 col-sm-12">
          <div className="white-box analytics-info">
            <h3 className="box-title">Pelaporan Konservasi</h3>
            <h4 className="text-muted">Bulan ini</h4>
            <ul className="list-inline two-part d-flex align-items-center mb-0">
              <li>
                <i className="fas fa-file-lines text-primary fa-2x ms-1"></i>
              </li>
              <li className="ms-auto">
                <span className="counter text-primary">{summary.total_laporan || 0} </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="col-lg-4 col-md-6 col-sm-12">
          <div className="white-box analytics-info">
            <h3 className="box-title">Laporan Konservasi Disetujui</h3>
            <ul className="list-inline two-part d-flex align-items-center mb-0">
              <li>
                <i className="fas fa-check-circle text-success fa-2x ms-1"></i>
              </li>
              <li className="ms-auto">
                <span className="counter text-success">{summary.disetujui || 0} </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="col-lg-4 col-md-6 col-sm-12">
          <div className="white-box analytics-info">
            <h3 className="box-title">Feedback</h3>
            <h4 className="text-muted">Standar Pelayanan</h4>
            <ul className="list-inline two-part d-flex align-items-center mb-0">
              <li>
                <i className="fas fa-clipboard-list text-warning fa-2x ms-1"></i>
              </li>
              <li className="ms-auto">
                <span className="counter text-warning">0</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="row mt-4">
        {/* Laporan Tahun 2025 Chart */}
        <div className="col-lg-8 col-md-12">
          <div className="white-box">
            <h3 className="box-title">Laporan Tahun 2025</h3>
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

        {/* Daerah */}
        <div className="col-lg-4 col-md-12">
          <div className="white-box">
            <h3 className="box-title">Daerah</h3>
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
                      <td colSpan="2">Tidak ada data</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </AdminPusatLayout>
  )
}