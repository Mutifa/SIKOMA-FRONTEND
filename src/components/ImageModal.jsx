import React from 'react'

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
