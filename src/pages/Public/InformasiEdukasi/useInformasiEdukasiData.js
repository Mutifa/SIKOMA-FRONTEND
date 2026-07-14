import React from 'react'
import informasiEdukasiService from '../../../services/informasiEdukasiService.js'

export function useInformasiEdukasiData() {
  const [data, setData] = React.useState({ informasi: [], edukasi: [], peraturan: [], kawasan: null })
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState('')

  React.useEffect(() => {
    let mounted = true

    informasiEdukasiService
      .getAll()
      .then((res) => {
        if (!mounted) return
        setData(res.data)
      })
      .catch((err) => {
        if (!mounted) return
        setError(err.message || 'Gagal memuat data informasi dan edukasi.')
      })
      .finally(() => {
        if (mounted) setLoading(false)
      })

    return () => {
      mounted = false
    }
  }, [])

  return { data, loading, error }
}

export function stripHtml(html = '') {
  return html.replace(/<[^>]*>/g, '').replace(/&[^;]+;/g, ' ').trim()
}

export function truncate(text, max = 110) {
  if (text.length <= max) return text
  return `${text.slice(0, max).replace(/\s+\S*$/, '')}...`
}
