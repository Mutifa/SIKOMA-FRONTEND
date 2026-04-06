import React from 'react'
import AdminPusatLayout from '../../layouts/AdminPusatLayout.jsx'
import api from '../../lib/api.js'

export default function Kawasan() {
  const [data, setData] = React.useState(null)
  const [error, setError] = React.useState('')
  const [loading, setLoading] = React.useState(true)
  const [saving, setSaving] = React.useState(false)
  const [formData, setFormData] = React.useState({
    deskripsi: '',
    luasKawasan: '',
    jenisKawasan: '',
    alamat: '',
    kondisi: '',
    status: '',
    gambar: null
  })

  // Function to strip HTML tags
  const stripHtmlTags = (html) => {
    if (!html) return ''
    return html.replace(/<[^>]*>/g, '')
  }

  React.useEffect(() => {
    let mounted = true
    api.get('/api/AdminPusat/kawasan')
      .then(res => { 
        if (mounted) {
          const kawasan = res.data.data || res.data
          console.log('Kawasan data received:', kawasan)
          if (kawasan && kawasan.length > 0) {
            console.log('First kawasan item:', kawasan[0])
            console.log('Gambar field:', kawasan[0].gambar)
            setData(kawasan[0])
            setFormData({
              deskripsi: stripHtmlTags(kawasan[0].deskripsi) || '',
              luasKawasan: kawasan[0].luasKawasan || '',
              jenisKawasan: kawasan[0].jenisKawasan || '',
              alamat: kawasan[0].alamat || '',
              kondisi: kawasan[0].kondisi || '',
              status: kawasan[0].status || '',
              gambar: null
            })
          }
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

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleFileChange = (e) => {
    const { name, files } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: files[0] || null
    }))
  }

  const handleDelete = async () => {
    if (window.confirm('Apakah Anda yakin ingin menghapus kawasan konservasi ini?')) {
      try {
        await api.delete(`/api/AdminPusat/kawasan/${data.id}`)
        setData(null)
        setFormData({
          deskripsi: '',
          luasKawasan: '',
          jenisKawasan: '',
          alamat: '',
          kondisi: '',
          status: '',
          gambar: null
        })
      } catch (err) {
        setError(err.response?.data?.message || 'Gagal menghapus kawasan')
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')

    try {
      const formDataToSend = new FormData()
      
      // Add all required fields explicitly
      formDataToSend.append('deskripsi', formData.deskripsi || '')
      formDataToSend.append('luasKawasan', formData.luasKawasan || '')
      formDataToSend.append('jenisKawasan', formData.jenisKawasan || '')
      formDataToSend.append('alamat', formData.alamat || '')
      formDataToSend.append('kondisi', formData.kondisi || '')
      formDataToSend.append('status', formData.status || '')

      // Add file if it exists
      if (formData.gambar) formDataToSend.append('gambar', formData.gambar)
      
      // Debug log FormData
      console.log('FormData contents:')
      for (let [key, value] of formDataToSend.entries()) {
        console.log(key, value)
      }

      if (data) {
        // Update existing - Laravel workaround: use POST with _method for file uploads
        formDataToSend.append('_method', 'PUT')
        await api.post(`/api/AdminPusat/kawasan/${data.id}`, formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
      } else {
        // Create new
        await api.post('/api/AdminPusat/kawasan', formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
      }
      
      // Reload data
      const res = await api.get('/api/AdminPusat/kawasan')
      const kawasan = res.data.data || res.data
      if (kawasan && kawasan.length > 0) {
        setData(kawasan[0])
        setFormData(prev => ({
          deskripsi: stripHtmlTags(kawasan[0].deskripsi) || '',
          luasKawasan: kawasan[0].luasKawasan || '',
          jenisKawasan: kawasan[0].jenisKawasan || '',
          alamat: kawasan[0].alamat || '',
          kondisi: kawasan[0].kondisi || '',
          status: kawasan[0].status || '',
          gambar: null
        }))
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal menyimpan data kawasan')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <AdminPusatLayout title="Kawasan Konservasi">
        <div className="d-flex justify-content-center">
          <div className="spinner-border" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      </AdminPusatLayout>
    )
  }

  return (
    <AdminPusatLayout title="Kawasan Konservasi">
      {error && <div className="alert alert-danger alert-dismissible fade show" role="alert">
        {error}
        <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>}
      
      <div className="white-box">
        <h3 className="box-title mb-4">Kawasan Konservasi</h3>

        <form onSubmit={handleSubmit}>
          {data && data.gambar && (
            <center>
              <img 
                src={`/img/${data.gambar}`} 
                alt="foto kawasan konservasi"
                className="img-fluid mb-5" 
                style={{ maxHeight: '120px' }}
                onLoad={() => {
                  console.log('Gambar berhasil dimuat:', `/img/${data.gambar}`)
                }}
                onError={(e) => {
                  console.log('Error loading image:', `/img/${data.gambar}`)
                  e.target.style.display = 'none'
                  const fallback = e.target.parentNode.querySelector('.fallback-text')
                  if (fallback) fallback.style.display = 'block'
                }}
              />
              <div 
                className="fallback-text text-muted" 
                style={{display: 'none'}}
              >
                <i className="fas fa-image fa-3x mb-2"></i><br />
                Foto kawasan konservasi tidak tersedia
              </div>
            </center>
          )}

          <div className="row">
            <div className="col-lg-6">
              <div className="form-group mb-3">
                <label className="form-label">Luas kawasan</label>
                <input
                  type="text"
                  className="form-control"
                  name="luasKawasan"
                  value={formData.luasKawasan}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group mb-3">
                <label className="form-label">Jenis kawasan</label>
                <input
                  type="text"
                  className="form-control"
                  name="jenisKawasan"
                  value={formData.jenisKawasan}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group mb-3">
                <label className="form-label">Kondisi</label>
                <input
                  type="text"
                  className="form-control"
                  name="kondisi"
                  value={formData.kondisi}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="col-lg-6">
              <div className="form-group mb-3">
                <label className="form-label">Alamat</label>
                <textarea
                  className="form-control"
                  name="alamat"
                  value={formData.alamat}
                  onChange={handleChange}
                  rows="4"
                />
              </div>

              <div className="form-group mb-3">
                <label className="form-label">Status</label>
                <textarea
                  className="form-control"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  rows="4"
                />
              </div>
            </div>

            <div className="col-12">
              <div className="mb-3">
                <label className="form-label">Foto</label><br />
                <input
                  type="file"
                  className="form-control"
                  name="gambar"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                {formData.gambar && (
                  <div className="mt-2">
                    <img 
                      src={URL.createObjectURL(formData.gambar)} 
                      alt="Preview"
                      className="img-fluid" 
                      style={{ maxHeight: '120px' }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="form-group mb-3">
            <label className="form-label">Deskripsi</label>
            <textarea
              className="form-control"
              name="deskripsi"
              value={formData.deskripsi}
              onChange={handleChange}
              rows="6"
              placeholder="Masukkan deskripsi kawasan konservasi..."
            />
          </div>

          <div className="d-flex gap-2">
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={saving}
            >
              <i className="fas fa-save"></i> {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
            {data && (
              <button 
                type="button" 
                className="btn btn-danger"
                onClick={handleDelete}
                disabled={saving}
              >
                <i className="fas fa-trash"></i> Hapus Kawasan
              </button>
            )}
          </div>
        </form>
      </div>
    </AdminPusatLayout>
  )
}
