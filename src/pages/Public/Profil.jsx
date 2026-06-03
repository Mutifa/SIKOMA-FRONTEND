import React from 'react'
import Template from '../../layouts/Template'
import profilPerusahaanService from '../../services/profilPerusahaanService'

const FILE_URL = 'https://codemy.my.id'

export default function Profil() {

  const [data, setData] = React.useState(null)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    profilPerusahaanService.get()
      .then(res => {
        setData(res.data)
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <Template title="Profil" active="profil">
        <div className="container py-5">
          Loading...
        </div>
      </Template>
    )
  }

  return (
    <Template title="Profil" active="profil">

      <section className="container-xxl py-5">
        <div className="container">

          <h1 className="mb-4">{data?.nama}</h1>

          <div className="mb-4">
            <h3>Visi</h3>
            <p>{data?.visi}</p>
          </div>

          <div className="mb-4">
            <h3>Misi</h3>
            <p>{data?.misi}</p>
          </div>

          {data?.struktur && (
            <div className="mb-4">
              <h3>Struktur Organisasi</h3>

              <img
                src={`${FILE_URL}/uploads/profil/${data.struktur}`}
                alt="Struktur Organisasi"
                className="img-fluid"
              />
            </div>
          )}

        </div>
      </section>

    </Template>
  )
}