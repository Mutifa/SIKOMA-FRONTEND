import React from 'react'
import Template from '../../layouts/Template.jsx'
import api from '../../lib/api.js'

export default function StandarPelayanan() {
  const [website, setWebsite] = React.useState(null)
  const [form, setForm] = React.useState({ nama: '', email: '', nohp: '', judul: '', pesan: '' })
  const [message, setMessage] = React.useState('')
  const [error, setError] = React.useState('')

  React.useEffect(() => {
    let mounted = true
    api.get('/api/home').then(res => { if (mounted) setWebsite(res.data.website) })
    return () => { mounted = false }
  }, [])

  return (
    <Template title="Standar Pelayanan" active="standar-pelayanan">
      <div className="container-fluid page-header py-5 mb-5">
        <div className="container text-center py-5">
          <h1 className="display-3 text-white mb-4">Kontak Kami</h1>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb justify-content-center mb-0">
              <li className="breadcrumb-item"><a href="/">Home</a></li>
              <li className="breadcrumb-item active" aria-current="page">Kontak</li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="container py-5">
        <div className="row g-4">
          <div className="col-lg-4">
            <h6 className="text-secondary text-uppercase">Terhubung bersama kami</h6>
            <h1 className="mb-4">Informasi Layanan</h1>
            <p className="mb-2"><i className="fa fa-map-marker-alt me-3"></i>{website?.alamat}</p>
            <p className="mb-2"><i className="fa fa-phone-alt me-3"></i>{website?.telepon}</p>
            <p className="mb-4"><i className="fa fa-envelope me-3"></i>{website?.email}</p>
            <h4>Jam Operasional</h4>
            <span dangerouslySetInnerHTML={{ __html: website?.jambuka || '' }} />
          </div>
          <div className="col-lg-8">
            <div className="bg-light text-center p-4">
              <h1 className="mb-4 text-start m-0">Layanan Interaksi</h1>
              <p className="text-start">UPT KPH Tasik Besar Serkap menerima pertanyaan Anda, saran dan kritik dalam meningkatkan pelayanan kami</p>
              {message && <div className="alert alert-success text-start">{message}</div>}
              {error && <div className="alert alert-danger text-start">{error}</div>}
              <form onSubmit={(e)=>{
                e.preventDefault(); setMessage(''); setError('');
                api.post('/api/simpan-pesan', form)
                  .then(()=>{ setMessage('Pesan anda telah terkirim.'); setForm({ nama:'', email:'', nohp:'', judul:'', pesan:'' }) })
                  .catch(err=> setError(err.response?.data?.message || 'Gagal mengirim pesan'))
              }}>
                <div className="row g-3">
                  <div className="col-12 col-md-4">
                    <input type="text" name="nama" className="form-control border-0" placeholder="Nama Lengkap" style={{height:55}} value={form.nama} onChange={e=>setForm({...form, nama:e.target.value})} />
                  </div>
                  <div className="col-12 col-md-4">
                    <input type="email" name="email" className="form-control border-0" placeholder="Alamat Email" style={{height:55}} value={form.email} onChange={e=>setForm({...form, email:e.target.value})} />
                  </div>
                  <div className="col-12 col-md-4">
                    <input type="number" name="nohp" className="form-control border-0" placeholder="Nomor HP" style={{height:55}} value={form.nohp} onChange={e=>setForm({...form, nohp:e.target.value})} />
                  </div>
                  <div className="col-12">
                    <input type="text" name="judul" className="form-control border-0" placeholder="Judul" style={{height:55}} value={form.judul} onChange={e=>setForm({...form, judul:e.target.value})} />
                  </div>
                  <div className="col-12">
                    <textarea name="pesan" className="form-control border-0" rows="4" placeholder="Pesan kamu" value={form.pesan} onChange={e=>setForm({...form, pesan:e.target.value})}></textarea>
                  </div>
                  <div className="col-12">
                    <button className="btn btn-primary w-100 py-3" type="submit">Kirim</button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Template>
  )
}


