import React from 'react'
import { useParams } from 'react-router-dom'
import Template from '../../layouts/Template.jsx'
import api from '../../lib/api.js'

export default function InformasiDetail() {
    const { slug } = useParams()

    const [data, setData] = React.useState(null)
    const [loading, setLoading] = React.useState(true)
    const [error, setError] = React.useState('')

    React.useEffect(() => {
        let mounted = true

        api.get('/informasi')
            .then(res => {
                if (mounted) {
                    const allData = [
                        ...(res.data.executive || []),
                        ...(res.data.satwa || []),
                        ...(res.data.peraturan || [])
                    ]

                    const found = allData.find(item => item.slug === slug)

                    console.log(found) // 🔥 TAMBAHKAN DI SINI

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

    return (
        <Template title={`Detail Informasi`} active="informasi">
            <div className="container my-5">

                {loading && <p>Memuat...</p>}

                {error && <div className="alert alert-danger">{error}</div>}

                {!loading && !error && data && (
                    <div className="row">
                        {/* KIRI - GAMBAR */}
                        <div className="col-lg-6 mb-4">
                            {data?.foto && (
                                <img
                                    src={`https://codemy.my.id/uploads/edukasi/${data.foto}`}
                                    alt={data.judul}
                                    style={{
                                        width: '100%',
                                        height: 400,
                                        objectFit: 'cover',
                                        borderRadius: 10
                                    }}
                                />
                            )}
                        </div>

                        {/* KANAN - KONTEN */}
                        <div className="col-lg-6 mb-4">
                            <h1 className="mb-2">{data?.judul}</h1>
                            <hr />

                            {data?.deskripsi ? (
                                <div dangerouslySetInnerHTML={{ __html: data.deskripsi }} />
                            ) : (
                                <p>{data?.lokasi || 'Tidak ada deskripsi'}</p>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </Template>
    )
}