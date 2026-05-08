import React from 'react'
import { useNavigate } from 'react-router-dom'
import DashboardLayout from '../../../layouts/DashboardLayout'
import api from '../../../lib/api'

export default function PenggunaCreate() {
    const navigate = useNavigate()

    const [formData, setFormData] = React.useState({
        name: '',
        username: '',
        email: '',
        password: '',
        role: 'admin_lapangan'
    })

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            await api.post('/admin_pusat/pengguna', formData)

            navigate('/pengguna')
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <DashboardLayout title="Tambah Pengguna">

            <form onSubmit={handleSubmit}>
                <div className="white-box">

                    <div className="mb-3">
                        <label className="form-label">
                            Nama
                        </label>

                        <input
                            type="text"
                            className="form-control"
                            value={formData.name}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    name: e.target.value
                                })
                            }
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">
                            Username
                        </label>

                        <input
                            type="text"
                            className="form-control"
                            value={formData.username}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    username: e.target.value
                                })
                            }
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">
                            Email
                        </label>

                        <input
                            type="email"
                            className="form-control"
                            value={formData.email}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    email: e.target.value
                                })
                            }
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">
                            Password
                        </label>

                        <input
                            type="password"
                            className="form-control"
                            value={formData.password}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    password: e.target.value
                                })
                            }
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">
                            Role
                        </label>

                        <select
                            className="form-select"
                            value={formData.role}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    role: e.target.value
                                })
                            }
                        >
                            <option value="admin_lapangan">
                                Admin Lapangan
                            </option>

                            <option value="admin_pusat">
                                Admin Pusat
                            </option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-success"
                    >
                        Simpan
                    </button>

                </div>
            </form>
        </DashboardLayout>
    )
}