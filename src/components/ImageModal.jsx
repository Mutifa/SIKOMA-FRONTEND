import React from 'react'

export default function ImageModal({ src, onClose }) {
  return (
    <div className="modal fade show" style={{display:'block'}} tabIndex="-1" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content bg-transparent border-0 shadow-none">
          <div className="modal-body text-center p-0">
            <img src={src} alt="Preview" className="img-fluid rounded" />
          </div>
          <button type="button" className="btn btn-light position-absolute top-0 end-0 m-2" onClick={onClose}>×</button>
        </div>
      </div>
    </div>
  )
}


