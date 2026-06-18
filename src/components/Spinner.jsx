export default function Spinner({ show = true }) {
  if (!show) return null

  // Spinner Component
  // Menampilkan animasi loading saat data sedang dimuat
  // Dapat digunakan di berbagai halaman untuk indikasi loading
  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="spinner-border text-primary" />
    </div>
  )
}