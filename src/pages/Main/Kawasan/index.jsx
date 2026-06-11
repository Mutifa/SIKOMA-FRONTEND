import React from 'react'
import { Link } from 'react-router-dom'
import DashboardLayout from '../../../layouts/DashboardLayout'
import kawasanService from '../../../services/kawasanService'

export default function Kawasan() {

  const [data, setData] = React.useState(null)
  const [error, setError] = React.useState('')
  const [loading, setLoading] = React.useState(true)

  const stripHtmlTags = (html) => {
    if (!html) return ''
    return html.replace(/<[^>]*>/g, '')
  }

  React.useEffect(() => {
    kawasanService.getAll()
      .then(res => {
        const kawasan = res.data.data || res.data
        if (kawasan && kawasan.length > 0) {
          setData(kawasan[0])
        }
        setLoading(false)
      })
      .catch(err => {
        setError(err.response?.data?.message || 'Gagal memuat')
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <DashboardLayout title="Kawasan Konservasi">
        <div className="d-flex justify-content-center">
          <div className="spinner-border"></div>
        </div>
      </DashboardLayout>
    )
  }

  return (

    <DashboardLayout title="Kawasan Konservasi">

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="white-box">

        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="box-title mb-0">
            Kelola halaman kawasan konservasi
          </div>

          {data && (
            <Link
              to={`/kawasan/edit/${data.id}`}
              className="btn-primary-custom"
            >
              <i className="fas fa-pen"></i>
              Edit Kawasan
            </Link>
          )}
        </div>

        {/* Foto */}
        <div className="row mt-3">
          <div className="col-md-12 mb-3">
            <label className="form-label">Foto Kawasan</label>
            <div
              className="form-control d-flex align-items-center justify-content-center"
              style={{ height: '150px', background: '#f8f9fa' }}
            >
              {data?.gambar ? (
                <img
                  src={`https://codemy.my.id/uploads/kawasan/${data.gambar}`}
                  alt="Foto Kawasan"
                  width={240}
                  height={120}
                  loading="lazy"
                  decoding="async"
                  style={{ width: 'auto', maxHeight: '120px', objectFit: 'contain' }}
                />
              ) : (
                <span className="text-muted">Tidak ada gambar</span>
              )}
            </div>
          </div>
        </div>

        <div className="row mt-3">
          <div className="col-md-6 mb-3">
            <label className="form-label">Luas Kawasan</label>
            <div className="form-control" style={{ background: '#f8f9fa' }}>{data?.luasKawasan || '-'}</div>
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Jenis Kawasan</label>
            <div className="form-control" style={{ background: '#f8f9fa' }}>{data?.jenisKawasan || '-'}</div>
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Kondisi</label>
            <div className="form-control" style={{ background: '#f8f9fa' }}>{data?.kondisi || '-'}</div>
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Alamat</label>
            <div className="form-control" style={{ background: '#f8f9fa' }}>{data?.alamat || '-'}</div>
          </div>
          <div className="col-md-12 mb-3">
            <label className="form-label">Status</label>
            <div className="form-control" style={{ background: '#f8f9fa' }}>{data?.status || '-'}</div>
          </div>
          <div className="col-md-12 mb-3">
            <label className="form-label">Deskripsi</label>
            <div className="form-control" style={{ background: '#f8f9fa' }}>{stripHtmlTags(data?.deskripsi) || '-'}</div>
          </div>
        </div>

      </div>

    </DashboardLayout>

  )
}
