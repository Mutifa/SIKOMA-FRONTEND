import React from 'react'
import { Link, useParams } from 'react-router-dom'
import DashboardLayout from '../../../layouts/DashboardLayout'
import { penggunaService } from '../../../services/penggunaService'

export default function PenggunaDetail() {

    const { id } = useParams()

    const [data, setData] = React.useState(null)
    const [loading, setLoading] = React.useState(true)

    React.useEffect(() => {

        let mounted = true

        penggunaService.getById(id)

            .then(res => {


                if (mounted) {

                    setData(
                        res.data.data || res.data
                    )

                    setLoading(false)
                }

            })

            .catch(err => {


                setLoading(false)

            })

        return () => { mounted = false }

    }, [id])

    if (loading) {
        return (
            <DashboardLayout title="Detail Pengguna">
            </DashboardLayout>
        )
    }

    return (

        <DashboardLayout 
            title="Detail Pengguna"
            actions={
                <Link
                    to="/pengguna"
                    className="btn btn-secondary"
                >
                    Kembali
                </Link>
            }
        >

            <div className="white-box">

                <div className="mb-3">

                    <label className="form-label fw-bold">
                        Nama
                    </label>

                    <input
                        type="text"
                        className="form-control"
                        value={data?.name || ''}
                        readOnly
                    />

                </div>

                <div className="mb-3">

                    <label className="form-label fw-bold">
                        Username
                    </label>

                    <input
                        type="text"
                        className="form-control"
                        value={data?.username || ''}
                        readOnly
                    />

                </div>

                <div className="mb-3">

                    <label className="form-label fw-bold">
                        Email
                    </label>

                    <input
                        type="email"
                        className="form-control"
                        value={data?.email || ''}
                        readOnly
                    />

                </div>
                <div className="mb-3">

                    <label className="form-label fw-bold">
                        Role
                    </label>

                    <input
                        type="text"
                        className="form-control"
                        value={data?.role || ''}
                        readOnly
                    />

                </div>

            </div>

        </DashboardLayout>

    )
}
