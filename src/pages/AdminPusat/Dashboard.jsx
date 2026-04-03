import React from 'react'
import SuperadminLayout from '../../layouts/SuperadminLayout.jsx'
import api from '../../lib/api.js'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'
import { Bar } from 'react-chartjs-2'

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export default function SuperadminDashboard() {
  const [data, setData] = React.useState({
    customer: 0,
    laporanTerakhir: 0,
    laporanDisetujui: 0,
    laporanTahunan: {},
    daerah: []
  })
  const [error, setError] = React.useState('')
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    let mounted = true
    api.get('/api/superadmin/dashboard')
      .then(res => { 
        if (mounted) {
          setData(res.data)
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
  const tahunanChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'],
    datasets: [{
      label: 'Jumlah Laporan',
      data: [
        data.laporanTahunan[1] || 0,
        data.laporanTahunan[2] || 0,
        data.laporanTahunan[3] || 0,
        data.laporanTahunan[4] || 0,
        data.laporanTahunan[5] || 0,
        data.laporanTahunan[6] || 0,
        data.laporanTahunan[7] || 0,
        data.laporanTahunan[8] || 0,
        data.laporanTahunan[9] || 0,
        data.laporanTahunan[10] || 0,
        data.laporanTahunan[11] || 0,
        data.laporanTahunan[12] || 0
      ],
      backgroundColor: 'rgba(54, 162, 235, 0.7)',
      borderColor: 'rgba(54, 162, 235, 1)',
      borderWidth: 1
    }]
  }

  if (loading) {
    return (
      <SuperadminLayout title="Super Admin">
        <div className="d-flex justify-content-center">
          <div className="spinner-border" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      </SuperadminLayout>
    )
  }

  return (
    <SuperadminLayout title="Super Admin">
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
                <span className="counter text-primary">{data.laporanTerakhir}</span>
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
                <span className="counter text-success">{data.laporanDisetujui}</span>
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
                  {data.daerah.map((daerah, index) => (
                    <tr key={index}>
                      <td>{daerah}</td>
                      <td>
                        <button className="btn btn-success btn-sm">
                          <i className="fas fa-eye"></i> View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </SuperadminLayout>
  )
}