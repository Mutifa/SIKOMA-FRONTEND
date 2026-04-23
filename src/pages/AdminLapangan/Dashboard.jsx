import React from 'react'
import AdminLapanganLayout from '../../layouts/AdminLapanganLayout.jsx'
import api from '../../lib/api.js'
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js'
import { Pie, Bar } from 'react-chartjs-2'
import { dashboardService } from '../../services/dashboardService'


// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement)

export default function AdminLapanganDashboard() {
  const [data, setData] = React.useState({ 
    laporan: [], 
    laporanDisetujui: 0, 
    laporanDitolak: 0,
    laporanPerDaerah: {}
  })
  const [error, setError] = React.useState('')
  const [loading, setLoading] = React.useState(true)

React.useEffect(() => {
  let mounted = true

  dashboardService.getAdminLapangan() // ✅ PAKAI SERVICE
    .then(res => {
      if (mounted) {
     setData(res.data.data || res.data)
        setLoading(false)
      }
    })
    .catch(err => {
      if (mounted) {
        setError(err.response?.data?.message || 'Gagal memuat')
        setLoading(false)
      }
    })

  return () => {
    mounted = false
  }
}, [])

  // Chart data untuk status laporan (pie chart)
  const statusChartData = {
    labels: ['Disetujui', 'Ditolak'],
    datasets: [{
      data: [data.laporanDisetujui || 0, data.laporanDitolak || 0],
      backgroundColor: [
        'rgba(54, 162, 235, 0.7)', // biru
        'rgba(255, 99, 132, 0.7)' // merah
      ],
      borderColor: [
        'rgba(54, 162, 235, 1)',
        'rgba(255, 99, 132, 1)'
      ],
      borderWidth: 1
    }]
  }

  // Chart data untuk laporan per daerah (bar chart)
  const daerahChartData = {
    labels: Object.keys(data.laporanPerDaerah || {}),
    datasets: [{
      label: 'Jumlah Laporan',
      data: Object.values(data.laporanPerDaerah || {}),
      backgroundColor: [
        'rgba(255, 99, 132, 0.7)',
        'rgba(54, 162, 235, 0.7)',
        'rgba(255, 206, 86, 0.7)',
        'rgba(75, 192, 192, 0.7)',
        'rgba(153, 102, 255, 0.7)',
        'rgba(255, 159, 64, 0.7)'
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)'
      ],
      borderWidth: 1
    }]
  }

  if (loading) {
    return (
      <AdminLapanganLayout title="Dashboard Admin Lapangan">
        <div className="d-flex justify-content-center">
          <div className="spinner-border" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      </AdminLapanganLayout>
    )
  }

  return (
    <AdminLapanganLayout title="Dashboard Admin Lapangan">
      {error && <div className="alert alert-danger">{error}</div>}
      
      <div className="row">
        <div className="col-lg-6 col-md-12">
          <div className="white-box analytics-info">
            <h3 className="box-title">Laporan Konservasi</h3>
            <ul className="list-inline two-part d-flex align-items-center mb-0">
              <li>
                <i className="fas fa-file-lines text-primary fa-2x ms-1"></i>
              </li>
              <li className="ms-auto">
                <span className="counter text-primary">{data.laporan?.length || 0}</span>
              </li>
            </ul>
            <p className="mb-0 mt-3">Jumlah Laporan Kegiatan</p>
          </div>
        </div>
        
        <div className="col-lg-6 col-md-12">
          <div className="white-box">
            <h3 className="box-title">Status Laporan</h3>
            <div style={{ maxWidth: '250px', maxHeight: '250px', margin: 'auto' }}>
              <Pie 
                data={statusChartData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'right',
                      labels: {
                        usePointStyle: true,
                        padding: 20
                      }
                    }
                  }
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="row mt-4">
        <div className="col-12">
          <div className="white-box">
            <h3 className="box-title">Pelaporan Kegiatan</h3>
            <div style={{ height: '400px' }}>
              <Bar 
                data={daerahChartData}
                options={{
                  responsive: true,
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
      </div>
    </AdminLapanganLayout>
  )
}


