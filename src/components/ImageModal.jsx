import React from 'react'

/// ImageModal Component
// Menampilkan gambar dalam modal dengan latar belakang gelap
// Dapat ditutup dengan klik di luar gambar atau tombol close
export default function ImageModal({ src, onClose }) {
  if (!src) return null

  return (
    <div
      className="modal fade show"
      style={{ display: 'block', background: 'rgba(0,0,0,0.7)' }}
      onClick={onClose}
    >
      <div
        className="modal-dialog modal-dialog-centered modal-lg"
        onClick={(e) => e.stopPropagation()}
      >
        // Modal content dengan gambar dan tombol close
        <div className="modal-content bg-transparent border-0 shadow-none">
          <div className="modal-body text-center p-0">
            <img
              src={src}
              alt="Preview"
              className="img-fluid rounded"
              width={960}
              height={640}
              loading="lazy"
              decoding="async"
              style={{ maxHeight: '80vh', objectFit: 'contain' }}
            />
          </div>

        // Tombol close di pojok kanan atas
          <button
            className="btn btn-light position-absolute top-0 end-0 m-2"
            onClick={onClose}
          >
            ×
          </button>
        </div>
      </div>
    </div>
  )
}
