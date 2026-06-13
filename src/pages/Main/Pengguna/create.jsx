import React from 'react'
import { useNavigate, Link } from 'react-router-dom'
import DashboardLayout from '../../../layouts/DashboardLayout'
import { penggunaService } from '../../../services/penggunaService'
import {
    successAlert,
    errorAlert,
    rejectionReasonAlert
} from '../../../utils/alert'

export default function PenggunaCreate() {
    const navigate = useNavigate()

    // ── State form data pengguna baru ────────────────────────────────────────
    const [formData, setFormData] = React.useState({
        name: '',
        username: '',
        email: '',
        password: '',
        role: 'admin_lapangan'
    })

    // ── Validasi semua field sebelum submit ke API ───────────────────────────
    const validateForm = () => {

        // Nama wajib diisi
        if (!formData.name.trim()) {
            errorAlert('Validasi', 'Nama wajib diisi')
            return false
        }

        // Username wajib diisi, minimal 3 karakter
        if (!formData.username.trim()) {
            errorAlert('Validasi', 'Username wajib diisi')
            return false
        }
        if (formData.username.trim().length < 3) {
            errorAlert('Validasi', 'Username minimal 3 karakter')
            return false
        }

        // Email wajib diisi dan format harus valid
        if (!formData.email.trim()) {
            errorAlert('Validasi', 'Email wajib diisi')
            return false
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(formData.email)) {
            errorAlert('Validasi', 'Format email tidak valid')
            return false
        }

        // Password wajib diisi, minimal 8 karakter (sesuai validasi backend)
        if (!formData.password) {
            errorAlert('Validasi', 'Password wajib diisi')
            return false
        }
        if (formData.password.length < 8) {
            errorAlert('Validasi', 'Password minimal 8 karakter')
            return false
        }

        // Semua validasi lolos
        return true
    }

    // ── Handle submit form ───────────────────────────────────────────────────
    const handleSubmit = async (e) => {
        e.preventDefault()

        // Jalankan validasi frontend terlebih dahulu, stop jika gagal
        if (!validateForm()) return

        try {
            // Kirim data pengguna baru ke API
            await penggunaService.create(formData)

            // Tampilkan notifikasi sukses lalu kembali ke halaman daftar pengguna
            await successAlert('Berhasil', 'Pengguna berhasil ditambahkan')
            navigate('/pengguna')
        } catch (err) {
            // Tampilkan pesan error dari backend jika request gagal
            const message =
                err.response?.data?.errors?.password?.[0] ||
                err.response?.data?.message ||
                'Gagal menyimpan data'
            await errorAlert('Gagal', message)
        }
    }

    return (
        <DashboardLayout 
            title="Tambah Pengguna"
            actions={
                <div className="d-flex gap-2 flex-wrap">
                    <button
                        type="submit"
                        form="pengguna-form"
                        className="btn btn-success"
                    >
                        Simpan
                    </button>

                    <Link
                        to="/pengguna"
                        className="btn btn-secondary"
                    >
                        Kembali
                    </Link>
                </div>
            }
        >

            <form id="pengguna-form" onSubmit={handleSubmit} autoComplete="off">
                <div className="white-box">

                 {/* ── Field Nama ── */}
<div className="mb-3">
  <label className="form-label">Nama</label>
  <input
    type="text"
    className="form-control"
    value={formData.name}
    autoComplete="off"
    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
  />
  <small className="text-muted">* Wajib diisi</small>
</div>

{/* ── Field Username ── */}
<div className="mb-3">
  <label className="form-label">Username</label>
  <input
    type="text"
    className="form-control"
    value={formData.username}
    autoComplete="off"
    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
  />
  <small className="text-muted">* Wajib diisi, minimal 3 karakter</small>
</div>

{/* ── Field Email ── */}
<div className="mb-3">
  <label className="form-label">Email</label>
  <input
    type="email"
    className="form-control"
    value={formData.email}
    autoComplete="off"
    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
  />
  <small className="text-muted">* Wajib diisi, contoh: nama@email.com</small>
</div>

{/* ── Field Password ── */}
<div className="mb-3">
  <label className="form-label">Password</label>
  <input
    type="password"
    className="form-control"
    value={formData.password}
    autoComplete="new-password"
    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
  />
  <small className="text-muted">* Wajib diisi, minimal 8 karakter</small>
</div>

                    {/* ── Field Role — default Admin Lapangan ── */}
                    <div className="mb-3">
                        <label className="form-label">
                            Role
                        </label>

                        <select
                            className="form-select"
                            value={formData.role}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    role: e.target.value
                                })
                            }
                        >
                            <option value="admin_lapangan">
                                Admin Lapangan
                            </option>

                            <option value="admin_pusat">
                                Admin Pusat
                            </option>
                        </select>
                    </div>

                </div>
            </form>
        </DashboardLayout>
    )
}