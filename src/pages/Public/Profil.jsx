import React from 'react'
import Template from '../../layouts/Template.jsx'

export default function Profil() {
  return (
    <Template title="Profil" active="profil">
      <section className="container-xxl py-5">
        <div className="container">
          <h1 className="mb-4">Profil</h1>
          <p>Struktur Organisasi, Visi Misi, dan Sejarah akan ditarik dari API.</p>
        </div>
      </section>
    </Template>
  )
}


