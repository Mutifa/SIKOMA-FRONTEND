import React from 'react'
import Template from '../../layouts/Template.jsx'
import standarPelayananService from '../../services/standarPelayananServices.js'
import { sanitizeHtml } from '../../utils/sanitizeHtml.js'
import { successAlert, errorAlert } from '../../utils/alert.js'
import Swal from 'sweetalert2'

export default function StandarPelayanan() {
  const [website, setWebsite] = React.useState(null)
  const [form, setForm] = React.useState({ nama: '', email: '', nomor_hp: '', judul: '', pesan: '' })
  const [loading, setLoading] = React.useState(false)

  React.useEffect(() => {
    let mounted = true
    standarPelayananService.getWebsite().then(res => { if (mounted) setWebsite(res.data.website) })
    return () => { mounted = false }
  }, [])

  return (
    <Template title="Standar Pelayanan" active="standar-pelayanan">
      <div className="container-fluid page-header py-5 mb-5">
        <div className="container text-center py-5">
          <h1 className="display-3 text-white mb-4">Kontak Kami</h1>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb justify-content-center mb-0">
            
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
            <span dangerouslySetInnerHTML={{ __html: sanitizeHtml(website?.jambuka || '') }} />
          </div>
          <div className="col-lg-8">
            <div className="bg-light text-center p-4">
              <h1 className="mb-4 text-start m-0">Layanan Interaksi</h1>
              <p className="text-start">UPT KPH Tasik Besar Serkap menerima pertanyaan Anda, saran dan kritik dalam meningkatkan pelayanan kami</p>
              <form onSubmit={(e) => {
                e.preventDefault()

                // ── Validasi SweetAlert ──────────────────────────────
                if (!form.nama) {
                  Swal.fire({ icon: 'warning', title: 'Nama Kosong', text: 'Silakan masukkan nama lengkap Anda.' })
                  return
                }
                if (!form.email) {
                  Swal.fire({ icon: 'warning', title: 'Email Kosong', text: 'Silakan masukkan alamat email Anda.' })
                  return
                }
                if (!form.nomor_hp) {
                  Swal.fire({ icon: 'warning', title: 'Nomor HP Kosong', text: 'Silakan masukkan nomor HP Anda.' })
                  return
                }
                if (!form.judul) {
                  Swal.fire({ icon: 'warning', title: 'Judul Kosong', text: 'Silakan masukkan judul pesan Anda.' })
                  return
                }
                if (!form.pesan) {
                  Swal.fire({ icon: 'warning', title: 'Pesan Kosong', text: 'Silakan masukkan pesan Anda.' })
                  return
                }
                // ────────────────────────────────────────────────────

                setLoading(true)
                standarPelayananService.sendMessage(form)
                  .then(() => {
                    successAlert('Berhasil', 'Pesan anda telah terkirim.')
                    setForm({ nama: '', email: '', nomor_hp: '', judul: '', pesan: '' })
                  })
                  .catch(err => {
                    errorAlert('Gagal', err.response?.data?.message || 'Gagal mengirim pesan')
                  })
                  .finally(() => {
                    setLoading(false)
                  })
              }}>
                <div className="row g-3">
                  <div className="col-12 col-md-4">
                    <input type="text" name="nama" className="form-control border-0" placeholder="Nama Lengkap" style={{ height: 55 }} value={form.nama} onChange={e => setForm({ ...form, nama: e.target.value })} />
                  </div>
                  <div className="col-12 col-md-4">
                    <input type="email" name="email" className="form-control border-0" placeholder="Alamat Email" style={{ height: 55 }} value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                  </div>
                  <div className="col-12 col-md-4">
                    <input type="number" name="nomor_hp" className="form-control border-0" placeholder="Nomor HP" style={{ height: 55 }} value={form.nomor_hp} onChange={e => setForm({ ...form, nomor_hp: e.target.value })} />
                  </div>
                  <div className="col-12">
                    <input type="text" name="judul" className="form-control border-0" placeholder="Judul" style={{ height: 55 }} value={form.judul} onChange={e => setForm({ ...form, judul: e.target.value })} />
                  </div>
                  <div className="col-12">
                    <textarea name="pesan" className="form-control border-0" rows="4" placeholder="Pesan kamu" value={form.pesan} onChange={e => setForm({ ...form, pesan: e.target.value })}></textarea>
                  </div>
                  <div className="col-12">
                    <button className="btn btn-primary w-100 py-3" type="submit" disabled={loading}>
                      {loading ? 'Mengirim...' : 'Kirim'}
                    </button>
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