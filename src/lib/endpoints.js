export const ENDPOINTS = {
AUTH: {
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  ME: '/admin_lapangan/profile' 
},

  LAPORAN: {
    GET: '/laporan',
    CREATE: '/laporan'
  },

  DASHBOARD: {
  ADMIN_PUSAT: '/admin_pusat/dashboard',
  ADMIN_LAPANGAN: '/admin_lapangan/dashboard'
},

  EDUKASI: {
    GET: '/edukasi'
  },

  HOME: {
    GET: '/home'
  },

  INFORMASI: {
    GET: '/informasi'
  },
  
  PESAN: {
    CREATE: '/simpan-pesan'
  },
  WEBSITE: {
  GET: '/admin_pusat/website',
  UPDATE: '/admin_pusat/website'
},
PROGRAM: {
  GET: '/admin_pusat/program',
  CREATE: '/admin_pusat/program',
  UPDATE: (id) => `/admin_pusat/program/${id}`,
  DELETE: (id) => `/admin_pusat/program/${id}`
},
KONTEN: {
  GET: '/admin_pusat/edukasi',
  CREATE: '/admin_pusat/edukasi',
  UPDATE: (id) => `/admin_pusat/edukasi/${id}`,
  DELETE: (id) => `/admin_pusat/edukasi/${id}`
},
KAWASAN: {
  GET: '/admin_pusat/kawasan',
  CREATE: '/admin_pusat/kawasan',
  UPDATE: (id) => `/admin_pusat/kawasan/${id}`,
  DELETE: (id) => `/admin_pusat/kawasan/${id}`
},
LAPORAN_ADMIN: {
  GET: '/laporan-konservasi',
  CREATE: '/laporan-konservasi',
  UPDATE: (id) => `/laporan-konservasi/${id}`,
  DELETE: (id) => `/laporan-konservasi/${id}`,
  UPDATE_STATUS: (id) => `/laporan-konservasi/${id}/status`,
  DETAIL_LAPORAN: (id) => `/laporan-konservasi/${id}`
},
PERATURAN: {
  GET: '/admin_pusat/peraturan',
  CREATE: '/admin_pusat/peraturan',
  UPDATE: (id) => `/admin_pusat/peraturan/${id}`,
  DELETE: (id) => `/admin_pusat/peraturan/${id}`
},
GALERI: {
  GET: '/admin_pusat/galeri',
  CREATE: '/admin_pusat/galeri',
  DELETE: (id) => `/admin_pusat/galeri/${id}`
},
PENGGUNA: {
  GET: '/admin_pusat/pengguna',
  CREATE: '/admin_pusat/pengguna',
  DETAIL: (id) => `/admin_pusat/pengguna/${id}`,
  UPDATE: (id) => `/admin_pusat/pengguna/${id}`,
  DELETE: (id) => `/admin_pusat/pengguna/${id}`
},
ADMIN_LAPANGAN_LAPORAN: {
  GET: '/laporan-konservasi',
  CREATE: '/laporan-konservasi',        // ← tambahkan ini
  DETAIL: (id) => `/laporan-konservasi/${id}`,
  DELETE: (id) => `/laporan-konservasi/${id}`,
  UPDATE: (id) => `/laporan-konservasi/${id}`,
},

}