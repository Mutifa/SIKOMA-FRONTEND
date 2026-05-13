import React from 'react'
import { useParams } from 'react-router-dom'
import Template from '../../layouts/Template.jsx'
import informasiService from '../../services/informasiService.js'
export default function InformasiDetail() {
    const { slug } = useParams()

    const [data, setData] = React.useState(null)
    const [loading, setLoading] = React.useState(true)
    const [error, setError] = React.useState('')

    React.useEffect(() => {
        let mounted = true

        informasiService.getAll()
            .then(res => {
                if (mounted) {
                    const allData = [
                        ...(res.data.executive || []),
                        ...(res.data.satwa || []),
                        ...(res.data.peraturan || [])
                    ]

                    const found = allData.find(item => item.slug === slug)

                    if (!found) {
                        setError('Data tidak ditemukan')
                    } else {
                        setData(found)
                    }

                    setLoading(false)
                }
            })
            .catch(err => {
                if (mounted) {
                    setError(err.message)
                    setLoading(false)
                }
            })

        return () => { mounted = false }
    }, [slug])

    // ✅ FORMAT DESKRIPSI JADI LIST RAPI
    const formatDeskripsi = (text) => {
        if (!text) return null

        return text.split('\n').map((item, index) => {
            if (!item.trim()) return null
            return (
                <li key={index}>
                    {item.replace('• ', '')}
                </li>
            )
        })
    }

    return (
        <Template title="Detail Informasi" active="informasi">
            <div className="container my-5">

                {loading && <p>Memuat...</p>}

                {error && <div className="alert alert-danger">{error}</div>}

                {!loading && !error && data && (
                    <div className="row align-items-start">

                        {/* GAMBAR */}
                        <div className="col-lg-6 mb-4">
                            {data?.foto && (
                                <img
                                    src={`https://codemy.my.id/uploads/edukasi/${data.foto}`}
                                    alt={data.judul}
                                    style={{
                                        width: '100%',
                                        height: 400,
                                        objectFit: 'cover',
                                        borderRadius: 12,
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                    }}
                                />
                            )}
                        </div>

                        {/* KONTEN */}
                        <div className="col-lg-6 mb-4">
                            <h1 style={{ fontWeight: 'bold' }}>
                                {data?.judul}
                            </h1>

                            <div
                                style={{
                                    width: 60,
                                    height: 4,
                                    backgroundColor: '#2e7d32',
                                    marginBottom: 15,
                                    borderRadius: 2
                                }}
                            />

                            {/* DESKRIPSI */}
                            <div className="deskripsi-content">
                                {data?.deskripsi ? (
                                    <ul>
                                        {formatDeskripsi(data.deskripsi)}
                                    </ul>
                                ) : (
                                    <p>{data?.lokasi || 'Tidak ada deskripsi'}</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Template>
    )
}