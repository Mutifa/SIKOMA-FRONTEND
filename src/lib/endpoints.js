export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    ME: '/profile'
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
}

}