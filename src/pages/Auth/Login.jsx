import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Template from '../../layouts/Template.jsx'
import { useAuth } from '../../contexts/AuthContext.jsx'
import api from '../../lib/api.js'

export default function Login() {

  // State untuk menyimpan input email
  const [email, setEmail] = React.useState('')

  // State untuk menyimpan input password
  const [password, setPassword] = React.useState('')

  // State untuk menampilkan pesan error
  const [error, setError] = React.useState('')

  // State untuk loading saat proses login
  const [loading, setLoading] = React.useState(false)
  
  // Mengambil fungsi login dari context auth
  const { login } = useAuth()

  // Hook untuk navigasi halaman
  const navigate = useNavigate()

  // Mengambil lokasi saat ini (digunakan untuk redirect)
  const location = useLocation()
  
  // Menentukan halaman tujuan setelah login (default ke '/')
  const from = location.state?.from?.pathname || '/'


  // Function ketika form disubmit
  async function onSubmit(e) {
    e.preventDefault() // Mencegah reload halaman
    setError('') // Reset error
    setLoading(true) // Aktifkan loading

    try {
      // Panggil fungsi login (biasanya ke API backend)
      const result = await login(email, password)

      // Jika login berhasil
      if (result.success) {
        // Redirect ke halaman sesuai role / response backend
        navigate(result.redirect)
      } else {
        // Jika gagal, tampilkan pesan error dari backend
        setError(result.message)
      }

    } catch (err) {
      // Jika terjadi error sistem (server/down/dll)
      console.error(err)
      setError('Terjadi kesalahan saat login')
    } finally {
      // Matikan loading apapun hasilnya
      setLoading(false)
    }
  }

  return (
    <Template title="Login">
      <section className="container py-5" style={{maxWidth:480}}>

        {/* Judul halaman */}
        <h1 className="mb-4">Login</h1>

        {/* Menampilkan error jika ada */}
        {error && <div className="alert alert-danger">{error}</div>}

        {/* Form login */}
        <form onSubmit={onSubmit}>

          {/* Input Email */}
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input 
              type="email" 
              className="form-control" 
              value={email} 
              onChange={e=>setEmail(e.target.value)} 
            />
          </div>

          {/* Input Password */}
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input 
              type="password" 
              className="form-control" 
              value={password} 
              onChange={e=>setPassword(e.target.value)} 
            />
          </div>

          {/* Tombol submit */}
          <button 
            type="submit" 
            className="btn btn-success w-100" 
            disabled={loading}
          >
            {loading ? (
              <>
                {/* Spinner saat loading */}
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Loading...
              </>
            ) : (
              // Teks tombol normal
              'Masuk'
            )}
          </button>
        </form>
      </section>
    </Template>
  )
}