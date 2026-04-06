export default function Spinner({ show = true }) {
  if (!show) return null

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="spinner-border text-primary" />
    </div>
  )
}