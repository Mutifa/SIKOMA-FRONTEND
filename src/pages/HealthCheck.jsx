import React from 'react'
import Template from '../layouts/Template.jsx'
import api from '../lib/api.js'

export default function HealthCheck() {
  const [status, setStatus] = React.useState('loading...')
  const [error, setError] = React.useState('')

  React.useEffect(() => {
    api.get('/api/health')
      .then(res => setStatus(JSON.stringify(res.data)))
      .catch(err => setError(err.message))
  }, [])

  return (
    <Template title="Health">
      <section className="container py-5">
        <h1 className="mb-3">Health Check</h1>
        {error ? (
          <div className="alert alert-danger">{error}</div>
        ) : (
          <pre>{status}</pre>
        )}
      </section>
    </Template>
  )}


