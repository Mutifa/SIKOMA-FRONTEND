import React from 'react'
import Template from '../../layouts/Template'
import profilPerusahaanService from '../../services/profilPerusahaanService'

const FILE_URL = 'https://codemy.my.id'

export default function Profil() {

  const [data, setData] = React.useState(null)
  const [loading, setLoading] = React.useState(true)
  const [imgKey, setImgKey] = React.useState(() => Date.now())

React.useEffect(() => {
  profilPerusahaanService.get()
    .then(res => {

      console.log('PROFILE PUBLIC', res.data)

      setData(res.data)
      setLoading(false)
      setImgKey(Date.now())
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

          {/* Logo */}
          {data?.logo && (
            <div className="text-center mb-4">
              <img
                src={`${FILE_URL}/uploads/profil/${data.logo}?t=${imgKey}`}
                alt="Logo"
                style={{
                  maxHeight: '180px',
                  maxWidth: '100%',
                }}
              />
            </div>
          )}

          <h1 className="mb-4 text-center">
            {data?.nama}
          </h1>

          <div className="mb-4">
            <h3>Visi</h3>
            <div
              dangerouslySetInnerHTML={{
                __html: data?.visi || ''
              }}
            />
          </div>

          <div className="mb-4">
            <h3>Misi</h3>
            <div
              dangerouslySetInnerHTML={{
                __html: data?.misi || ''
              }}
            />
          </div>

          {data?.struktur && (
            <div className="mb-4">
              <h3>Struktur Organisasi</h3>

              <img
                src={`${FILE_URL}/uploads/profil/${data.struktur}?t=${imgKey}`}
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