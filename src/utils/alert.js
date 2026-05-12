import Swal from 'sweetalert2'

// ALERT KONFIRMASI DELETE
export const confirmDelete = async (
  title = 'Hapus Data?',
  text = 'Data akan dihapus permanen'
) => {

  return await Swal.fire({

    title,
    text,

    icon: 'warning',

    showCancelButton: true,

    confirmButtonColor: '#1a5c35',
    cancelButtonColor: '#d33',

    confirmButtonText: 'Ya, Hapus',
    cancelButtonText: 'Batal',

  })

}


// ALERT SUKSES
export const successAlert = (
  title = 'Berhasil',
  text = 'Data berhasil diproses'
) => {

  return Swal.fire({

    icon: 'success',

    title,
    text,

    timer: 1800,
    showConfirmButton: false,

  })

}


// ALERT ERROR
export const errorAlert = (
  title = 'Oops...',
  text = 'Terjadi kesalahan'
) => {

  return Swal.fire({

    icon: 'error',

    title,
    text,

  })

}


// ======================================================
// ALERT INPUT ALASAN PENOLAKAN
// ======================================================
export const rejectionReasonAlert = async () => {

  return await Swal.fire({

    title: 'Tolak Laporan',

    text: 'Masukkan alasan penolakan laporan',

    icon: 'warning',

    input: 'textarea',

    inputPlaceholder:
      'Contoh: Data lokasi belum lengkap...',

    inputAttributes: {
      'aria-label': 'Masukkan alasan penolakan'
    },

    showCancelButton: true,

    confirmButtonText: 'Kirim',
    cancelButtonText: 'Batal',

    confirmButtonColor: '#b91c1c',
    cancelButtonColor: '#6b7280',

    inputValidator: (value) => {

      if (!value) {
        return 'Alasan penolakan wajib diisi'
      }

    }

  })

}