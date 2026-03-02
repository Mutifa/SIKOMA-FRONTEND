import React from 'react'
import Template from '../layouts/Template.jsx'

export default function NotFound() {
  return (
    <Template title="Halaman Tidak Ditemukan">
      <section className="container py-5 text-center">
        <h1 className="display-4">404</h1>
        <p>Halaman tidak ditemukan.</p>
      </section>
    </Template>
  )
}


