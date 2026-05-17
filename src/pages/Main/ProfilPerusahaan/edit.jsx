import React from 'react'

/**
 * EditProfilPerusahaan
 *
 * Props:
 *  - formData   : object  — state form saat ini
 *  - saving     : boolean — apakah sedang proses simpan
 *  - onChange   : fn(e)   — handler input teks / textarea
 *  - onFileChange: fn(e)  — handler input file
 *  - onSubmit   : fn(e)   — handler form submit
 *  - onClose    : fn()    — handler tutup modal (Batal / ×)
 */
export default function EditProfilPerusahaan({
  formData,
  saving,
  onChange,
  onFileChange,
  onSubmit,
  onClose,
}) {
  return (
    <div className="profil-modal-overlay">
      <div className="profil-modal-box">

        {/* Header */}
        <div className="profil-modal-header">
          <h5>Edit Profil Perusahaan</h5>
          <button className="profil-modal-close" onClick={onClose}>×</button>
        </div>

        <form onSubmit={onSubmit}>

          {/* Body */}
          <div className="profil-modal-body">
            <div className="row">

              <div className="col-md-6 mb-3">
                <label>Judul</label>
                <input
                  type="text"
                  className="form-control"
                  name="nama"
                  value={formData.nama}
                  onChange={onChange}
                />
              </div>

              <div className="col-md-6 mb-3">
                <label>Meta Deskripsi</label>
                <textarea
                  className="form-control"
                  name="deskripsi"
                  value={formData.deskripsi}
                  onChange={onChange}
                  rows={2}
                />
              </div>

              <div className="col-md-6 mb-3">
                <label>Meta Keyword</label>
                <input
                  type="text"
                  className="form-control"
                  name="keyword"
                  value={formData.keyword}
                  onChange={onChange}
                />
              </div>

              <div className="col-md-6 mb-3">
                <label>Alamat</label>
                <input
                  type="text"
                  className="form-control"
                  name="alamat"
                  value={formData.alamat}
                  onChange={onChange}
                />
              </div>

              <div className="col-md-6 mb-3">
                <label>Telepon</label>
                <input
                  type="text"
                  className="form-control"
                  name="telepon"
                  value={formData.telepon}
                  onChange={onChange}
                />
              </div>

              <div className="col-md-6 mb-3">
                <label>Email</label>
                <input
                  type="text"
                  className="form-control"
                  name="email"
                  value={formData.email}
                  onChange={onChange}
                />
              </div>

              <div className="col-md-6 mb-3">
                <label>Facebook</label>
                <input
                  type="text"
                  className="form-control"
                  name="facebook"
                  value={formData.facebook}
                  onChange={onChange}
                />
              </div>

              <div className="col-md-6 mb-3">
                <label>Instagram</label>
                <input
                  type="text"
                  className="form-control"
                  name="instagram"
                  value={formData.instagram}
                  onChange={onChange}
                />
              </div>

              <div className="col-md-12 mb-3">
                <label>WhatsApp</label>
                <input
                  type="text"
                  className="form-control"
                  name="wa"
                  value={formData.wa}
                  onChange={onChange}
                />
              </div>

              <div className="col-md-12 mb-3">
                <label>Google Maps</label>
                <input
                  type="text"
                  className="form-control"
                  name="gmaps"
                  value={formData.gmaps}
                  onChange={onChange}
                />
              </div>

              <div className="col-md-6 mb-3">
                <label>Logo Website</label>
                <input
                  type="file"
                  className="form-control"
                  name="logo"
                  accept="image/*"
                  onChange={onFileChange}
                />
              </div>

              <div className="col-md-6 mb-3">
                <label>Struktur Organisasi</label>
                <input
                  type="file"
                  className="form-control"
                  name="struktur"
                  accept="image/*"
                  onChange={onFileChange}
                />
              </div>

              <div className="col-12 mb-3">
                <label>Jam Operasional</label>
                <textarea
                  className="form-control"
                  name="jambuka"
                  value={formData.jambuka}
                  onChange={onChange}
                  rows={3}
                />
              </div>

              <div className="col-md-6 mb-3">
                <label>Visi</label>
                <textarea
                  className="form-control"
                  name="visi"
                  value={formData.visi}
                  onChange={onChange}
                  rows={4}
                />
              </div>

              <div className="col-md-6 mb-3">
                <label>Misi</label>
                <textarea
                  className="form-control"
                  name="misi"
                  value={formData.misi}
                  onChange={onChange}
                  rows={4}
                />
              </div>

            </div>
          </div>

          {/* Footer */}
          <div className="profil-modal-footer">
            <button
              type="button"
              className="btn-secondary-custom"
              onClick={onClose}
            >
              Batal
            </button>

            <button
              type="submit"
              className="btn-primary-custom"
              disabled={saving}
            >
              {saving ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>

        </form>

      </div>
    </div>
  )
}